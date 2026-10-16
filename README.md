# CodeLens 🔭 — Visual Coding Learning Platform

> **"Explain the concept visually, test understanding visually, then apply it in real code — with zero clutter and zero AI slop."**

Built for learners from **10-year-olds to university CS freshmen**.

---

## 🌟 The Pedagogy: Brilliant.org Visual Model

Most coding platforms fail beginners because they drop them into a dense 6-to-11-panel dark IDE with memory hex addresses (`0x7ffe04`), compiler errors, and cluttered terminals.

**CodeLens inverts this into a clean 3-phase flow:**

1. **Card 1: Visual Explanation First**
   - Interactive, animated concepts with zero code clutter.
   - Example (Variables): A tactile cardboard box with a name sticker. Drop a number inside, swap values, and watch that a box can only store one item at a time.
2. **Card 2: Quick Visual Test**
   - Check mental models immediately with an interactive visual quiz before touching syntax.
   - Example: *"If the box currently holds 10 and we drop 25 inside, what is inside the box now?"*
3. **Card 3: Focused Code Challenge**
   - Apply the newly grasped intuition in Python, C++, Java, or JavaScript.
   - Clean, single-pane focus with instant visual trace and celebration.

---

## 🚀 Features

- **8 Handcrafted Visual Lessons**:
  - **Level 1**: Talking to the Robot (What is code? Sequence & instructions)
  - **Level 2**: Storage Boxes (Variables & assignments)
  - **Level 3**: Secret Math (Variables in calculations)
  - **Level 4**: Decision Gates (If/Else branching)
  - **Level 5**: Repeat Tracks (While & For loops)
  - **Level 6**: Locker Rows (Arrays & Lists)
  - **Level 7**: Mini-Machines (Functions & return values)
  - **Level 8**: Remote Controls (Pointers & memory references)
- **100% In-Browser & Zero Cost**:
  - Runs client-side WebAssembly. No expensive backend servers, no API tokens needed.
- **Syllabus Matcher**:
  - College students can upload their class syllabus (PDF or image) via client-side OCR (`pdfjs-dist` + `tesseract.js`) to generate a tailored class roadmap.
- **Multi-Language Support**:
  - Switch between Python, C++, Java, and JavaScript at will.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/HassanArif-collab/CodeLearningApp.git
cd CodeLearningApp

# Install dependencies
npm install

# Start development server
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

---

## 📖 Product Vision & Requirements

Read [`VISION_AND_REQUIREMENTS.md`](./VISION_AND_REQUIREMENTS.md) for the complete design philosophy, user expectations, and pedagogical principles.
