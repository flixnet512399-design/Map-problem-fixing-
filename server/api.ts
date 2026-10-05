import express, { Request, Response } from 'express';
import { ThinkingLevel, Type } from '@google/genai';
import { ai } from './gemini.js';

// Robust retry wrapper for transient 503 / 429 / UNAVAILABLE errors
async function callWithRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1200): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || err);
      const isTransient =
        errMsg.includes('503') ||
        errMsg.includes('429') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('high demand') ||
        errMsg.includes('ResourceExhausted');

      if (isTransient && attempt < retries - 1) {
        const wait = delayMs * Math.pow(1.5, attempt);
        console.warn(`[Gemini API Transient ${errMsg.slice(0, 80)}...] Retrying in ${wait}ms (attempt ${attempt + 1}/${retries})...`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export function createApiApp() {
  const router = express();
  router.use(express.json({ limit: '25mb' }));

  // Health check
  router.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Base system instruction enforcing safety, educational level design, and structured responses
  const SYSTEM_INSTRUCTION = `You are MapForge AI, an expert educational level designer, game artist, and troubleshooting assistant for battle royale and custom game maps (PUBG style, Unreal Engine 4/5, World Partition, Landscape tools, World of Wonder / WOW custom map editors, Unity, and generic BR level design).

CRITICAL ETHICAL & SAFETY MANDATE:
- This application is strictly an EDUCATIONAL and TROUBLESHOOTING tool for level designers, map creators, and modders working in map editors.
- NEVER provide cheats, wallhacks, aimbots, memory injection, speed hacks, unauthorized game file tampering, account bypasses, or methods to compromise game systems or anti-cheat.
- If asked about modifying running games unlawfully, refuse and redirect to legitimate map design, SDK tools, or level development workflows.

MULTILINGUAL SUPPORT:
- Support English, Urdu (اردو), and Roman Urdu seamlessly based on the user's selected language preference or prompt language.
- For Roman Urdu, use natural, clear Romanized Urdu (e.g., "Aapka landscape collision mesh missing ho sakta hai...").
- For Urdu (اردو), use proper Urdu script with clear technical terms preserved where helpful (e.g. Collision, Texture, Lightmap, LOD).

TECHNICAL / TROUBLESHOOTING RESPONSE STRUCTURE:
For every technical or problem-solving question, you MUST follow this structured format:
1. Problem Identified: Concise summary of what is malfunctioning.
2. Possible Cause: Primary reason why this occurs.
3. Step-by-Step Solution: Clear, numbered instructions to resolve it.
4. Recommended Settings / Configuration: Exact parameters (e.g., collision presets, LOD distances, lightmap resolution, brush sizes).
5. Common Mistakes: Pitfalls creators encounter when dealing with this.
6. How to Verify Fix: Objective test in the editor / PIE (Play In Editor).
7. Alternative Solution: Secondary method if the primary fix doesn't work.
8. Relevant Tutorial / Video Search Queries: 2-3 precise search phrases for documentation or video tutorials.

INFORMATION GAPS:
Do NOT pretend to know something if details are missing. If critical information is absent, explicitly ask the user for:
- Screenshot of editor / viewport / settings
- Exact error message / crash log
- Editor name and version (e.g., Unreal Engine 5.3, PUBG WOW Editor, Unity)
- Map type & size (e.g. 8x8 Island, 4x4 Desert, 2x2 CQC)
- Device / target platform (PC, Mobile, Console)
- What steps have already been attempted.`;

  // 1. AI Chat Endpoint
  router.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { messages, language = 'en', isDeepThink = false, projectContext } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      let langInstruction = 'Respond in English.';
      if (language === 'ur') {
        langInstruction = 'Respond in clean, natural Urdu (اردو) script. Keep technical editor terms clear.';
      } else if (language === 'roman_ur') {
        langInstruction = 'Respond in easy-to-read Roman Urdu (Urdu written in English script).';
      }

      let contextSnippet = '';
      if (projectContext) {
        contextSnippet = `\nActive Project Context:
- Project Name: ${projectContext.name || 'Unnamed'}
- Map Type/Theme: ${projectContext.theme || 'General'}
- Map Size: ${projectContext.size || 'Not specified'}
- Notes: ${projectContext.notes || 'None'}
- Recent Problems: ${JSON.stringify(projectContext.recentProblems || [])}
Use this context to give tailored advice without asking the user to repeat project details.`;
      }

      let deepThinkPrompt = '';
      if (isDeepThink) {
        deepThinkPrompt = `\n[DEEP PROBLEM SOLVE MODE ACTIVE]
Perform a deep technical root-cause analysis before delivering the final resolution.
Structure your response as follows:
## 🔬 Root-Cause Analysis
(Detailed breakdown of the underlying subsystem, shader pipeline, physics engine collision matrix, or memory footprint causing this)

## 📊 Ranked Likely Causes
1. [Highest Probability] ...
2. [Moderate Probability] ...
3. [Low Probability] ...

## 🛠️ Step-by-Step Fix
(Numbered, precise actionable instructions with editor button paths)

## ⚙️ Recommended Settings / Parameters
(Exact numerical values, collision presets, LOD levels, or streaming pool sizes)

## ✅ Verification Checklist
(Step-by-step checklist to confirm the issue is 100% resolved in editor & playtest)

## 🔄 Backup / Alternative Method
(Fallback technique if the standard solution fails)

## 🔍 Video & Documentation Search Terms
(Precise search terms for official documentation and developer tutorials)`;
      }

      // Convert message history to format expected by generateContent
      const contents = messages.map((m: { role: string; text: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const finalSystemInstruction = `${SYSTEM_INSTRUCTION}\n${langInstruction}${contextSnippet}${deepThinkPrompt}`;

      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: finalSystemInstruction,
            ...(isDeepThink ? { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } } : {}),
          },
        })
      );

      return res.json({
        reply: response.text,
        isDeepThink,
      });
    } catch (error: any) {
      console.error('[API Chat Error]:', error);
      return res.status(500).json({
        error: error.message || 'Failed to process AI chat request.',
      });
    }
  });

  // 2. AI Search with Google Search Grounding
  router.post('/api/search', async (req: Request, res: Response) => {
    try {
      const { query, language = 'en' } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Search query is required.' });
      }

      const prompt = `You are MapForge AI Search assistant. Research this battle royale level design or map creation query using official developer documentation, Unreal Engine resources, PUBG custom map/WOW documentation, and reputable technical guides:
Query: "${query}"

Provide:
1. Direct, authoritative technical answer.
2. Best practices and official recommendations.
3. Common pitfalls to avoid.

Language requirement: ${language === 'ur' ? 'Urdu' : language === 'roman_ur' ? 'Roman Urdu' : 'English'}.`;

      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{ googleSearch: {} }],
          },
        })
      );

      // Extract real grounding chunks from Google Search Grounding
      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: Array<{ title: string; url: string; domain: string; snippet?: string }> = [];
      const seenUrls = new Set<string>();

      for (const chunk of rawChunks) {
        if (chunk.web?.uri && !seenUrls.has(chunk.web.uri)) {
          seenUrls.add(chunk.web.uri);
          let domain = 'web';
          try {
            domain = new URL(chunk.web.uri).hostname.replace('www.', '');
          } catch {
            domain = 'web';
          }
          sources.push({
            title: chunk.web.title || domain,
            url: chunk.web.uri,
            domain,
            snippet: `Verified reference from ${domain}`,
          });
        }
      }

      return res.json({
        answer: response.text,
        sources,
        groundingMetadata: response.candidates?.[0]?.groundingMetadata || null,
      });
    } catch (error: any) {
      console.error('[API Search Error]:', error);
      return res.status(500).json({
        error: error.message || 'Failed to perform AI search.',
      });
    }
  });

  // 3. Find Tutorial Video
  router.post('/api/find-videos', async (req: Request, res: Response) => {
    try {
      const { problem, editor = 'Unreal Engine / PUBG Map Editor' } = req.body;
      if (!problem) {
        return res.status(400).json({ error: 'Problem description is required.' });
      }

      const prompt = `A game level designer has this specific map problem: "${problem}" in ${editor}.
Perform a search for relevant real video tutorials, developer walkthroughs, and documentation guides.

Extract search queries and list relevant video guides or tutorial topics.`;

      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{ googleSearch: {} }],
          },
        })
      );

      // Extract real video/web chunks
      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const videoLinks: Array<{ title: string; url: string; creator: string; whyItHelps: string }> = [];

      for (const chunk of rawChunks) {
        if (chunk.web?.uri) {
          const isYoutube = chunk.web.uri.includes('youtube.com') || chunk.web.uri.includes('youtu.be');
          const isDevDoc = chunk.web.uri.includes('epicgames.com') || chunk.web.uri.includes('unrealengine.com');
          if (isYoutube || isDevDoc || videoLinks.length < 4) {
            let creator = 'Game Dev Community';
            if (isYoutube) creator = 'YouTube Creator';
            if (isDevDoc) creator = 'Official Epic Games / Unreal Engine';

            videoLinks.push({
              title: chunk.web.title || 'Tutorial & Guide',
              url: chunk.web.uri,
              creator,
              whyItHelps: `Covers related workflows and troubleshooting for "${problem}"`,
            });
          }
        }
      }

      // Generate clean direct YouTube search query based on problem
      const cleanProblem = problem.replace(/[^\w\s]/gi, ' ').trim();
      const generatedSearchQuery = `${cleanProblem} ${editor} tutorial fix`.replace(/\s+/g, ' ');
      const directSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(generatedSearchQuery)}`;

      return res.json({
        searchQuery: generatedSearchQuery,
        directSearchUrl,
        explanation: response.text,
        results: videoLinks,
      });
    } catch (error: any) {
      console.error('[API Find Videos Error]:', error);
      return res.status(500).json({
        error: error.message || 'Failed to find tutorial videos.',
      });
    }
  });

  // 4. Upload & Analyze Screenshot
  router.post('/api/analyze-screenshot', async (req: Request, res: Response) => {
    try {
      const { imageBase64, mimeType = 'image/png', description = '', language = 'en' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Image base64 data is required.' });
      }

      // Clean base64 string if it contains data URI prefix
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

      const prompt = `Analyze this game map editor screenshot / error screen.
