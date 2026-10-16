import {
  LiveTraceStep,
  SupportedLanguage,
  VisualBox,
  WordBreakdown,
  ConditionCheckVisual,
  LoopTrackVisual,
} from '../types/visualizer';

/**
 * Breaks down any line of code into word-by-word tokens with 10-year-old-friendly definitions.
 */
export function breakDownLineWords(
  line: string,
  _lang: SupportedLanguage
): WordBreakdown[] {
  const trimmed = line.trim();
  if (!trimmed) return [];

  const results: WordBreakdown[] = [];

  // Regex to split into identifiers, numbers, operators, strings, punctuation
  const tokenRegex = /(".*?"|'.*?'|\b\w+\b|[+\-*/%=<>!&|]+|[;(),:{}\[\]])/g;
  let match;

  while ((match = tokenRegex.exec(trimmed)) !== null) {
    const word = match[0];

    // Classify keyword / token
    let color: WordBreakdown['color'] = 'slate';
    let simpleMeaning = `A word or symbol in our program (${word})`;

    if (['int', 'float', 'double', 'let', 'const', 'var', 'String', 'bool', 'auto'].includes(word)) {
      color = 'purple';
      simpleMeaning = `Tells the computer to create a new storage box (${word === 'int' ? 'for whole numbers' : 'in memory'}).`;
    } else if (['def', 'function', 'void', 'public', 'static', 'class'].includes(word)) {
      color = 'purple';
      simpleMeaning = `Defines a new reusable action or recipe for our program.`;
    } else if (['#include', '<iostream>', 'using', 'namespace', 'std'].includes(word)) {
      color = 'purple';
      simpleMeaning = `Imports pre-made tools so our program can talk to the screen and keyboard.`;
    } else if (['if', 'elif', 'else'].includes(word)) {
      color = 'rose';
      simpleMeaning = `A Decision Fork: Asks a True/False question before choosing which line to run.`;
    } else if (['for', 'while', 'range', 'in'].includes(word)) {
      color = 'amber';
      simpleMeaning = `A Repeat Loop: Tells the computer to repeat these lines over and over automatically.`;
    } else if (['print', 'cout', 'println', 'log', 'System', 'out', 'console'].includes(word)) {
      color = 'blue';
      simpleMeaning = `Show On Screen: Sends text or numbers to the computer monitor so the user can see them.`;
    } else if (word === '=') {
      color = 'rose';
      simpleMeaning = `PUT INSIDE: Calculate the right side and put the answer inside the box on the left.`;
    } else if (['==', '!=', '<', '>', '<=', '>='].includes(word)) {
      color = 'amber';
      simpleMeaning = `QUESTION CHECK: Compares both sides and answers YES (True) or NO (False).`;
    } else if (['+', '-', '*', '/', '%'].includes(word)) {
      color = 'emerald';
      simpleMeaning = `Math operation: Calculates a new number.`;
    } else if (word === ';') {
      color = 'slate';
      simpleMeaning = `End of Sentence: Like a period (.) in English, tells the computer this line is finished.`;
    } else if (/^\d+$/.test(word)) {
      color = 'emerald';
      simpleMeaning = `A whole number value (${word}).`;
    } else if (/^["'].*["']$/.test(word)) {
      color = 'emerald';
      simpleMeaning = `Text in quotes (called a string) that the computer reads literally.`;
    } else if (/^[a-zA-Z_]\w*$/.test(word)) {
      color = 'blue';
      simpleMeaning = `The name label on one of our storage boxes ("${word}").`;
    }

    results.push({
      token: word,
      color,
      simpleMeaning,
    });
  }

  return results;
}

/**
 * Traces arbitrary student-written code line-by-line and creates an animated visual narrative.
 */
export function traceStudentCode(
  rawCode: string,
  lang: SupportedLanguage
): LiveTraceStep[] {
  const lines = rawCode.split('\n');
  const steps: LiveTraceStep[] = [];

  // Memory store during simulation
  const memory: Record<string, { value: any; type: VisualBox['boxType'] }> = {};
  const previousMemoryValues: Record<string, any> = {};
  const screenOutput: string[] = [];

  let stepCounter = 1;
  const maxSteps = 120; // Safety guard against infinite loops

  // Filter out boilerplate wrappers in C++ / Java to highlight the real lines
  const isMeaningfulLine = (l: string) => {
    const t = l.trim();
    if (!t) return false;
    if (t.startsWith('//') || t.startsWith('#') || t.startsWith('/*')) return false;
    if (['{', '}', 'return 0;', 'public class Main {', 'public static void main(String[] args) {', 'int main() {', 'main();'].includes(t)) {
      return false;
    }
    return true;
  };

  // Find all meaningful lines with their original 1-indexed line numbers
  const indexedLines = lines
    .map((text, idx) => ({ lineNum: idx + 1, text }))
    .filter((item) => isMeaningfulLine(item.text));

  if (indexedLines.length === 0) {
    return [
      {
        stepNumber: 1,
        lineNumber: 1,
        rawCodeLine: rawCode.trim() || 'score = 10',
        headline: 'Waiting for your code',
        storyExplanation: 'Type your code on the left, and click "Visualize My Code" to watch the robot run it step-by-step!',
        wordBreakdowns: breakDownLineWords(rawCode.trim() || 'score = 10', lang),
        boxes: [],
        screenOutput: [],
      },
    ];
  }

  // Helper to snapshot current memory boxes
  const snapshotBoxes = (activeVarName?: string, activeAction: 'created' | 'updated' | 'read' = 'updated'): VisualBox[] => {
    return Object.keys(memory).map((name) => {
      const item = memory[name];
      const isTarget = name === activeVarName;
      const prev = previousMemoryValues[name];

      let friendlyType = 'Whole Number Box';
      if (item.type === 'text') friendlyType = 'Text Box';
      if (item.type === 'boolean') friendlyType = 'Yes/No Decision Box';
      if (item.type === 'list') friendlyType = 'Row of Lockers';
      if (item.type === 'pointer') friendlyType = 'Remote Control Pointer';

      return {
        name,
        value: Array.isArray(item.value) ? `[${item.value.join(', ')}]` : item.value,
        previousValue: prev !== undefined && prev !== item.value ? prev : undefined,
        boxType: item.type,
        friendlyTypeLabel: friendlyType,
        status: isTarget ? activeAction : 'unchanged',
        listValues: Array.isArray(item.value) ? item.value : undefined,
      };
    });
  };

  // Helper to safely evaluate simple arithmetic & variable lookups
  const evaluateSimpleExpression = (expr: string): any => {
    const cleanExpr = expr.trim().replace(/;$/, '');

    // String literal check
    const strMatch = cleanExpr.match(/^["'](.*)["']$/);
    if (strMatch) return strMatch[1];

    // Array / List literal check e.g. [10, 20, 30] or {10, 20, 30}
    const listMatch = cleanExpr.match(/^[\[{](.*)[\]}]$/);
    if (listMatch) {
      return listMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => (isNaN(Number(s)) ? s : Number(s)));
    }

    // Substitute current variable values into math expression
    let parsedExpr = cleanExpr;
    for (const vName of Object.keys(memory)) {
      const val = memory[vName].value;
      if (typeof val === 'number') {
        const regex = new RegExp(`\\b${vName}\\b`, 'g');
        parsedExpr = parsedExpr.replace(regex, val.toString());
      }
    }

    try {
      // Evaluate basic arithmetic safely
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${parsedExpr})`)();
      return result;
    } catch {
      return cleanExpr;
    }
  };

  // Main simulation loop across student lines
  let pc = 0;
  while (pc < indexedLines.length && steps.length < maxSteps) {
    const current = indexedLines[pc];
    const text = current.text.trim();
    const lineNum = current.lineNum;
    const words = breakDownLineWords(text, lang);

    // ================= PATTERN 1: Print statement =================
    // Python: print(...), C++: cout << ..., Java: System.out.println(...), JS: console.log(...)
    if (
      text.includes('print(') ||
      text.includes('cout <<') ||
      text.includes('System.out.print') ||
      text.includes('console.log(')
    ) {
      let printedVal = '';
      if (text.includes('cout <<')) {
        const parts = text.split('cout <<')[1].split(';')[0].split('<<');
        printedVal = parts
          .map((p) => {
            const trimmedP = p.trim();
            if (trimmedP.startsWith('"') && trimmedP.endsWith('"')) {
              return trimmedP.slice(1, -1);
            }
            if (memory[trimmedP]) return memory[trimmedP].value;
            return trimmedP;
          })
          .filter((p) => p !== 'endl' && p !== 'std::endl')
          .join(' ');
      } else {
        const insideMatch = text.match(/\((.*)\)/);
        if (insideMatch) {
          const rawArg = insideMatch[1].trim();
          if (rawArg.startsWith('"') && rawArg.endsWith('"')) {
            printedVal = rawArg.slice(1, -1);
          } else if (memory[rawArg]) {
            printedVal = String(memory[rawArg].value);
          } else {
            printedVal = String(evaluateSimpleExpression(rawArg));
          }
        }
      }

      screenOutput.push(printedVal);

      steps.push({
        stepNumber: stepCounter++,
        lineNumber: lineNum,
        rawCodeLine: text,
        headline: `Show on Screen: "${printedVal}"`,
        storyExplanation: `The robot reached a print command! It took "${printedVal}" and painted it right onto the computer monitor for the user to see.`,
        wordBreakdowns: words,
        boxes: snapshotBoxes(),
        screenOutput: [...screenOutput],
      });

      pc++;
      continue;
    }

    // ================= PATTERN 2: Variable Declaration or Assignment =================
    // Examples: score = 10, int score = 10;, score = score + 5, int numbers[] = {1, 2, 3};
    const assignMatch = text.match(
      /^(?:int|float|double|let|const|var|String|bool)?\s*\*?\s*([a-zA-Z_]\w*)\s*(?:\[\])?\s*=\s*(.*);?$/
    );

    if (assignMatch && !text.startsWith('if') && !text.startsWith('for') && !text.startsWith('while')) {
      const varName = assignMatch[1];
      const rawRhs = assignMatch[2].replace(/;$/, '').trim();
      const isNew = memory[varName] === undefined;

      const evaluated = evaluateSimpleExpression(rawRhs);
      const prevVal = memory[varName]?.value;
      previousMemoryValues[varName] = prevVal;

      let boxType: VisualBox['boxType'] = 'number';
      if (typeof evaluated === 'string') boxType = 'text';
      if (Array.isArray(evaluated)) boxType = 'list';
      if (rawRhs.startsWith('&')) boxType = 'pointer';

      memory[varName] = { value: evaluated, type: boxType };

      let headline = `Make a box named "${varName}" and put ${evaluated} inside`;
      let story = `The robot created a brand new labeled box called "${varName}". It calculated the right side (${rawRhs} = ${evaluated}) and placed it safely inside the box!`;

      if (!isNew) {
        headline = `Update box "${varName}": Change ${prevVal} ➔ ${evaluated}`;
        story = `The robot opened the "${varName}" box (which had ${prevVal}). It replaced the old number with the new answer ${evaluated}!`;
      }

      steps.push({
        stepNumber: stepCounter++,
        lineNumber: lineNum,
        rawCodeLine: text,
        headline,
        storyExplanation: story,
        wordBreakdowns: words,
        boxes: snapshotBoxes(varName, isNew ? 'created' : 'updated'),
        screenOutput: [...screenOutput],
      });

      pc++;
      continue;
    }

    // ================= PATTERN 3: Increment / Decrement (score += 5, score++) =================
    const incMatch = text.match(/^([a-zA-Z_]\w*)\s*(\+\+|--|\+=|-=|\*=)\s*(.*);?$/);
    if (incMatch) {
      const varName = incMatch[1];
      const op = incMatch[2];
      const rhs = incMatch[3].replace(/;$/, '').trim();

      const prev = memory[varName]?.value ?? 0;
      previousMemoryValues[varName] = prev;

      let newVal = prev;
      if (op === '++') newVal = prev + 1;
      else if (op === '--') newVal = prev - 1;
      else if (op === '+=') newVal = prev + evaluateSimpleExpression(rhs);
      else if (op === '-=') newVal = prev - evaluateSimpleExpression(rhs);
      else if (op === '*=') newVal = prev * evaluateSimpleExpression(rhs);

      memory[varName] = { value: newVal, type: 'number' };

      steps.push({
        stepNumber: stepCounter++,
        lineNumber: lineNum,
        rawCodeLine: text,
        headline: `Update "${varName}": ${prev} ➔ ${newVal}`,
        storyExplanation: `The robot grabbed the "${varName}" box, applied "${op} ${rhs || 1}", and dropped the new value ${newVal} back inside!`,
        wordBreakdowns: words,
        boxes: snapshotBoxes(varName, 'updated'),
        screenOutput: [...screenOutput],
      });

      pc++;
      continue;
    }

    // ================= PATTERN 4: If / Else Condition Check =================
    const ifMatch = text.match(/^if\s*\((.*)\)|^if\s+(.*):/);
    if (ifMatch) {
      const conditionExpr = (ifMatch[1] || ifMatch[2]).trim().replace(/:$/, '');

      // Evaluate condition
      let substituted = conditionExpr;
      for (const v of Object.keys(memory)) {
        const regex = new RegExp(`\\b${v}\\b`, 'g');
        substituted = substituted.replace(regex, `${v}(${memory[v].value})`);
      }

      let checkResult = true;
      try {
        let mathCondition = conditionExpr;
        for (const v of Object.keys(memory)) {
          const regex = new RegExp(`\\b${v}\\b`, 'g');
          mathCondition = mathCondition.replace(regex, memory[v].value);
        }
        // eslint-disable-next-line no-new-func
        checkResult = Boolean(Function(`"use strict"; return (${mathCondition})`)());
      } catch {
        checkResult = true;
      }

      const conditionVisual: ConditionCheckVisual = {
        expression: conditionExpr,
        substituted: `Is ${substituted}?`,
        result: checkResult,
        explanation: checkResult
          ? `YES! The question was True. The robot takes the road inside this IF block!`
          : `NO! The question was False. The robot will skip the lines inside this IF block.`,
      };

      steps.push({
        stepNumber: stepCounter++,
        lineNumber: lineNum,
        rawCodeLine: text,
        headline: `Decision Fork: Is ${conditionExpr}? ➔ ${checkResult ? 'YES! ✅' : 'NO ❌'}`,
        storyExplanation: `The robot reached a fork in the road! It checked: "${conditionVisual.substituted}". The answer is ${checkResult ? 'TRUE (YES)' : 'FALSE (NO)'}!`,
        wordBreakdowns: words,
        boxes: snapshotBoxes(),
        conditionCheck: conditionVisual,
        screenOutput: [...screenOutput],
      });

      pc++;
      continue;
    }

    // ================= PATTERN 5: For / While Loop =================
    const forMatch = text.match(/for\s*\(\s*(?:int)?\s*([a-zA-Z_]\w*)\s*=\s*(\d+);\s*([a-zA-Z_]\w*)\s*<\s*(\d+);|for\s+([a-zA-Z_]\w*)\s+in\s+range\((\d+)\)/);
    if (forMatch) {
      const loopVar = forMatch[1] || forMatch[5];
      const maxLaps = parseInt(forMatch[4] || forMatch[6] || '3', 10);

      // Simulate first lap
      memory[loopVar] = { value: 0, type: 'number' };

      const loopInfo: LoopTrackVisual = {
        loopType: 'for',
        currentLap: 1,
        totalLaps: maxLaps,
        conditionText: `${loopVar} < ${maxLaps}`,
      };

      steps.push({
        stepNumber: stepCounter++,
        lineNumber: lineNum,
        rawCodeLine: text,
        headline: `Start Repeat Loop: Lap 1 of ${maxLaps} (Set ${loopVar} = 0)`,
        storyExplanation: `The robot enters a repeat loop! It creates a counter box "${loopVar} = 0" to count its laps. It will repeat the lines inside until ${loopVar} reaches ${maxLaps}.`,
        wordBreakdowns: words,
        boxes: snapshotBoxes(loopVar, 'created'),
        loopInfo,
        screenOutput: [...screenOutput],
      });

      pc++;
      continue;
    }

    // Default fallback step for any line
    steps.push({
      stepNumber: stepCounter++,
      lineNumber: lineNum,
      rawCodeLine: text,
      headline: `Execute line: ${text}`,
      storyExplanation: `The robot follows instruction #${lineNum}: "${text}".`,
      wordBreakdowns: words,
      boxes: snapshotBoxes(),
      screenOutput: [...screenOutput],
    });

    pc++;
  }

  return steps;
}
