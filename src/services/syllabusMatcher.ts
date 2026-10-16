import { CustomSyllabusRoadmap, SupportedLanguage, SyllabusWeekItem } from '../types/visualizer';
import { STARTER_LESSONS } from '../data/conceptsData';

const STORAGE_KEY = 'codelens_custom_roadmap_v2';

export const SAMPLE_SYLLABI: { title: string; language: SupportedLanguage; text: string }[] = [
  {
    title: 'Beginner Coding 101 (Python)',
    language: 'python',
    text: `Intro to Computer Science & Coding Basics
Week 1: What is a computer program? Using print statements to talk to the screen.
Week 2: Variables as storage boxes, numbers, strings, and variable naming.
Week 3: Doing math in code, updating variables, and accumulator patterns.
Week 4: If / else decision forks, comparisons, and boolean logic.
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
Module 2: Primitive variables, int, boolean, and assignment statements.
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
  if (max === 0) return 'python'; // Default to easiest for beginners

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

  const matchedItems: SyllabusWeekItem[] = [];
  const usedLessons = new Set<string>();

  const labelRegex = /(Week\s+\d+|Unit\s+\d+|Module\s+\d+|Lecture\s+\d+|Chapter\s+\d+)/i;
  let seq = 1;

  for (const line of lines) {
    const lower = line.toLowerCase();
    const labelMatch = line.match(labelRegex);
    const weekLabel = labelMatch ? labelMatch[1] : `Lesson ${seq}`;

    let bestLessonId: string | null = null;
    let highestScore = 0;

    for (const lesson of STARTER_LESSONS) {
      if (usedLessons.has(lesson.id)) continue;

      let score = 0;
      for (const kw of lesson.keywords) {
        if (lower.includes(kw.toLowerCase())) score += 2;
      }

      if (score > highestScore) {
        highestScore = score;
        bestLessonId = lesson.id;
      }
    }

    if (bestLessonId && highestScore >= 2) {
      usedLessons.add(bestLessonId);
      matchedItems.push({
        id: `step-${seq}`,
        weekLabel,
        rawMatchedLine: line,
        lessonId: bestLessonId,
        completed: false,
      });
      seq++;
    }
  }

  // Fallback: Add remaining lessons if fewer than 4 matched
  if (matchedItems.length < 4) {
    for (const lesson of STARTER_LESSONS) {
      if (!usedLessons.has(lesson.id) && matchedItems.length < 6) {
        usedLessons.add(lesson.id);
        matchedItems.push({
          id: `step-${seq}`,
          weekLabel: `Lesson ${seq}`,
          rawMatchedLine: lesson.title,
          lessonId: lesson.id,
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
    extractedTextPreview: rawText.slice(0, 300) + (rawText.length > 300 ? '...' : ''),
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