Additional context from user: "${description || 'Please diagnose any visible map issues, collision problems, terrain flaws, lighting errors, or UI warnings.'}"

Language for diagnosis: ${language === 'ur' ? 'Urdu' : language === 'roman_ur' ? 'Roman Urdu' : 'English'}.

You must return a valid JSON object matching this exact structure:
{
  "detectedProblem": "Short title of the problem detected",
  "visibleEvidence": "What visual evidence in the screenshot points to this (e.g. wireframe color, missing collision bounds, unbuilt lighting red seam, black foliage LOD, texture stretch)",
  "possibleCause": "The underlying technical reason (e.g. complex collision preset missing, landscape layer blend without weight-blended layer info, lightmap UV overlapping)",
  "recommendedFix": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "verificationSteps": "How to verify in viewport / PIE that it is fixed",
  "missingInfoPrompt": "If the screenshot is blurry or missing key panels (like Details panel or Collision View mode), state what additional view is needed, or leave empty if clear."
}`;

      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType,
                },
              },
              {
                text: prompt,
              },
            ],
          },
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                detectedProblem: { type: Type.STRING },
                visibleEvidence: { type: Type.STRING },
                possibleCause: { type: Type.STRING },
                recommendedFix: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                verificationSteps: { type: Type.STRING },
                missingInfoPrompt: { type: Type.STRING },
              },
              required: ['detectedProblem', 'visibleEvidence', 'possibleCause', 'recommendedFix', 'verificationSteps'],
            },
          },
        })
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('[API Analyze Screenshot Error]:', error);
      return res.status(500).json({
        error: error.message || 'Failed to analyze screenshot.',
      });
    }
  });

  // 5. AI Map Layout Generator
  router.post('/api/map-planner/generate-layout', async (req: Request, res: Response) => {
    try {
      const { mapSize = '4x4km', playerCount = 64, intensity = 'balanced', theme = 'Island / Forest' } = req.body;

      const prompt = `Generate a balanced battle royale conceptual map layout plan for:
