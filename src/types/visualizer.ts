export type SupportedLanguage = 'python' | 'cpp' | 'java' | 'javascript';

export interface WordBreakdown {
  token: string;          // e.g. "int", "score", "=", "10", ";"
  color: 'purple' | 'blue' | 'amber' | 'emerald' | 'rose' | 'slate';
  simpleMeaning: string;  // e.g. "Tells the computer this box holds a whole number"
}

export interface VisualBox {
  name: string;           // Box label e.g. "score"
  value: string | number;
  previousValue?: string | number; // Shows "10 ➔ 15" transition animation
  boxType: 'number' | 'text' | 'boolean' | 'list' | 'pointer';
  friendlyTypeLabel: string; // e.g. "Whole Number Box", "Text Box", "Locker Row"
  status: 'created' | 'updated' | 'read' | 'unchanged';
  listValues?: (string | number)[]; // If it's a list/array, shows numbered lockers #0, #1, #2
  activeLockerIndex?: number;       // Highlights which locker is being opened
  pointsToBoxName?: string;         // If it's a pointer, which box it points to
}

export interface ConditionCheckVisual {
  expression: string;     // e.g. "score > 10"
  substituted: string;    // e.g. "Is 15 > 10?"
  result: boolean;        // true = YES ✅, false = NO ❌
  explanation: string;
}

export interface LoopTrackVisual {
  loopType: 'for' | 'while';
  currentLap: number;
  totalLaps?: number;
  conditionText: string;
}

export interface LiveTraceStep {
  stepNumber: number;
  lineNumber: number;            // 1-indexed line in student's code
  rawCodeLine: string;
  headline: string;              // Short friendly title e.g. "Create a new box called 'score'"
  storyExplanation: string;      // Friendly 10-year-old explanation of what the robot just did
  wordBreakdowns: WordBreakdown[];// Explains every word and symbol on this line!
  boxes: VisualBox[];            // All storage boxes currently in memory
  conditionCheck?: ConditionCheckVisual;
  loopInfo?: LoopTrackVisual;
  screenOutput: string[];        // Lines printed to screen so far
  errorHelp?: string;            // Friendly hint if student made a typo
}

export interface StarterLesson {
  id: string;
  stepOrder: number;
  emoji: string;
  title: string;
  kidSubtitle: string;
  conceptComicTitle: string;
  conceptComicExplanation: string;
  conceptAnalogy: string;
  keywords: string[];            // Used by Syllabus PDF/Image Matcher
  starterCode: Record<SupportedLanguage, string>;
}

export interface SyllabusWeekItem {
  id: string;
  weekLabel: string;
  rawMatchedLine: string;
  lessonId: string;
  completed: boolean;
}

export interface CustomSyllabusRoadmap {
  courseTitle: string;
  detectedLanguage: SupportedLanguage;
  createdAt: string;
  extractedTextPreview: string;
  items: SyllabusWeekItem[];
}
