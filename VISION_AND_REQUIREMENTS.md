# CodeLens — Product Vision & Core Requirements

## 1. The Core Philosophy (The Brilliant.org Approach)
> **"First explain the concept visually, then test the user visually, then let them write code. No clutter. No dense dashboards. Explain from zero so even a 10-year-old understands."**

Most coding tools fail beginners because they throw them into a messy 6-to-11-box IDE dashboard full of syntax, terminals, memory addresses, and compiler errors. 

**CodeLens follows the Brilliant.org pedagogical model:**
1. **Phase 1: Visual Concept First (No Code Overload):**
   - Explain what the concept actually means in the real world using interactive visual animations.
   - Example (Variables): A physical cardboard box with a name sticker label. You click or drag a number into the box. You see that a box can only hold one thing at a time.
2. **Phase 2: Visual Test (Check Understanding Immediately):**
   - Just like Brilliant.org, test the user with an interactive visual question before writing syntax.
   - Example: *"If the box has 10 and we drop 25 inside, what is in the box now?"* ➔ Instant visual feedback.
3. **Phase 3: Hands-On Code Challenge (Clean, Focused, Minimal):**
   - Only now do we introduce the syntax (`coins = 50`).
   - Clean, distraction-free code editor with instant visual feedback and success celebration.

---

## 2. Key User Requirements Captured

### A. Explain From Absolute Zero
- Never assume the learner knows what a variable, a programming language, or code syntax is.
- Explain:
  - **What is Code?** (A step-by-step recipe for a friendly robot computer).
  - **What is a Variable?** (A labeled storage box that holds one thing).
  - **What is Math in Code?** (`=` means "put inside", not math equals).
  - **What is an If Statement?** (A fork in the road / decision gate).
  - **What is a Loop?** (A repeat track that counts laps).
  - **What is an Array/List?** (A row of numbered lockers starting at #0).
  - **What is a Function?** (A reusable mini-machine).
  - **What is a Pointer?** (A remote control aimed at another box).

### B. Minimal, Simple & Clean UI (Anti-Clutter)
- **NO messy 6-to-11-box dashboards** crammed onto one screen.
- **Card-by-card focused experience:** One clear concept or challenge per screen with generous whitespace.
- Clean progress bar at the top (Card 1: Visual Concept ➔ Card 2: Visual Quiz ➔ Card 3: Code Challenge).
- Elegant typography, high-contrast readable code, and soft tactile colors.

### C. Dual-Track Power (Kids to College Students)
- Simple enough for a 10-year-old beginner with zero background.
- Powerful enough for a university student to switch between **Python, C++, Java, and JavaScript**, or upload their course syllabus to generate a custom class roadmap.

### D. Zero Server Cost Forever
- 100% in-browser WebAssembly execution (`pdfjs-dist` + `tesseract.js` + client-side code engine).
- Zero paid API dependencies; runs statically anywhere.