- Map Dimension: ${mapSize}
- Player Capacity: ${playerCount} players
- Gameplay Intensity: ${intensity}
- Environment / Biome Theme: ${theme}

Provide 6 to 10 key tactical nodes/POIs (points of interest), major transit corridors (roads/rivers/bridges), terrain height landmarks (hills/ridges), and safe flow recommendations.
Return valid JSON.`;

      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                mapTitle: { type: Type.STRING },
                designPhilosophy: { type: Type.STRING },
                suggestedPois: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      type: { type: Type.STRING, description: 'Town, Military Base, Harbor, Factory, Ruins, Village, Hilltop, Bridge' },
                      x: { type: Type.NUMBER, description: 'X coordinate percentage from 5 to 95' },
                      y: { type: Type.NUMBER, description: 'Y coordinate percentage from 5 to 95' },
                      lootTier: { type: Type.STRING, description: 'High (Hot Drop), Medium, Low' },
                      combatStyle: { type: Type.STRING, description: 'Close Quarters, Mid Range, Sniper Vantage, Compound' },
                      description: { type: Type.STRING },
                    },
                    required: ['name', 'type', 'x', 'y', 'lootTier', 'description'],
                  },
                },
                terrainFeatures: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      feature: { type: Type.STRING },
                      placement: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                    },
                    required: ['feature', 'placement', 'purpose'],
                  },
                },
                rotationAndFlowAdvice: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['mapTitle', 'designPhilosophy', 'suggestedPois', 'terrainFeatures', 'rotationAndFlowAdvice'],
            },
          },
        })
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('[API Layout Gen Error]:', error);
      return res.status(500).json({
        error: error.message || 'Failed to generate layout idea.',
      });
    }
  });

  // 6. AI Map Design Review
  router.post('/api/map-planner/review', async (req: Request, res: Response) => {
    try {
      const { mapElements, mapSize = '4x4km', theme = 'Temperate Island', notes = '' } = req.body;

      if (!Array.isArray(mapElements) || mapElements.length === 0) {
        return res.status(400).json({ error: 'Please place at least one element on the map before requesting a review.' });
      }

      const elementsSummary = mapElements
        .map(
          (el: any) =>
            `- [${el.type}] "${el.name}" at coords (X: ${Math.round(el.x)}%, Y: ${Math.round(el.y)}%), size: ${el.width}x${el.height}, notes: ${el.notes || 'none'}`
        )
        .join('\n');

      const prompt = `Review this battle royale conceptual map layout:
