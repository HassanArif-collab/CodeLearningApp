import React, { useState, useEffect, useRef } from 'react';
import {
  StarterLesson,
  SupportedLanguage,
  LiveTraceStep,
} from '../../types/visualizer';
import { traceStudentCode } from '../../services/liveCodeEngine';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  Package,
  Monitor,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  XCircle,
  Repeat
} from 'lucide-react';

interface InteractiveCodingStudioProps {
  lesson?: StarterLesson;
  initialLanguage?: SupportedLanguage;
}

export const InteractiveCodingStudio: React.FC<InteractiveCodingStudioProps> = ({
  lesson,
  initialLanguage = 'python',
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [code, setCode] = useState<string>(
    lesson?.starterCode[initialLanguage] ||
      `# Type your code here or edit this!\ncoins = 10\nbonus = 5\ncoins = coins + bonus\nprint("Total coins:")\nprint(coins)`
  );

  const [steps, setSteps] = useState<LiveTraceStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnalogy, setShowAnalogy] = useState(true);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

  const timerRef = useRef<any>(null);

  // When lesson or language changes, load starter code
  useEffect(() => {
    if (lesson) {
      const newCode = lesson.starterCode[language] || lesson.starterCode['python'];
      setCode(newCode);
    }
  }, [lesson, language]);

  // Whenever code changes, trace the code and update steps
  useEffect(() => {
    const generatedSteps = traceStudentCode(code, language);
    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setSelectedWordIndex(null);
  }, [code, language]);

  const currentStep = steps[currentStepIndex] || steps[0];

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1600);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedWordIndex(null);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setSelectedWordIndex(null);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setSelectedWordIndex(null);
  };

  const codeLines = code.split('\n');

  return (
    <div className="space-y-6">
      {/* ================= 1. EXPLAIN LIKE I'M 10 CONCEPT CARD ================= */}
      {lesson && showAnalogy && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{lesson.emoji}</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Explain Like I'm 10
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {lesson.conceptComicTitle}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setShowAnalogy(false)}
              className="text-xs text-slate-400 hover:text-white bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 transition"
            >
              Hide Analogy ✕
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {lesson.conceptComicExplanation}
          </p>

          <div className="p-3 bg-slate-950/70 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-xs text-emerald-300">
            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Real-World Analogy: </strong>
              <span>{lesson.conceptAnalogy}</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. MAIN 2-COLUMN INTERACTIVE STUDIO ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: LIVE EDITABLE CODE EDITOR ================= */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Editor Header: Language Switcher & Step Indicator */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                {(['python', 'javascript', 'cpp', 'java'] as SupportedLanguage[]).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => setLanguage(lng)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                      language === lng
                        ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {lng === 'python'
                      ? 'Python (Easiest)'
                      : lng === 'cpp'
                      ? 'C++'
                      : lng === 'java'
                      ? 'Java'
                      : 'JavaScript'}
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                Step <strong className="text-emerald-400">{currentStepIndex + 1}</strong> of {steps.length}
              </span>
            </div>

            {/* Editable Code Editor with Live Highlight on Current Line */}
            <div className="p-3 bg-slate-950 font-mono text-xs relative">
              <div className="text-[11px] text-slate-500 pb-2 mb-2 border-b border-slate-900 flex items-center justify-between">
                <span>✏️ Click anywhere to edit or type your own code:</span>
                <span className="text-emerald-400 text-[10px]">Auto-updates visual world</span>
              </div>

              {/* Code lines visual preview highlighting the active line the robot is executing */}
              <div className="space-y-1 mb-3">
                {codeLines.map((lineText, idx) => {
                  const lineNum = idx + 1;
                  const isActive = currentStep && lineNum === currentStep.lineNumber;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start py-0.5 px-2 rounded transition-all ${
                        isActive
                          ? 'bg-emerald-500/20 border-l-4 border-emerald-400 text-emerald-200 font-bold shadow-inner'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="w-6 text-slate-600 select-none text-[10px] text-right pr-2">
                        {lineNum}
                      </span>
                      <span className="whitespace-pre overflow-x-auto">{lineText || ' '}</span>
                    </div>
                  );
                })}
              </div>

              {/* Actual Editable Textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={Math.max(6, codeLines.length)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner leading-relaxed"
                placeholder="Write your code here..."
              />
            </div>

            {/* Playback Controls Bar */}
            <div className="bg-slate-950 p-3.5 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Start Over"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 text-xs font-bold flex items-center gap-1 transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
                >
                  {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Play All'}</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === steps.length - 1}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 disabled:opacity-30 text-xs font-bold flex items-center gap-1 transition border border-slate-700"
                >
                  <span>Next Step</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  const s = traceStudentCode(code, language);
                  setSteps(s);
                  setCurrentStepIndex(0);
                }}
                className="text-xs text-slate-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Re-check</span>
              </button>
            </div>
          </div>

          {/* ================= WORD-BY-WORD CODE TRANSLATOR ================= */}
          {currentStep && currentStep.wordBreakdowns.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Word-by-Word Translator (Line {currentStep.lineNumber})
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400">Click any word to see what it means:</span>
              </div>

              {/* Word Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentStep.wordBreakdowns.map((wb, wIdx) => {
                  const isSelected = selectedWordIndex === wIdx;
                  return (
                    <button
                      key={wIdx}
                      onClick={() => setSelectedWordIndex(wIdx)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 scale-105'
                          : wb.color === 'purple'
                          ? 'border-purple-500/40 bg-purple-950/30 text-purple-200 hover:border-purple-400'
                          : wb.color === 'rose'
                          ? 'border-rose-500/40 bg-rose-950/30 text-rose-200 hover:border-rose-400'
                          : wb.color === 'amber'
                          ? 'border-amber-500/40 bg-amber-950/30 text-amber-200 hover:border-amber-400'
                          : wb.color === 'blue'
                          ? 'border-sky-500/40 bg-sky-950/30 text-sky-200 hover:border-sky-400'
                          : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {wb.token}
                    </button>
                  );
                })}
              </div>

              {/* Selected Word Meaning Bubble */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 animate-fadeIn">
                {selectedWordIndex !== null && currentStep.wordBreakdowns[selectedWordIndex] ? (
                  <div>
                    <span className="font-mono font-bold text-emerald-300 mr-2 text-sm">
                      "{currentStep.wordBreakdowns[selectedWordIndex].token}":
                    </span>
                    <span>{currentStep.wordBreakdowns[selectedWordIndex].simpleMeaning}</span>
                  </div>
                ) : (
                  <p className="text-slate-400">
                    💡 Click on any word above (like <code className="text-purple-300 font-bold">int</code>, <code className="text-rose-300 font-bold">=</code>, or <code className="text-sky-300 font-bold">score</code>) to see its friendly definition in plain English!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN: WATCH WHAT YOUR CODE IS DOING ================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* 1. ROBOT TEACHER SPEECH BUBBLE */}
          <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-2xl space-y-2 relative">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 shrink-0">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Robot Teacher Explains:
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {currentStep ? currentStep.headline : 'Ready to Run!'}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
              {currentStep ? currentStep.storyExplanation : 'Write some code and let us watch what happens!'}
            </p>
          </div>

          {/* 2. FORK IN THE ROAD (IF / ELSE) CHECK CARD */}
          {currentStep && currentStep.conditionCheck && (
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                currentStep.conditionCheck.result
                  ? 'border-emerald-500 bg-emerald-950/20'
                  : 'border-rose-500 bg-rose-950/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <span>🚦 Decision Fork</span>
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    currentStep.conditionCheck.result
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {currentStep.conditionCheck.result ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>TRUE (Take This Path!)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5" />
                      <span>FALSE (Skip This Path!)</span>
                    </>
                  )}
                </span>
              </div>
              <div className="text-sm font-mono text-white font-bold mb-1">
                {currentStep.conditionCheck.substituted}
              </div>
              <p className="text-xs text-slate-300">
                {currentStep.conditionCheck.explanation}
              </p>
            </div>
          )}

          {/* 3. LOOP TRACK CARD (FOR / WHILE) */}
          {currentStep && currentStep.loopInfo && (
            <div className="p-4 rounded-2xl border-2 border-amber-500/50 bg-amber-950/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Repeat className="h-5 w-5 animate-spin" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    Repeat Loop Track
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Lap {currentStep.loopInfo.currentLap} {currentStep.loopInfo.totalLaps ? `of ${currentStep.loopInfo.totalLaps}` : ''}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Checking condition: <code className="text-amber-300">{currentStep.loopInfo.conditionText}</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. ANIMATED LABELED STORAGE BOXES & NUMBERED LOCKERS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Storage Boxes in Memory
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                {currentStep ? currentStep.boxes.length : 0} active box(es)
              </span>
            </div>

            {(!currentStep || currentStep.boxes.length === 0) ? (
              <div className="p-8 text-center text-slate-500 space-y-2 bg-slate-950 rounded-xl border border-dashed border-slate-800">
                <Package className="h-8 w-8 text-slate-700 mx-auto" />
                <p className="text-xs">No storage boxes created yet.</p>
                <p className="text-[11px] text-slate-600">
                  When you write <code className="text-emerald-400">score = 10</code>, a box labeled "score" will appear here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentStep.boxes.map((box, bIdx) => {
                  const isUpdated = box.status === 'updated';
                  const isCreated = box.status === 'created';

                  return (
                    <div
                      key={bIdx}
                      className={`rounded-2xl border-2 p-4 transition-all duration-300 ${
                        isUpdated
                          ? 'border-emerald-400 bg-emerald-950/30 shadow-lg shadow-emerald-500/20 scale-102 ring-2 ring-emerald-500/30'
                          : isCreated
                          ? 'border-sky-400 bg-sky-950/30 shadow-lg shadow-sky-500/20 scale-102 ring-2 ring-sky-500/30'
                          : 'border-slate-800 bg-slate-950'
                      }`}
                    >
                      {/* Box Top Label Tag */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-emerald-400" />
                          <span className="font-mono font-extrabold text-sm text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                            {box.name}
                          </span>
                        </div>
                        {isUpdated && (
                          <span className="text-[9px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                            ✨ Value Changed!
                          </span>
                        )}
                        {isCreated && (
                          <span className="text-[9px] uppercase font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/40">
                            ✨ New Box Created!
                          </span>
                        )}
                      </div>

                      {/* Box Friendly Type */}
                      <div className="text-[11px] text-slate-400 mb-2">
                        Type: <span className="text-slate-300 font-medium">{box.friendlyTypeLabel}</span>
                      </div>

                      {/* Box Value Display (or Numbered Lockers if List) */}
                      {box.listValues ? (
                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Numbered Lockers:</div>
                          <div className="flex gap-1.5 overflow-x-auto pb-1">
                            {box.listValues.map((itemVal, lIdx) => (
                              <div
                                key={lIdx}
                                className="flex flex-col items-center bg-slate-900 border border-slate-700 rounded-lg p-2 min-w-[42px]"
                              >
                                <span className="text-[9px] text-slate-500 font-mono">#{lIdx}</span>
                                <span className="text-xs font-bold text-emerald-300 font-mono mt-0.5">
                                  {itemVal}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                          <span className="text-xs text-slate-400">Inside the box:</span>
                          <div className="flex items-center gap-2">
                            {box.previousValue !== undefined && (
                              <span className="text-xs text-slate-500 line-through font-mono">
                                {box.previousValue}
                              </span>
                            )}
                            <span className="text-lg font-black font-mono text-emerald-400">
                              {box.value}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. COMPUTER SCREEN OUTPUT */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-sky-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Computer Screen Output
                </h4>
              </div>
              <span className="text-[10px] text-slate-500">What the user sees</span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs text-emerald-400 min-h-[50px] border border-slate-800/80 space-y-1">
              {currentStep && currentStep.screenOutput.length > 0 ? (
                currentStep.screenOutput.map((line, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-1.5">
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span>{line}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-600 italic">
                  Screen is blank (Run a line with "print" or "cout" to show text here)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
