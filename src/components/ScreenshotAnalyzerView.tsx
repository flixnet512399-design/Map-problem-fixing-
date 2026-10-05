import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  FileImage,
  HelpCircle,
  BookmarkPlus,
  Check,
  Eye,
  Info,
} from 'lucide-react';
import { ScreenshotAnalysis } from '../types';
import { apiService } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useProjects } from '../context/ProjectContext';

export const ScreenshotAnalyzerView: React.FC = () => {
  const { language } = useSettings();
  const { activeProject, addSavedProblem } = useProjects();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [userDescription, setUserDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ScreenshotAnalysis | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image file type
    if (!file.type.startsWith('image/')) {
      setErrorStatus('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
      setAnalysis(null);
      setErrorStatus(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64 || isLoading) return;

    setIsLoading(true);
    setErrorStatus(null);
    setAnalysis(null);

    try {
      const res = await apiService.analyzeScreenshot({
        imageBase64,
        mimeType,
        description: userDescription,
        language,
      });
      setAnalysis(res);
    } catch (err: any) {
      console.error('Screenshot analysis error:', err);
      setErrorStatus(err.message || 'Failed to analyze screenshot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to load sample test images as mock canvas images for quick demonstration
  const handleLoadSample = (scenario: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext('2d')!;

    // Draw dark editor background
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, 800, 450);

    // Grid lines
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 450);
      ctx.stroke();
    }
    for (let y = 0; y < 450; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    if (scenario === 'collision') {
      // Draw building without wireframe collision
      ctx.fillStyle = '#d97706';
      ctx.fillRect(250, 180, 300, 180);
      ctx.fillStyle = '#09090b';
      ctx.fillRect(350, 240, 60, 120); // door
      ctx.fillRect(280, 210, 50, 50); // window
      ctx.fillRect(440, 210, 50, 50); // window
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('[VIEWPORT: PLAYER COLLISION VIEW - MESH HAS NO WIREFRAME PRIMITIVE]', 40, 50);
      setUserDescription('Players pass right through this warehouse wall in Play In Editor.');
    } else if (scenario === 'lightmap') {
      // Draw two walls with black seam
      ctx.fillStyle = '#a1a1aa';
      ctx.fillRect(150, 120, 240, 220);
      ctx.fillRect(410, 120, 240, 220);
      ctx.fillStyle = '#000000';
      ctx.fillRect(390, 120, 20, 220); // dark black seam
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('[LIGHTING BAKED: BLACK SEAM BETWEEN MODULAR WALL PANELS]', 40, 50);
      setUserDescription('Dark seam between two adjacent modular building walls after baking lighting.');
    } else {
      // Terrain slope stretch
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 300, 800, 150);
      ctx.fillStyle = '#78716c';
      ctx.beginPath();
      ctx.moveTo(100, 300);
      ctx.lineTo(400, 100);
      ctx.lineTo(600, 300);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('[LANDSCAPE VIEW: TEXTURE SMEARING ON 65-DEGREE CLIFF SLOPE]', 40, 50);
      setUserDescription('Landscape grass texture is vertically smeared on steep cliff slope.');
    }

    const dataUrl = canvas.toDataURL('image/png');
    setImagePreview(dataUrl);
    setImageBase64(dataUrl);
    setMimeType('image/png');
    setAnalysis(null);
    setErrorStatus(null);
  };

  const handleSaveToProject = () => {
    if (!activeProject || !analysis) return;
    addSavedProblem(
      activeProject.id,
      `[Screenshot Diagnosis] ${analysis.detectedProblem}`,
      `Visible Evidence: ${analysis.visibleEvidence}\nCause: ${analysis.possibleCause}\nFix:\n${analysis.recommendedFix.join('\n')}`
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>MULTIMODAL VIEWPORT VISION</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-['Chakra_Petch'] font-bold text-white">
          Screenshot Analyzer
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
          Upload screenshots of your map editor viewport, error popups, lighting seams, terrain artifacts, or collision wireframes for instant visual diagnostics.
        </p>
      </div>

      {/* Upload Zone & Quick Samples */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dropzone */}
        <div className="md:col-span-2 space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer bg-zinc-900/40 hover:bg-zinc-900/80 transition flex flex-col items-center justify-center min-h-[220px]"
          >
            {imagePreview ? (
              <div className="relative w-full max-h-[300px] overflow-hidden rounded-xl border border-zinc-800">
                <img
                  src={imagePreview}
                  alt="Screenshot preview"
                  className="w-full h-auto object-contain max-h-[280px] mx-auto"
                />
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-zinc-900/90 text-[10px] text-zinc-300 font-mono border border-zinc-700">
                  Click to replace image
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-semibold text-zinc-200 text-sm block">
                    Click to upload map editor screenshot
                  </span>
                  <span className="text-xs text-zinc-500">
                    Supports PNG, JPG, WEBP (Max 20MB)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 font-['Chakra_Petch'] uppercase tracking-wider mb-1">
              Additional Context / Symptoms (Optional)
            </label>
            <input
              type="text"
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
              placeholder="e.g. Players pass right through this wall, or grass disappeared after rebuilding..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/60 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!imageBase64 || isLoading}
            className={`w-full py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-lg ${
              imageBase64 && !isLoading
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-zinc-950 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Inspecting pixels & visual geometry...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Screenshot with Vision AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right side: Quick samples & tips */}
        <div className="space-y-4">
          <div className="rounded-xl p-4 bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-200 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              Try Demo Test Scenarios
            </h3>
            <p className="text-[11px] text-zinc-400">
              Don't have a screenshot ready? Load one of these realistic editor artifacts:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleLoadSample('collision')}
                className="w-full text-left p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 hover:border-emerald-500/40 text-xs text-zinc-300 transition"
              >
                <div className="font-semibold text-emerald-400">1. Missing Collision Wireframe</div>
                <div className="text-[10px] text-zinc-500">Player passing through building wall</div>
              </button>

              <button
                onClick={() => handleLoadSample('lightmap')}
                className="w-full text-left p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 hover:border-emerald-500/40 text-xs text-zinc-300 transition"
              >
                <div className="font-semibold text-emerald-400">2. Baked Lightmap Seams</div>
                <div className="text-[10px] text-zinc-500">Black divide between modular wall meshes</div>
              </button>

              <button
                onClick={() => handleLoadSample('terrain')}
                className="w-full text-left p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 hover:border-emerald-500/40 text-xs text-zinc-300 transition"
              >
                <div className="font-semibold text-emerald-400">3. Stretched Cliff Texture</div>
                <div className="text-[10px] text-zinc-500">Vertical texture smears on steep hillside</div>
              </button>
            </div>
          </div>

          <div className="rounded-xl p-4 bg-zinc-900/40 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-2">
            <div className="font-semibold text-zinc-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-500" /> Best Screenshot Practices:
            </div>
            <ul className="list-disc pl-4 space-y-1 text-zinc-500">
              <li>Include the Details panel with collision or LOD settings visible.</li>
              <li>Switch viewport to Player Collision or Wireframe mode for mesh issues.</li>
              <li>Ensure error popups or crash callstacks are clearly legible.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-zinc-900 border border-emerald-500/30 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <div className="text-sm font-semibold text-emerald-300 font-mono">
            Analyzing visual evidence & shader coordinates...
          </div>
        </div>
      )}

      {/* Error state */}
      {errorStatus && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-900 text-red-300 text-xs flex items-center justify-between">
          <span>{errorStatus}</span>
          <button
            onClick={handleAnalyze}
            className="px-3 py-1 bg-red-900/60 hover:bg-red-800/60 text-white rounded text-xs transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Analysis Result Card */}
      {analysis && (
        <div className="rounded-2xl p-6 bg-zinc-900 border border-emerald-500/40 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-0.5">
                VISUAL DIAGNOSIS COMPLETE
              </span>
              <h2 className="font-['Chakra_Petch'] font-bold text-lg text-zinc-100">
                {analysis.detectedProblem}
              </h2>
            </div>

            {activeProject && (
              <button
                onClick={handleSaveToProject}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-xs text-emerald-300 transition"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved to Project' : 'Save to Project Notes'}</span>
              </button>
            )}
          </div>

          {/* Grid of Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-xs font-semibold text-amber-400 font-mono uppercase tracking-wider block mb-1">
                Visible Evidence Detected
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {analysis.visibleEvidence}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider block mb-1">
                Underlying Technical Cause
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {analysis.possibleCause}
              </p>
            </div>
          </div>

          {/* Recommended Step-by-Step Fix */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider block">
              Recommended Step-by-Step Fix
            </span>
            <ul className="space-y-1.5 text-xs text-zinc-200">
              {analysis.recommendedFix.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Verification Steps */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider block mb-1">
              How To Verify In Viewport / PIE
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {analysis.verificationSteps}
            </p>
          </div>

          {/* Missing Info Prompt if screenshot was unclear */}
          {analysis.missingInfoPrompt && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <span className="font-semibold block mb-0.5">Need Additional Detail:</span>
                <span>{analysis.missingInfoPrompt}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