- Map Scale: ${mapSize}
- Theme: ${theme}
- Creator Notes: ${notes || 'Standard Battle Royale flow'}
- Placed Elements (${mapElements.length} items):
${elementsSummary}

Evaluate strictly for:
1. Flow problems & choke points
2. Too-open "death valley" zones with no cover
3. Overly dense clusters causing frame drops or chaotic early wipeouts
4. Camp-heavy sniper spots with no counter-flank routes
5. Rotation problems across rivers/bridges/chokepoints
6. POI variety and loot distribution
7. Overall score (0-100) and scores for the 7 categories: Layout, Gameplay Flow, Variety, Balance, Navigation, Performance, Visual Design.

Return valid JSON.`;

      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
                categoryScores: {
                  type: Type.OBJECT,
                  properties: {
                    layout: { type: Type.INTEGER },
                    gameplayFlow: { type: Type.INTEGER },
                    variety: { type: Type.INTEGER },
                    balance: { type: Type.INTEGER },
                    navigation: { type: Type.INTEGER },
                    performance: { type: Type.INTEGER },
                    visualDesign: { type: Type.INTEGER },
                  },
                  required: ['layout', 'gameplayFlow', 'variety', 'balance', 'navigation', 'performance', 'visualDesign'],
                },
                summaryVerdict: { type: Type.STRING },
                flowProblems: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                tooOpenAreas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                tooDenseAreas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                campingAndSniperConcerns: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                rotationIssues: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                improvementSuggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'overallScore',
                'categoryScores',
                'summaryVerdict',
                'flowProblems',
                'tooOpenAreas',
                'tooDenseAreas',
                'campingAndSniperConcerns',
                'rotationIssues',
                'improvementSuggestions',
              ],
            },
          },
        })
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('[API Review Error]:', error);
      return res.status(500).json({
        error: error.message || 'Failed to review map.',
      });
    }
  });

  // 7. Error Solver
  router.post('/api/solve-error', async (req: Request, res: Response) => {
    try {
      const { errorMessage, editor = 'Unreal Engine / Map Editor', language = 'en' } = req.body;

      if (!errorMessage || typeof errorMessage !== 'string') {
        return res.status(400).json({ error: 'Error message text is required.' });
      }

      const prompt = `Diagnose and solve this game map / editor error message:
Editor: ${editor}
Raw Error Log / Message:
"""
${errorMessage}
"""

Language: ${language === 'ur' ? 'Urdu' : language === 'roman_ur' ? 'Roman Urdu' : 'English'}.

Return valid JSON with:
- errorCategory (e.g., Collision, Shader/Material, Cooking/Packaging, Navigation Mesh, Landscape, Memory/Crash, Lighting/Lightmass)
- likelyCause
- severity ('Critical', 'Warning', 'Moderate', 'Informational')
- fixSteps (array of actionable steps)
- relatedDocs (relevant official documentation topic or setting)
- videoSearchQuery (concise query to search for a video walkthrough)`;

      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                errorCategory: { type: Type.STRING },
                likelyCause: { type: Type.STRING },
                severity: { type: Type.STRING },
                fixSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                relatedDocs: { type: Type.STRING },
                videoSearchQuery: { type: Type.STRING },
              },
              required: ['errorCategory', 'likelyCause', 'severity', 'fixSteps', 'relatedDocs', 'videoSearchQuery'],
            },
          },
        })
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('[API Solve Error]:', error);
      return res.status(500).json({
        error: error.message || 'Failed to solve error.',
      });
    }
  });

  return router;
}
