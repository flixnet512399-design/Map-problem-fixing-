export type Language = 'en' | 'ur' | 'roman_ur';

export type EditorPreference = 'Unreal Engine 5' | 'Unreal Engine 4' | 'PUBG WOW Editor' | 'Unity / Generic';

export type ResponseLength = 'concise' | 'balanced' | 'detailed';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isDeepThink?: boolean;
}

export interface GroundingSource {
  title: string;
  url: string;
  domain: string;
  snippet?: string;
}

export interface VideoResult {
  title: string;
  url: string;
  creator: string;
  whyItHelps: string;
}

export interface ScreenshotAnalysis {
  detectedProblem: string;
  visibleEvidence: string;
  possibleCause: string;
  recommendedFix: string[];
  verificationSteps: string;
  missingInfoPrompt?: string;
}

export interface ErrorSolution {
  errorCategory: string;
  likelyCause: string;
  severity: 'Critical' | 'Warning' | 'Moderate' | 'Informational';
  fixSteps: string[];
  relatedDocs: string;
  videoSearchQuery: string;
}

export interface MapElement {
  id: string;
  name: string;
  type: 'town' | 'military' | 'compound' | 'road' | 'river' | 'bridge' | 'hill' | 'open_zone' | 'spawn' | 'vehicle';
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  width: number; // size in percentage
  height: number;
  rotation?: number;
  lootTier?: 'High' | 'Medium' | 'Low';
  notes?: string;
}

export interface MapReviewResult {
  overallScore: number;
  categoryScores: {
    layout: number;
    gameplayFlow: number;
    variety: number;
    balance: number;
    navigation: number;
    performance: number;
    visualDesign: number;
  };
  summaryVerdict: string;
  flowProblems: string[];
  tooOpenAreas: string[];
  tooDenseAreas: string[];
  campingAndSniperConcerns: string[];
  rotationIssues: string[];
  improvementSuggestions: string[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  category: string;
  tips?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  mapSize: '1x1km' | '2x2km' | '4x4km' | '8x8km';
  theme: string;
  targetPlayers: number;
  notes: string;
  checklist: ChecklistItem[];
  mapElements: MapElement[];
  savedProblems: Array<{
    id: string;
    problem: string;
    solution: string;
    date: string;
  }>;
  savedTutorials: Array<{
    id: string;
    title: string;
    url: string;
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AcademyModule {
  id: number;
  title: string;
  subtitle: string;
  iconName: string;
  beginnerExplanation: string;
  stepByStepLesson: string[];
  practicalTask: string;
  commonMistakes: string[];
  troubleshooting: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface TroubleshootingItem {
  id: string;
  category: 'Terrain' | 'Objects' | 'Buildings' | 'Collision' | 'Lighting' | 'Textures' | 'Performance' | 'Loading' | 'Errors' | 'Gameplay' | 'UI' | 'Navigation';
  problem: string;
  severity: 'Critical' | 'Warning' | 'Moderate';
  likelyCause: string;
  fix: string[];
  alternativeFix: string;
  howToTest: string;
  prevention: string;
}
