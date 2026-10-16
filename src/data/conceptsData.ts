import { LevelMission } from '../types/visualizer';

export const ALL_MISSIONS: LevelMission[] = [
  // Level 1: First Steps (The Absolute Simplest Start)
  {
    id: 'level-1-talking-to-robot',
    chapterNumber: 1,
    levelNumber: 1,
    emoji: '🤖',
    title: 'Talking to the Robot',
    shortTagline: 'Your First Line of Code',
    conceptAnalogy:
      'A computer is a super-fast, friendly robot. A program is just a recipe of words that tells the robot what to do line-by-line!',
    goal: {
      description: 'Make the robot display "Hello, World!" on the screen.',
      expectedOutputIncludes: 'Hello, World!',
      hint: 'Type print("Hello, World!") on line 1, then click "Run Code".',
    },
    xpReward: 50,
    starterCode: {
      python: `# Level 1: Tell the robot to speak!
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

  // Level 2: Variables
  {
    id: 'level-2-storage-boxes',
    chapterNumber: 2,
    levelNumber: 2,
    emoji: '📦',
    title: 'The First Storage Box',
    shortTagline: 'Variables are Labeled Boxes',
    conceptAnalogy:
      'A variable is like a cardboard box with a name sticker. When you write coins = 50, the robot drops 50 coins inside the box so it remembers it later!',
    goal: {
      description: 'Create a box named coins with the value 50.',
      targetVarName: 'coins',
      expectedValue: 50,
      hint: 'Change coins = 10 to coins = 50 in the editor and run!',
    },
    xpReward: 50,
    starterCode: {
      python: `# Level 2: Create a storage box!
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

  // Level 3: Math and Updates
  {
    id: 'level-3-number-magic',
    chapterNumber: 3,
    levelNumber: 3,
    emoji: '🧮',
    title: 'Updating What is Inside',
    shortTagline: 'In Code, "=" Means "Put Inside"',
    conceptAnalogy:
      'In math class, x = x + 5 looks crazy! But in code, "=" means: calculate the right side first (20 + 30 = 50), then drop 50 into the coins box!',
    goal: {
      description: 'Make the coins box reach a total value of 50.',
      targetVarName: 'coins',
      expectedValue: 50,
      hint: 'Start with coins = 20, add bonus = 30, and update coins = coins + bonus.',
    },
    xpReward: 50,
    starterCode: {
      python: `# Level 3: Math & Updating Boxes!
coins = 20
bonus = 30
coins = coins + bonus
print(coins)`,
      cpp: `// Level 3: Math & Updating Boxes in C++!
#include <iostream>
int main() {
    int coins = 20;
    int bonus = 30;
    coins = coins + bonus;
    std::cout << coins << std::endl;
    return 0;
}`,
      java: `// Level 3: Math & Updating Boxes in Java!
public class Main {
    public static void main(String[] args) {
        int coins = 20;
        int bonus = 30;
        coins = coins + bonus;
        System.out.println(coins);
    }
}`,
      javascript: `// Level 3: Math & Updating Boxes in JavaScript!
let coins = 20;
let bonus = 30;
coins = coins + bonus;
console.log(coins);`,
    },
  },

  // Level 4: If / Else Decision Gates
  {
    id: 'level-4-decision-gates',
    chapterNumber: 4,
    levelNumber: 4,
    emoji: '🚦',
    title: 'The Decision Gate',
    shortTagline: 'Forks in the Road',
    conceptAnalogy:
      'An if statement is like a castle guard: "Do you have at least 50 coins?" If YES, open the gate! If NO, keep walking.',
    goal: {
      description: 'Check if coins >= 50 and make the robot print "Gate Open!".',
      expectedOutputIncludes: 'Gate Open!',
      hint: 'Make sure coins is set to at least 50 so the if condition passes.',
    },
    xpReward: 75,
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

  // Level 5: Loops & Repeat Tracks
  {
    id: 'level-5-repeat-track',
    chapterNumber: 5,
    levelNumber: 5,
    emoji: '🔄',
    title: 'The Repeat Track',
    shortTagline: 'Loops Repeat Automatically',
    conceptAnalogy:
      'Instead of typing the same command 100 times, a loop puts the robot on a running track that counts laps (0, 1, 2, 3...) until it finishes!',
    goal: {
      description: 'Run a loop that counts 4 laps.',
      expectedOutputIncludes: 'Lap',
      hint: 'Use a loop with range(4) or i < 4 to print 4 laps.',
    },
    xpReward: 75,
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

  // Level 6: Arrays / Lists as Numbered Lockers
  {
    id: 'level-6-locker-racks',
    chapterNumber: 6,
    levelNumber: 6,
    emoji: '🗄️',
    title: 'The Row of Lockers',
    shortTagline: 'Lists & Arrays',
    conceptAnalogy:
      'Instead of making 20 separate boxes, an array is a row of lockers side-by-side. Each locker has an index number starting at #0!',
    goal: {
      description: 'Store a list of 3 numbers and print the item in locker #0.',
      expectedOutputIncludes: '10',
      hint: 'Access the first element using scores[0].',
    },
    xpReward: 100,
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

  // Level 7: Functions / Mini-Machines
  {
    id: 'level-7-mini-machines',
    chapterNumber: 7,
    levelNumber: 7,
    emoji: '⚙️',
    title: 'Magic Machines',
    shortTagline: 'Functions & Reusable Code',
    conceptAnalogy:
      'A function is like a blender: feed ingredients in (parameters), run the recipe, and pop out the finished smoothie (return value)!',
    goal: {
      description: 'Call a doubling function to produce a result of 50.',
      targetVarName: 'result',
      expectedValue: 50,
      hint: 'Pass 25 into double_number(25) so it returns 50.',
    },
    xpReward: 100,
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

  // Level 8: Pointers & Remote Controls
  {
    id: 'level-8-remote-controls',
    chapterNumber: 8,
    levelNumber: 8,
    emoji: '🎯',
    title: 'The Remote Control',
    shortTagline: 'Pointers & References',
    conceptAnalogy:
      'A pointer holds a remote control pointing to another box across the room. Using the pointer (*ptr = 99) changes the target box!',
    goal: {
      description: 'Use a pointer or reference to update score to 99.',
      targetVarName: 'score',
      expectedValue: 99,
      hint: 'Dereference the remote pointer using *remote = 99.',
    },
    xpReward: 100,
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
];
