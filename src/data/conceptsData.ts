import { BrilliantLesson } from '../types/visualizer';

export const BRILLIANT_LESSONS: BrilliantLesson[] = [
  // ================= LEVEL 1: WHAT IS CODE? =================
  {
    id: 'level-1-what-is-code',
    levelNumber: 1,
    emoji: '🤖',
    title: 'Talking to the Robot',
    shortTagline: 'What is code and how do computers listen?',
    xpReward: 50,
    concept: {
      title: 'What is a Computer Program?',
      subtitle: 'Computers are super-fast robots that follow recipes!',
      explanation:
        'A computer cannot think for itself or understand normal human speech. A "programming language" is just a simple recipe of command words. When you write a line of code, the computer executes it step-by-step from top to bottom!',
      analogyTagline: 'Think of code like baking cookies: you must follow the steps in order!',
      widgetType: 'robot_talk',
    },
    quiz: {
      question: 'Why do computers need programming languages instead of human speech?',
      contextNote: 'Think about how a literal robot follows instructions.',
      options: [
        {
          id: 'q1-1',
          label: 'Computers need exact, step-by-step instructions without confusion.',
          isCorrect: true,
          explanation: 'Exactly! Human words can be ambiguous, but code instructions are 100% exact and step-by-step.',
        },
        {
          id: 'q1-2',
          label: 'Computers can read our minds, so words are unnecessary.',
          isCorrect: false,
          explanation: 'Computers cannot read minds—they rely entirely on the exact code we type.',
        },
        {
          id: 'q1-3',
          label: 'Code is only meant for secret government math.',
          isCorrect: false,
          explanation: 'Code is used for games, websites, apps, and robots everywhere!',
        },
      ],
    },
    challenge: {
      instruction: 'Make the robot computer display "Hello, World!" on its screen.',
      expectedOutputIncludes: 'Hello, World!',
      hint: 'Type print("Hello, World!") on line 1, then click "Run & Check".',
      starterCode: {
        python: `# Level 1: Make the robot speak!
print("Hello, World!")`,
        cpp: `// Level 1: Tell the robot to speak in C++!
#include <iostream>
int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
        java: `// Level 1: Tell the robot to speak in Java!
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
        javascript: `// Level 1: Tell the robot to speak in JavaScript!
console.log("Hello, World!");`,
      },
    },
  },

  // ================= LEVEL 2: WHAT IS A VARIABLE? =================
  {
    id: 'level-2-variables-boxes',
    levelNumber: 2,
    emoji: '📦',
    title: 'The Storage Box',
    shortTagline: 'Variables are labeled boxes that hold values',
    xpReward: 50,
    concept: {
      title: 'What is a Variable?',
      subtitle: 'A labeled box in computer memory!',
      explanation:
        'Imagine you have a cardboard box with a name sticker that says "coins". When you write "coins = 50", the computer drops 50 coins inside the box so it can remember it later!',
      analogyTagline: 'A storage box can only hold ONE current value at a time.',
      widgetType: 'variable_box',
      initialBoxName: 'coins',
      initialBoxValue: 50,
    },
    quiz: {
      question: 'A box is labeled "coins" with 10 inside. If the computer runs "coins = 50", what is inside the box now?',
      options: [
        {
          id: 'q2-1',
          label: 'Just 50 (the old 10 was replaced).',
          isCorrect: true,
          explanation: 'Correct! A variable box holds only its newest value. The old 10 is tossed out.',
        },
        {
          id: 'q2-2',
          label: '60 (it adds 10 + 50 automatically).',
          isCorrect: false,
          explanation: 'The "=" sign means replace, not add! To add, you would write coins = coins + 50.',
        },
        {
          id: 'q2-3',
          label: 'Both 10 and 50 at the same time.',
          isCorrect: false,
          explanation: 'A basic variable box can only hold one value at a time.',
        },
      ],
    },
    challenge: {
      instruction: 'Create a box named coins and put 50 inside.',
      targetVarName: 'coins',
      expectedValue: 50,
      hint: 'Type coins = 50 and click "Run & Check".',
      starterCode: {
        python: `# Level 2: Store 50 coins in a box!
coins = 50
print(coins)`,
        cpp: `// Level 2: Create a storage box in C++!
#include <iostream>
int main() {
    int coins = 50;
    std::cout << coins << std::endl;
    return 0;
}`,
        java: `// Level 2: Create a storage box in Java!
public class Main {
    public static void main(String[] args) {
        int coins = 50;
        System.out.println(coins);
    }
}`,
        javascript: `// Level 2: Create a storage box in JavaScript!
let coins = 50;
console.log(coins);`,
      },
    },
  },

  // ================= LEVEL 3: DOING MATH IN CODE =================
  {
    id: 'level-3-math-updating',
    levelNumber: 3,
    emoji: '🧮',
    title: 'Secret Math',
    shortTagline: 'Why "=" in code means "PUT INSIDE"',
    xpReward: 50,
    concept: {
      title: 'In Code, "=" Means "Put Inside"',
      subtitle: 'Calculate the right side first, then store it!',
      explanation:
        'In algebra class, x = x + 5 makes no sense. But in coding, the "=" sign is an action: "Look inside coins (20), add 30 to make 50, and drop 50 into the coins box!"',
      analogyTagline: 'First the computer does the math on the right, then stores the result on the left.',
      widgetType: 'math_update',
    },
    quiz: {
      question: 'If "lives = 3", what does the computer do when it runs "lives = lives - 1"?',
      options: [
        {
          id: 'q3-1',
          label: 'It takes 3 - 1 = 2, and puts 2 inside the lives box.',
          isCorrect: true,
          explanation: 'Spot on! The computer evaluates 3 - 1 = 2 first, then drops 2 into the lives box.',
        },
        {
          id: 'q3-2',
          label: 'It deletes the lives box forever.',
          isCorrect: false,
          explanation: 'The box stays right where it is—only its inside number changes to 2.',
        },
        {
          id: 'q3-3',
          label: 'It creates a second box named lives-1.',
          isCorrect: false,
          explanation: 'No new box is created; the existing lives box is updated.',
        },
      ],
    },
    challenge: {
      instruction: 'Start with coins = 20, add bonus = 30, and make coins equal 50.',
      targetVarName: 'coins',
      expectedValue: 50,
      hint: 'Write coins = coins + bonus and run!',
      starterCode: {
        python: `# Level 3: Update the coins box!
coins = 20
bonus = 30
coins = coins + bonus
print(coins)`,
        cpp: `// Level 3: Update the box in C++!
#include <iostream>
int main() {
    int coins = 20;
    int bonus = 30;
    coins = coins + bonus;
    std::cout << coins << std::endl;
    return 0;
}`,
        java: `// Level 3: Update the box in Java!
public class Main {
    public static void main(String[] args) {
        int coins = 20;
        int bonus = 30;
        coins = coins + bonus;
        System.out.println(coins);
    }
}`,
        javascript: `// Level 3: Update the box in JavaScript!
let coins = 20;
let bonus = 30;
coins = coins + bonus;
console.log(coins);`,
      },
    },
  },

  // ================= LEVEL 4: DECISION GATES =================
  {
    id: 'level-4-decision-gates',
    levelNumber: 4,
    emoji: '🚦',
    title: 'The Decision Gate',
    shortTagline: 'If / Else Forks in the Road',
    xpReward: 75,
    concept: {
      title: 'What is an IF / ELSE Statement?',
      subtitle: 'A fork in the road that asks a True/False question!',
      explanation:
        'Think of a castle guard or video game gate: "Do you have at least 50 coins?" If YES (True), open the gate! If NO (False), take the other path.',
      analogyTagline: 'If it is raining, put on boots. Else, wear sneakers!',
      widgetType: 'decision_gate',
    },
    quiz: {
      question: 'If "coins = 25", what does "if coins >= 50:" evaluate to?',
      options: [
        {
          id: 'q4-1',
          label: 'FALSE (25 is not greater than or equal to 50).',
          isCorrect: true,
          explanation: 'Correct! 25 is less than 50, so the condition is FALSE and skips the if block.',
        },
        {
          id: 'q4-2',
          label: 'TRUE (because coins exists).',
          isCorrect: false,
          explanation: 'It checks the comparison 25 >= 50, not just whether the variable exists.',
        },
      ],
    },
    challenge: {
      instruction: 'Check if coins >= 50 and make the robot print "Gate Open!".',
      expectedOutputIncludes: 'Gate Open!',
      hint: 'Set coins = 50 so the if condition passes.',
      starterCode: {
        python: `# Level 4: Decision Gates!
coins = 50
if coins >= 50:
    print("Gate Open!")
else:
    print("Locked!")`,
        cpp: `// Level 4: Decisions in C++!
#include <iostream>
int main() {
    int coins = 50;
    if (coins >= 50) {
        std::cout << "Gate Open!" << std::endl;
    } else {
        std::cout << "Locked!" << std::endl;
    }
    return 0;
}`,
        java: `// Level 4: Decisions in Java!
public class Main {
    public static void main(String[] args) {
        int coins = 50;
        if (coins >= 50) {
            System.out.println("Gate Open!");
        } else {
            System.out.println("Locked!");
        }
    }
}`,
        javascript: `// Level 4: Decisions in JavaScript!
let coins = 50;
if (coins >= 50) {
    console.log("Gate Open!");
} else {
    console.log("Locked!");
}`,
      },
    },
  },

  // ================= LEVEL 5: LOOPS =================
  {
    id: 'level-5-loops-tracks',
    levelNumber: 5,
    emoji: '🔄',
    title: 'The Repeat Track',
    shortTagline: 'Loops repeat code without copy-pasting',
    xpReward: 75,
    concept: {
      title: 'What is a Loop?',
      subtitle: 'Running laps automatically!',
      explanation:
        'Why type the same line 100 times? A loop tells the computer to repeat instructions on a circular track while counting laps (0, 1, 2, 3...) until finished!',
      analogyTagline: 'Like running 4 laps around a sports field.',
      widgetType: 'loop_track',
    },
    quiz: {
      question: 'How many times will "for lap in range(4):" run its inside lines?',
      options: [
        {
          id: 'q5-1',
          label: 'Exactly 4 times (lap 0, 1, 2, 3).',
          isCorrect: true,
          explanation: 'Yes! In computer science, range(4) runs 4 times, starting from 0 up to 3.',
        },
        {
          id: 'q5-2',
          label: 'Forever without stopping.',
          isCorrect: false,
          explanation: 'A for loop with a range finishes once it reaches its limit.',
        },
      ],
    },
    challenge: {
      instruction: 'Write a loop that counts 4 laps.',
      expectedOutputIncludes: 'Lap',
      hint: 'Use range(4) or lap < 4 to print 4 times.',
      starterCode: {
        python: `# Level 5: Running Laps!
for lap in range(4):
    print("Lap:")
    print(lap)`,
        cpp: `// Level 5: Loops in C++!
#include <iostream>
int main() {
    for (int lap = 0; lap < 4; lap++) {
        std::cout << "Lap: " << lap << std::endl;
    }
    return 0;
}`,
        java: `// Level 5: Loops in Java!
public class Main {
    public static void main(String[] args) {
        for (int lap = 0; lap < 4; lap++) {
            System.out.println("Lap: " + lap);
        }
    }
}`,
        javascript: `// Level 5: Loops in JavaScript!
for (let lap = 0; lap < 4; lap++) {
    console.log("Lap: " + lap);
}`,
      },
    },
  },

  // ================= LEVEL 6: ARRAYS & LOCKERS =================
  {
    id: 'level-6-lockers',
    levelNumber: 6,
    emoji: '🗄️',
    title: 'The Row of Lockers',
    shortTagline: 'Lists & Arrays of items',
    xpReward: 100,
    concept: {
      title: 'What is an Array or List?',
      subtitle: 'A row of numbered lockers!',
      explanation:
        'Instead of making 50 separate boxes named score1, score2, score3... an array is a long locker cabinet where every locker has a number starting at #0: locker #0, locker #1, locker #2!',
      analogyTagline: 'Why #0? Index 0 means "start right at the front with 0 steps forward!"',
      widgetType: 'locker_rack',
    },
    quiz: {
      question: 'If "scores = [10, 25, 99]", which number is inside locker #0 (scores[0])?',
      options: [
        {
          id: 'q6-1',
          label: '10 (the very first item).',
          isCorrect: true,
          explanation: 'Correct! Computer science starts counting at 0, so index 0 is the first item (10).',
        },
        {
          id: 'q6-2',
          label: '25 (the second item).',
          isCorrect: false,
          explanation: '25 is at index #1! The first item is always at index #0.',
        },
      ],
    },
    challenge: {
      instruction: 'Create a list of 3 scores [10, 25, 99] and print locker #0.',
      expectedOutputIncludes: '10',
      hint: 'Access the first locker with scores[0].',
      starterCode: {
        python: `# Level 6: Numbered Lockers!
scores = [10, 25, 99]
print("Locker 0:")
print(scores[0])`,
        cpp: `// Level 6: Lockers in C++!
#include <iostream>
int main() {
    int scores[3] = {10, 25, 99};
    std::cout << scores[0] << std::endl;
    return 0;
}`,
        java: `// Level 6: Lockers in Java!
public class Main {
    public static void main(String[] args) {
        int[] scores = {10, 25, 99};
        System.out.println(scores[0]);
    }
}`,
        javascript: `// Level 6: Lockers in JavaScript!
const scores = [10, 25, 99];
console.log(scores[0]);`,
      },
    },
  },

  // ================= LEVEL 7: FUNCTIONS =================
  {
    id: 'level-7-functions-machines',
    levelNumber: 7,
    emoji: '⚙️',
    title: 'Magic Machines',
    shortTagline: 'Functions & Reusable Recipes',
    xpReward: 100,
    concept: {
      title: 'What is a Function?',
      subtitle: 'A reusable mini-machine!',
      explanation:
        'A function is like a blender: feed ingredients in (parameters), run the recipe, and pop out the finished smoothie (return value)! Once you build it, you can use it 1,000 times.',
      analogyTagline: 'Feed numbers in, get the answer out.',
      widgetType: 'function_machine',
    },
    quiz: {
      question: 'If a function "double_number(n)" returns n * 2, what does "double_number(25)" return?',
      options: [
        {
          id: 'q7-1',
          label: '50 (25 multiplied by 2).',
          isCorrect: true,
          explanation: 'Exactly! 25 goes in as n, the recipe runs 25 * 2, and 50 pops out!',
        },
        {
          id: 'q7-2',
          label: '25 (it leaves it unchanged).',
          isCorrect: false,
          explanation: 'The function multiplies the input by 2, returning 50.',
        },
      ],
    },
    challenge: {
      instruction: 'Call the doubling function with 25 to get a result of 50.',
      targetVarName: 'result',
      expectedValue: 50,
      hint: 'Pass 25 into double_number(25).',
      starterCode: {
        python: `# Level 7: Functions!
def double_number(n):
    return n * 2

result = double_number(25)
print(result)`,
        cpp: `// Level 7: Functions in C++!
#include <iostream>
int doubleNumber(int n) {
    return n * 2;
}
int main() {
    int result = doubleNumber(25);
    std::cout << result << std::endl;
    return 0;
}`,
        java: `// Level 7: Functions in Java!
public class Main {
    public static int doubleNumber(int n) {
        return n * 2;
    }
    public static void main(String[] args) {
        int result = doubleNumber(25);
        System.out.println(result);
    }
}`,
        javascript: `// Level 7: Functions in JavaScript!
function doubleNumber(n) {
    return n * 2;
}
const result = doubleNumber(25);
console.log(result);`,
      },
    },
  },

  // ================= LEVEL 8: POINTERS & REMOTE CONTROLS =================
  {
    id: 'level-8-pointers-remotes',
    levelNumber: 8,
    emoji: '🎯',
    title: 'The Remote Control',
    shortTagline: 'Pointers & References',
    xpReward: 100,
    concept: {
      title: 'What is a Pointer or Reference?',
      subtitle: 'A remote control aimed at another box!',
      explanation:
        'Instead of holding a number itself, a pointer holds a remote control pointing to ANOTHER box across the room. Using the remote (*remote = 99) changes the target box!',
      analogyTagline: 'Pressing channel 5 on your TV remote changes the television, not the remote!',
      widgetType: 'pointer_remote',
    },
    quiz: {
      question: 'If "remote" points to the "score" box, what happens when we run "*remote = 99"?',
      options: [
        {
          id: 'q8-1',
          label: 'The score box is updated to 99 through the pointer.',
          isCorrect: true,
          explanation: 'Yes! The remote follows the pointer arrow to the score box and updates it in place.',
        },
        {
          id: 'q8-2',
          label: 'The score box is deleted.',
          isCorrect: false,
          explanation: 'The box is not deleted; its value is modified remotely.',
        },
      ],
    },
    challenge: {
      instruction: 'Use the remote pointer to update score to 99.',
      targetVarName: 'score',
      expectedValue: 99,
      hint: 'Dereference the pointer with *remote = 99.',
      starterCode: {
        python: `# Level 8: Remote Controls!
class Box:
    def __init__(self, val):
        self.val = val

score_box = Box(42)
remote = score_box
remote.val = 99
score = score_box.val
print(score)`,
        cpp: `// Level 8: Pointers in C++!
#include <iostream>
int main() {
    int score = 42;
    int* remote = &score;
    *remote = 99;
    std::cout << score << std::endl;
    return 0;
}`,
        java: `// Level 8: Object references in Java!
class Box { int val = 42; }
public class Main {
    public static void main(String[] args) {
        Box b = new Box();
        Box remote = b;
        remote.val = 99;
        int score = b.val;
        System.out.println(score);
    }
}`,
        javascript: `// Level 8: Object references in JavaScript!
const box = { val: 42 };
const remote = box;
remote.val = 99;
const score = box.val;
console.log(score);`,
      },
    },
  },
];

export const ALL_MISSIONS = BRILLIANT_LESSONS.map((l) => ({
  ...l,
  conceptAnalogy: l.concept.analogyTagline,
  starterCode: l.challenge.starterCode,
  goal: {
    description: l.challenge.instruction,
    targetVarName: l.challenge.targetVarName,
    expectedValue: l.challenge.expectedValue,
    expectedOutputIncludes: l.challenge.expectedOutputIncludes,
    hint: l.challenge.hint,
  },
}));

