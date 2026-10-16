export type SupportedLanguage = 'python' | 'cpp' | 'java' | 'javascript';

export interface MissionGoal {
  description: string;            // Simple 1-sentence goal e.g. "Make the robot print 'Hello, World!'"
  targetVarName?: string;         // Variable to inspect e.g. "coins"
  expectedValue?: any;            // Target value e.g. 50
  expectedOutputIncludes?: string;// Text printed to screen e.g. "Hello, World!"
  hint: string;                   // Friendly hint if student is stuck
}

export interface LevelMission {
  id: string;
  chapterNumber: number;
  levelNumber: number;
  emoji: string;
  title: string;
  shortTagline: string;
  conceptAnalogy: string;         // 1-2 sentence real-world metaphor
  goal: MissionGoal;
  starterCode: Record<SupportedLanguage, string>;
  xpReward: number;
}

export interface RoadmapChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  levels: LevelMission[];
}

export interface VisualStorageBox {
  name: string;
  value: string | number;
  previousValue?: string | number;
  isNew?: boolean;
  hasChanged?: boolean;
  typeLabel: string;              // "Number", "Text", "Locker Row", "Remote Pointer"
  listItems?: (string | number)[];
  activeLockerIdx?: number;
  pointsToBoxName?: string;
}

export interface LiveTraceStep {
  stepNumber: number;
  lineNumber: number;
  rawLine: string;
  storyHeadline: string;
  storyDetail: string;
  boxes: VisualStorageBox[];
  conditionCheck?: {
    question: string;
    result: boolean;
    explanation: string;
  };
  loopCheck?: {
    currentLap: number;
    totalLaps?: number;
    conditionText: string;
  };
  screenOutput: string[];
}

export interface SyllabusRoadmapItem {
  id: string;
  weekLabel: string;
  rawMatchedLine: string;
  matchedMissionId: string;
  completed: boolean;
}

export interface CustomSyllabusRoadmap {
  courseTitle: string;
  detectedLanguage: SupportedLanguage;
  createdAt: string;
  items: SyllabusRoadmapItem[];
}
