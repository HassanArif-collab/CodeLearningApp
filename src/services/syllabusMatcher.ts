import { CustomSyllabusRoadmap, SupportedLanguage, SyllabusRoadmapItem } from '../types/visualizer';
import { ALL_MISSIONS } from '../data/conceptsData';

const STORAGE_KEY = 'codelens_custom_roadmap_v3';

export const SAMPLE_SYLLABI: { title: string; language: SupportedLanguage; text: string }[] = [
  {
    title: 'Beginner Coding 101 (Python)',
    language: 'python',
    text: `Intro to Computer Science & Coding Basics
Week 1: Talking to the computer: print statements and output.
Week 2: Variables as storage boxes, numbers, and strings.
Week 3: Doing math in code and updating variables.
Week 4: If / else decision gates and comparisons.
Week 5: For loops, repeat tracks, and counting iterations.
Week 6: Lists, sequences, and accessing items by index number.`
  },
  {
    title: 'Semester 1: Intro to C++ Programming',
    language: 'cpp',
    text: `CS 101: Introduction to Programming in C++
Unit 1: Program structure, main function, and console output with std::cout.
Unit 2: Variable declaration, data types (int, float), and memory assignment.
Unit 3: Arithmetic operators, updating variable values in place.
Unit 4: Conditional statements (if, else if, else) and comparison operators.
Unit 5: For loops, while loops, and loop counters.
Unit 6: Arrays and accessing elements by index number.
Unit 7: Pointers, memory addresses (&), and dereferencing (*).`
  },
  {
    title: 'Java Programming & Object Basics',
    language: 'java',
    text: `CS 201: Java Programming Fundamentals
Module 1: Java basics, System.out.println, and the main method.
Module 2: Variables, int, boolean, and assignment statements.
Module 3: Mathematical expressions and updating variable values.
Module 4: Decision making: If and Else statements in Java.
Module 5: Looping constructs: For and While repeat loops.
Module 6: Arrays of elements and array indexing.`
  }
];

export function detectLanguageFromSyllabus(text: string): SupportedLanguage {
  const lower = text.toLowerCase();
  let cppScore = 0;
  let pythonScore = 0;
  let javaScore = 0;
  let jsScore = 0;

  if (lower.includes('c++') || lower.includes('cpp') || lower.includes('cout') || lower.includes('pointer')) cppScore += 8;
  if (lower.includes('python') || lower.includes('def ') || lower.includes('print(')) pythonScore += 8;
  if (lower.includes('java ') || lower.includes('system.out') || lower.includes('public static')) javaScore += 8;
  if (lower.includes('javascript') || lower.includes('console.log') || lower.includes('let ') || lower.includes('const ')) jsScore += 8;

  const max = Math.max(cppScore, pythonScore, javaScore, jsScore);
  if (max === 0) return 'python';

  if (max === pythonScore) return 'python';
  if (max === cppScore) return 'cpp';
  if (max === javaScore) return 'java';
  return 'javascript';
}

export function parseSyllabusToRoadmap(
  rawText: string,
  userSelectedTitle?: string
): CustomSyllabusRoadmap {
  const detectedLanguage = detectLanguageFromSyllabus(rawText);
  const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 5);

  const matchedItems: SyllabusRoadmapItem[] = [];
  const usedMissions = new Set<string>();

  const labelRegex = /(Week\s+\d+|Unit\s+\d+|Module\s+\d+|Lecture\s+\d+|Chapter\s+\d+)/i;
  let seq = 1;

  for (const line of lines) {
    const lower = line.toLowerCase();
    const labelMatch = line.match(labelRegex);
    const weekLabel = labelMatch ? labelMatch[1] : `Lesson ${seq}`;

    let bestMissionId: string | null = null;
    let highestScore = 0;

    for (const mission of ALL_MISSIONS) {
      if (usedMissions.has(mission.id)) continue;

      let score = 0;
      const kwList = [mission.title.toLowerCase(), mission.shortTagline.toLowerCase()];
      if (mission.levelNumber === 1 && (lower.includes('print') || lower.includes('output') || lower.includes('hello'))) score += 3;
      if (mission.levelNumber === 2 && (lower.includes('variable') || lower.includes('declaration') || lower.includes('assignment'))) score += 3;
      if (mission.levelNumber === 3 && (lower.includes('math') || lower.includes('arithmetic') || lower.includes('update'))) score += 3;
      if (mission.levelNumber === 4 && (lower.includes('if') || lower.includes('else') || lower.includes('condition'))) score += 3;
      if (mission.levelNumber === 5 && (lower.includes('loop') || lower.includes('for') || lower.includes('while'))) score += 3;
      if (mission.levelNumber === 6 && (lower.includes('array') || lower.includes('list') || lower.includes('index'))) score += 3;
      if (mission.levelNumber === 7 && (lower.includes('function') || lower.includes('method') || lower.includes('parameters'))) score += 3;
      if (mission.levelNumber === 8 && (lower.includes('pointer') || lower.includes('reference') || lower.includes('address'))) score += 3;

      for (const kw of kwList) {
        if (lower.includes(kw)) score += 2;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMissionId = mission.id;
      }
    }

    if (bestMissionId && highestScore >= 2) {
      usedMissions.add(bestMissionId);
      matchedItems.push({
        id: `step-${seq}`,
        weekLabel,
        rawMatchedLine: line,
        matchedMissionId: bestMissionId,
        completed: false,
      });
      seq++;
    }
  }

  // Fallback: Add remaining missions if fewer than 4 matched
  if (matchedItems.length < 4) {
    for (const mission of ALL_MISSIONS) {
      if (!usedMissions.has(mission.id) && matchedItems.length < 6) {
        usedMissions.add(mission.id);
        matchedItems.push({
          id: `step-${seq}`,
          weekLabel: `Lesson ${seq}`,
          rawMatchedLine: mission.title,
          matchedMissionId: mission.id,
          completed: false,
        });
        seq++;
      }
    }
  }

  const roadmap: CustomSyllabusRoadmap = {
    courseTitle: userSelectedTitle || 'My School Coding Roadmap',
    detectedLanguage,
    createdAt: new Date().toISOString(),
    items: matchedItems,
  };

  saveRoadmapToStorage(roadmap);
  return roadmap;
}

export function saveRoadmapToStorage(roadmap: CustomSyllabusRoadmap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmap));
  } catch {
    // ignore
  }
}

export function getRoadmapFromStorage(): CustomSyllabusRoadmap | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
