import {
  LiveTraceStep,
  SupportedLanguage,
  VisualStorageBox,
  MissionGoal,
} from '../types/visualizer';

/**
 * Traces arbitrary student-written code line-by-line and creates an animated visual narrative.
 */
export function traceStudentCode(
  rawCode: string,
  _lang: SupportedLanguage
): LiveTraceStep[] {
  const lines = rawCode.split('\n');
  const steps: LiveTraceStep[] = [];

  const memory: Record<string, { value: any; typeLabel: string }> = {};
  const previousMemoryValues: Record<string, any> = {};
  const screenOutput: string[] = [];

  let stepCounter = 1;
  const maxSteps = 100;

  const isMeaningfulLine = (l: string) => {
    const t = l.trim();
    if (!t) return false;
    if (t.startsWith('//') || t.startsWith('#') || t.startsWith('/*')) return false;
    if (['{', '}', 'return 0;', 'public class Main {', 'public static void main(String[] args) {', 'int main() {', 'main();'].includes(t)) {
      return false;
    }
    return true;
  };

  const indexedLines = lines
    .map((text, idx) => ({ lineNum: idx + 1, text }))
    .filter((item) => isMeaningfulLine(item.text));

  if (indexedLines.length === 0) {
    return [
      {
        stepNumber: 1,
        lineNumber: 1,
        rawLine: rawCode.trim() || 'print("Hello, World!")',
        storyHeadline: 'Waiting for code',
        storyDetail: 'Type code on the left and click "Run Code" to watch the robot execute it!',
        boxes: [],
        screenOutput: [],
      },
    ];
  }

  const snapshotBoxes = (activeVarName?: string, isNew = false): VisualStorageBox[] => {
    return Object.keys(memory).map((name) => {
      const item = memory[name];
      const isTarget = name === activeVarName;
      const prev = previousMemoryValues[name];

      return {
        name,
        value: Array.isArray(item.value) ? `[${item.value.join(', ')}]` : item.value,
        previousValue: prev !== undefined && prev !== item.value ? prev : undefined,
        isNew: isTarget && isNew,
        hasChanged: isTarget && !isNew,
        typeLabel: item.typeLabel,
        listItems: Array.isArray(item.value) ? item.value : undefined,
      };
    });
  };

  const evaluateSimpleExpression = (expr: string): any => {
    const cleanExpr = expr.trim().replace(/;$/, '');

    const strMatch = cleanExpr.match(/^["'](.*)["']$/);
    if (strMatch) return strMatch[1];

    const listMatch = cleanExpr.match(/^[\[{](.*)[\]}]$/);
    if (listMatch) {
      return listMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => (isNaN(Number(s)) ? s : Number(s)));
    }

    let parsedExpr = cleanExpr;
    for (const vName of Object.keys(memory)) {
      const val = memory[vName].value;
      if (typeof val === 'number') {
        const regex = new RegExp(`\\b${vName}\\b`, 'g');
        parsedExpr = parsedExpr.replace(regex, val.toString());
      }
    }

    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${parsedExpr})`)();
      return result;
    } catch {
      return cleanExpr;
    }
  };

  let pc = 0;
  while (pc < indexedLines.length && steps.length < maxSteps) {
    const current = indexedLines[pc];
    const text = current.text.trim();
    const lineNum = current.lineNum;

    // 1. PRINT COMMANDS
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
        rawLine: text,
        storyHeadline: `Displayed: "${printedVal}"`,
        storyDetail: `The robot executed the display command and printed "${printedVal}" to the screen.`,
        boxes: snapshotBoxes(),
        screenOutput: [...screenOutput],
      });

      pc++;
      continue;
    }

    // 2. VARIABLE DECLARATION / ASSIGNMENT
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

      let typeLabel = 'Number';
      if (typeof evaluated === 'string') typeLabel = 'Text';
      if (Array.isArray(evaluated)) typeLabel = 'Locker Row';
      if (rawRhs.startsWith('&') || rawRhs.startsWith('new Box')) typeLabel = 'Remote Pointer';

      memory[varName] = { value: evaluated, typeLabel };

      steps.push({
        stepNumber: stepCounter++,
        lineNumber: lineNum,
        rawLine: text,
        storyHeadline: isNew ? `Created "${varName}" = ${evaluated}` : `Updated "${varName}" ➔ ${evaluated}`,
        storyDetail: isNew
          ? `The robot made a new labeled box named "${varName}" and placed ${evaluated} inside.`
          : `The robot opened "${varName}" (previously ${prevVal}) and replaced it with ${evaluated}.`,
        boxes: snapshotBoxes(varName, isNew),
        screenOutput: [...screenOutput],
      });

      pc++;
      continue;
    }

    // 3. INCREMENT / DECREMENT (score += 5, score++)
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

      memory[varName] = { value: newVal, typeLabel: 'Number' };

      steps.push({
        stepNumber: stepCounter++,
        lineNumber: lineNum,
        rawLine: text,
        storyHeadline: `Updated "${varName}": ${prev} ➔ ${newVal}`,
        storyDetail: `The robot updated the box "${varName}" from ${prev} to ${newVal}.`,
        boxes: snapshotBoxes(varName, false),
        screenOutput: [...screenOutput],
      });

      pc++;
      continue;
    }

    // 4. IF / ELSE DECISION
    const ifMatch = text.match(/^if\s*\((.*)\)|^if\s+(.*):/);
    if (ifMatch) {
      const conditionExpr = (ifMatch[1] || ifMatch[2]).trim().replace(/:$/, '');

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

      steps.push({
        stepNumber: stepCounter++,
        lineNumber: lineNum,
        rawLine: text,
        storyHeadline: `Decision Gate: ${checkResult ? 'PASS ✅' : 'FAIL ❌'}`,
        storyDetail: checkResult
          ? `Condition "${conditionExpr}" is TRUE! The robot takes this branch.`
          : `Condition "${conditionExpr}" is FALSE. The robot skips this branch.`,
        boxes: snapshotBoxes(),
        conditionCheck: {
          question: `Is ${conditionExpr}?`,
          result: checkResult,
          explanation: checkResult ? 'Condition is TRUE' : 'Condition is FALSE',
        },
        screenOutput: [...screenOutput],
      });

      pc++;
      continue;
    }

    // 5. LOOPS
    const forMatch = text.match(/for\s*\(\s*(?:int)?\s*([a-zA-Z_]\w*)\s*=\s*(\d+);\s*([a-zA-Z_]\w*)\s*<\s*(\d+);|for\s+([a-zA-Z_]\w*)\s+in\s+range\((\d+)\)/);
    if (forMatch) {
      const loopVar = forMatch[1] || forMatch[5];
      const maxLaps = parseInt(forMatch[4] || forMatch[6] || '4', 10);

      memory[loopVar] = { value: 0, typeLabel: 'Number' };

      steps.push({
        stepNumber: stepCounter++,
        lineNumber: lineNum,
        rawLine: text,
        storyHeadline: `Repeat Loop: Lap 1 of ${maxLaps}`,
        storyDetail: `The robot initialized counter "${loopVar} = 0" and begins repeating the body lines.`,
        boxes: snapshotBoxes(loopVar, true),
        loopCheck: {
          currentLap: 1,
          totalLaps: maxLaps,
          conditionText: `${loopVar} < ${maxLaps}`,
        },
        screenOutput: [...screenOutput],
      });

      pc++;
      continue;
    }

    steps.push({
      stepNumber: stepCounter++,
      lineNumber: lineNum,
      rawLine: text,
      storyHeadline: `Executed: ${text}`,
      storyDetail: `The robot processed instruction on line ${lineNum}.`,
      boxes: snapshotBoxes(),
      screenOutput: [...screenOutput],
    });

    pc++;
  }

  return steps;
}

/**
 * Validates if the student's execution met the mission goal.
 */
export function checkMissionSuccess(
  steps: LiveTraceStep[],
  goal?: MissionGoal
): { passed: boolean; message: string } {
  if (!goal) return { passed: false, message: '' };
  if (steps.length === 0) return { passed: false, message: 'Write code and click Run!' };

  const lastStep = steps[steps.length - 1];

  // 1. Expected output check
  if (goal.expectedOutputIncludes) {
    const allOutput = lastStep.screenOutput.join(' ');
    if (allOutput.toLowerCase().includes(goal.expectedOutputIncludes.toLowerCase())) {
      return { passed: true, message: `Great job! Screen displayed: "${goal.expectedOutputIncludes}"` };
    }
  }

  // 2. Expected variable value check
  if (goal.targetVarName && goal.expectedValue !== undefined) {
    const box = lastStep.boxes.find((b) => b.name === goal.targetVarName);
    if (box && Number(box.value) === Number(goal.expectedValue)) {
      return { passed: true, message: `Awesome! "${goal.targetVarName}" is set to ${goal.expectedValue}.` };
    }
  }

  return { passed: false, message: goal.hint };
}
