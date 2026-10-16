export type SupportedLanguage = 'python' | 'cpp' | 'java' | 'javascript';

export interface VisualConceptCard {
  title: string;
  subtitle: string;
  explanation: string;
  analogyTagline: string;
  widgetType:
    | 'robot_talk'
    | 'variable_box'
    | 'math_update'
    | 'decision_gate'
    | 'loop_track'
    | 'locker_rack'
    | 'function_machine'
    | 'pointer_remote';
  initialBoxName?: string;
  initialBoxValue?: string | number;
}

export interface VisualQuizOption {
  id: string;
  label: string;
  sublabel?: string;
  isCorrect: boolean;
  explanation: string;
}

export interface VisualQuizCard {
  question: string;
  contextNote?: string;
  options: VisualQuizOption[];
}

export interface CodeChallengeCard {
  instruction: string;
  targetVarName?: string;
  expectedValue?: any;
  expectedOutputIncludes?: string;
  starterCode: Record<SupportedLanguage, string>;
  hint: string;
}

export interface MissionGoal {
  description: string;
  targetVarName?: string;
  expectedValue?: any;
  expectedOutputIncludes?: string;
  hint: string;
}

export interface LevelMission {
  id: string;
  levelNumber: number;
  emoji: string;
  title: string;
  shortTagline: string;
  conceptAnalogy?: string;
  xpReward: number;
  starterCode: Record<SupportedLanguage, string>;
  goal: MissionGoal;
  concept?: VisualConceptCard;
  quiz?: VisualQuizCard;
  challenge?: CodeChallengeCard;
}

export interface BrilliantLesson {
  id: string;
  levelNumber: number;
  emoji: string;
  title: string;
  shortTagline: string;
  conceptAnalogy?: string;
  xpReward: number;
  starterCode?: Record<SupportedLanguage, string>;
  goal?: MissionGoal;
  // Brilliant 3-Phase Flow
  concept: VisualConceptCard;
  quiz: VisualQuizCard;
  challenge: CodeChallengeCard;
}

export interface VisualStorageBox {
  name: string;
  value: string | number;
  previousValue?: string | number;
  isNew?: boolean;
  hasChanged?: boolean;
  typeLabel: string;
  listItems?: (string | number)[];
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
  matchedLessonId?: string;
  matchedMissionId?: string;
  completed: boolean;
}

export interface CustomSyllabusRoadmap {
  courseTitle: string;
  detectedLanguage: SupportedLanguage;
  createdAt: string;
  items: SyllabusRoadmapItem[];
}
