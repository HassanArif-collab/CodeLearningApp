import { StarterLesson } from '../types/visualizer';

export const STARTER_LESSONS: StarterLesson[] = [
  // Lesson 1: What is code?
  {
    id: 'what-is-code-and-print',
    stepOrder: 1,
    emoji: '🤖',
    title: 'Lesson 1: What is Code? Talking to the Computer',
    kidSubtitle: 'Computers are super-fast robots that follow simple instructions line-by-line!',
    conceptComicTitle: 'What is a Programming Language?',
    conceptComicExplanation:
      'A computer does not understand human languages like English. A "programming language" is just a simple recipe of command words that tells the computer what to do step-by-step from top to bottom!',
    conceptAnalogy: 'Think of code like baking cookies: if step 1 is "Mix flour", step 2 is "Add chocolate chips", and step 3 is "Bake for 10 mins", you must follow the steps in order or the cookies ruin!',
    keywords: ['intro', 'introduction', 'programming language', 'print', 'hello world', 'output', 'syntax'],
    starterCode: {
      python: `# Lesson 1: Talking to the computer!
print("Hello, Human!")
print("I am your friendly robot computer.")
print("I read instructions line-by-line!")`,
      cpp: `// Lesson 1: Talking to the computer in C++!
#include <iostream>
int main() {
    std::cout << "Hello, Human!" << std::endl;
    std::cout << "I read instructions line-by-line!" << std::endl;
    return 0;
}`,
      java: `// Lesson 1: Talking to the computer in Java!
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Human!");
        System.out.println("I read instructions line-by-line!");
    }
}`,
      javascript: `// Lesson 1: Talking to the computer in JavaScript!
console.log("Hello, Human!");
console.log("I read instructions line-by-line!");`
    }
  },

  // Lesson 2: Variables as storage boxes
  {
    id: 'variables-storage-boxes',
    stepOrder: 2,
    emoji: '📦',
    title: 'Lesson 2: Variables (Labeled Storage Boxes)',
    kidSubtitle: 'A variable is a labeled cardboard box in the computer that remembers one thing!',
    conceptComicTitle: 'What is a Variable?',
    conceptComicExplanation:
      'Imagine you have a cardboard box with a sticker label that says "coins". When you write "coins = 10", the computer drops 10 coins inside the box. Whenever you need it later, the computer just peeks inside!',
    conceptAnalogy: 'A labeled box can only hold one current value. If you put 25 inside, the old 10 falls out!',
    keywords: ['variable', 'assignment', 'declaration', 'data types', 'integer', 'int', 'store', 'primitive'],
    starterCode: {
      python: `# Lesson 2: Creating and peeking inside storage boxes!
coins = 10
player_name = "Alex"
print(coins)
print(player_name)`,
      cpp: `// Lesson 2: Labeled boxes in C++!
#include <iostream>
int main() {
    int coins = 10;
    int lives = 3;
    std::cout << coins << std::endl;
    return 0;
}`,
      java: `// Lesson 2: Labeled boxes in Java!
public class Main {
    public static void main(String[] args) {
        int coins = 10;
        int lives = 3;
        System.out.println(coins);
    }
}`,
      javascript: `// Lesson 2: Labeled boxes in JavaScript!
let coins = 10;
let lives = 3;
console.log(coins);`
    }
  },

  // Lesson 3: Math and updating boxes
  {
    id: 'math-and-updating-boxes',
    stepOrder: 3,
    emoji: '🧮',
    title: 'Lesson 3: Doing Math & Updating Boxes (score = score + 5)',
    kidSubtitle: 'In coding, "=" does not mean math equals. It means "PUT INSIDE"!',
    conceptComicTitle: 'Why Does "score = score + 5" Make Sense in Code?',
    conceptComicExplanation:
      'In math class, x = x + 5 looks crazy! But in coding, the "=" sign means: "Calculate the right side FIRST, then drop the answer inside the box on the left".',
    conceptAnalogy: 'If you have 10 coins in your box and pick up 5 more, you look inside (10), add 5 (15), and drop 15 back into the box!',
    keywords: ['arithmetic', 'expression', 'math', 'reassignment', 'update', 'increment', 'plus'],
    starterCode: {
      python: `# Lesson 3: Updating boxes!
score = 10
bonus = 5
score = score + bonus
print(score)`,
      cpp: `// Lesson 3: Updating boxes in C++!
#include <iostream>
int main() {
    int score = 10;
    int bonus = 5;
    score = score + bonus;
    std::cout << score << std::endl;
    return 0;
}`,
      java: `// Lesson 3: Updating boxes in Java!
public class Main {
    public static void main(String[] args) {
        int score = 10;
        int bonus = 5;
        score = score + bonus;
        System.out.println(score);
    }
}`,
      javascript: `// Lesson 3: Updating boxes in JavaScript!
let score = 10;
let bonus = 5;
score = score + bonus;
console.log(score);`
    }
  },

  // Lesson 4: If / Else decisions
  {
    id: 'if-else-decisions',
    stepOrder: 4,
    emoji: '🚦',
    title: 'Lesson 4: Making Decisions (if / else Forks in the Road)',
    kidSubtitle: 'Teach your robot to ask a True/False question and choose which path to walk down!',
    conceptComicTitle: 'What is an IF / ELSE Statement?',
    conceptComicExplanation:
      'Think of a traffic light or a video game test: "Do you have enough coins to buy the sword?" If YES (True), the game gives you the sword! Otherwise (ELSE), it says "Keep saving!".',
    conceptAnalogy: 'Like choosing your clothes: IF it is raining outside, put on your boots! ELSE, wear sneakers!',
    keywords: ['if', 'else', 'condition', 'boolean', 'decision', 'conditional', 'branching', 'greater than'],
    starterCode: {
      python: `# Lesson 4: Forks in the road!
coins = 25
if coins >= 20:
    print("You unlocked the Magic Shield!")
else:
    print("Not enough coins yet!")`,
      cpp: `// Lesson 4: Decisions in C++!
#include <iostream>
int main() {
    int coins = 25;
    if (coins >= 20) {
        std::cout << "You unlocked the Magic Shield!" << std::endl;
    } else {
        std::cout << "Not enough coins yet!" << std::endl;
    }
    return 0;
}`,
      java: `// Lesson 4: Decisions in Java!
public class Main {
    public static void main(String[] args) {
        int coins = 25;
        if (coins >= 20) {
            System.out.println("You unlocked the Magic Shield!");
        } else {
            System.out.println("Not enough coins yet!");
        }
    }
}`,
      javascript: `// Lesson 4: Decisions in JavaScript!
let coins = 25;
if (coins >= 20) {
    console.log("You unlocked the Magic Shield!");
} else {
    console.log("Not enough coins yet!");
}`
    }
  },

  // Lesson 5: Loops
  {
    id: 'loops-repeat-track',
    stepOrder: 5,
    emoji: '🔄',
    title: 'Lesson 5: Loops (Repeating Without Copy-Pasting)',
    kidSubtitle: 'Why type the same line 100 times? Put the computer on a repeat loop track!',
    conceptComicTitle: 'What is a Loop?',
    conceptComicExplanation:
      'A loop tells the robot to repeat a set of lines over and over, while keeping count of its laps using a counter box (often called "i").',
    conceptAnalogy: 'Running laps on a track: Lap 1, Lap 2, Lap 3! Once you finish 4 laps, you exit the track!',
    keywords: ['loop', 'for loop', 'while loop', 'iteration', 'repeat', 'counter', 'range'],
    starterCode: {
      python: `# Lesson 5: A counting loop!
for i in range(4):
    print("Running lap number:")
    print(i)`,
      cpp: `// Lesson 5: A counting loop in C++!
#include <iostream>
int main() {
    for (int i = 0; i < 4; i++) {
        std::cout << "Lap number: " << i << std::endl;
    }
    return 0;
}`,
      java: `// Lesson 5: A counting loop in Java!
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 4; i++) {
            System.out.println("Lap number: " + i);
        }
    }
}`,
      javascript: `// Lesson 5: A counting loop in JavaScript!
for (let i = 0; i < 4; i++) {
    console.log("Lap number: " + i);
}`
    }
  },

  // Lesson 6: Arrays / Lists as Lockers
  {
    id: 'arrays-numbered-lockers',
    stepOrder: 6,
    emoji: '🗄️',
    title: 'Lesson 6: Lists & Arrays (A Row of Numbered Lockers)',
    kidSubtitle: 'Store a whole collection of items in numbered lockers starting at #0!',
    conceptComicTitle: 'What is an Array or List?',
    conceptComicExplanation:
      'Instead of creating 50 separate boxes named score1, score2, score3... an Array is a long row of lockers side-by-side. Each locker has an index number: Locker #0, Locker #1, Locker #2!',
    conceptAnalogy: 'Why does computer science start counting at 0? Because index 0 means: "Start right at the front of the locker cabinet without taking any steps forward!"',
    keywords: ['array', 'list', 'index', 'lockers', 'collection', 'elements', 'subscript'],
    starterCode: {
      python: `# Lesson 6: Numbered lockers!
scores = [15, 42, 8]
print(scores[0])
print(scores[1])`,
      cpp: `// Lesson 6: Numbered lockers in C++!
#include <iostream>
int main() {
    int scores[3] = {15, 42, 8};
    std::cout << scores[0] << std::endl;
    std::cout << scores[1] << std::endl;
    return 0;
}`,
      java: `// Lesson 6: Numbered lockers in Java!
public class Main {
    public static void main(String[] args) {
        int[] scores = {15, 42, 8};
        System.out.println(scores[0]);
        System.out.println(scores[1]);
    }
}`,
      javascript: `// Lesson 6: Numbered lockers in JavaScript!
const scores = [15, 42, 8];
console.log(scores[0]);
console.log(scores[1]);`
    }
  },

  // Lesson 7: Functions
  {
    id: 'functions-mini-machines',
    stepOrder: 7,
    emoji: '⚙️',
    title: 'Lesson 7: Functions (Reusable Mini-Machines)',
    kidSubtitle: 'Give ingredients to a mini-machine, and it returns the finished product!',
    conceptComicTitle: 'What is a Function?',
    conceptComicExplanation:
      'A function is like a blender: you pour fruit and milk into it (called parameters), it runs its recipe, and pours out a delicious smoothie (the return value)!',
    conceptAnalogy: 'Once you build a "doubleNumber" machine, you can use it 1,000 times without re-inventing how to multiply by 2 every time!',
    keywords: ['function', 'method', 'parameters', 'arguments', 'return', 'def', 'reuse'],
    starterCode: {
      python: `# Lesson 7: A doubling mini-machine!
def double_coins(amount):
    return amount * 2

reward = double_coins(10)
print(reward)`,
      cpp: `// Lesson 7: Mini-machine in C++!
#include <iostream>
int doubleCoins(int amount) {
    return amount * 2;
}
int main() {
    int reward = doubleCoins(10);
    std::cout << reward << std::endl;
    return 0;
}`,
      java: `// Lesson 7: Mini-machine in Java!
public class Main {
    public static int doubleCoins(int amount) {
        return amount * 2;
    }
    public static void main(String[] args) {
        int reward = doubleCoins(10);
        System.out.println(reward);
    }
}`,
      javascript: `// Lesson 7: Mini-machine in JavaScript!
function doubleCoins(amount) {
    return amount * 2;
}
const reward = doubleCoins(10);
console.log(reward);`
    }
  },

  // Lesson 8: Pointers & Remote Controls
  {
    id: 'pointers-remote-controls',
    stepOrder: 8,
    emoji: '🎯',
    title: 'Lesson 8: Pointers & References (A Remote Control to Another Box)',
    kidSubtitle: 'Instead of holding a number, a pointer holds a remote control aimed at another box!',
    conceptComicTitle: 'What is a Pointer or Reference?',
    conceptComicExplanation:
      'Instead of holding an apple itself, you hold a piece of paper with an arrow pointing to your friend\'s lunchbox. Changing the lunchbox with your pointer changes what is inside their box!',
    conceptAnalogy: 'A TV remote control: pressing "Channel 5" on the remote doesn\'t change the remote itself—it changes the television across the room!',
    keywords: ['pointer', 'reference', 'dereference', 'address-of', 'ampersand', 'asterisk', 'memory address'],
    starterCode: {
      python: `# In Python, object variables act like remote controls!
class Lunchbox:
    def __init__(self, snack):
        self.snack = snack

box1 = Lunchbox("Apple")
remote = box1  # points to the same box!
remote.snack = "Pizza"
print(box1.snack)`,
      cpp: `// Pointers in C++: A remote control to a variable!
#include <iostream>
int main() {
    int score = 42;
    int* remote = &score; // point remote at score
    *remote = 99;         // press button to change score
    std::cout << score << std::endl;
    return 0;
}`,
      java: `// Object references in Java act like remote controls!
class Lunchbox { String snack = "Apple"; }
public class Main {
    public static void main(String[] args) {
        Lunchbox box1 = new Lunchbox();
        Lunchbox remote = box1; // remote points to box1
        remote.snack = "Pizza";
        System.out.println(box1.snack);
    }
}`,
      javascript: `// Object references in JS act like remote controls!
const box1 = { snack: "Apple" };
const remote = box1; // remote points to box1
remote.snack = "Pizza";
console.log(box1.snack);`
    }
  }
];
