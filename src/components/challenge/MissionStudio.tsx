import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ALL_MISSIONS } from '../../data/conceptsData';
import {
  LevelMission,
  SupportedLanguage,
  LiveTraceStep,
} from '../../types/visualizer';
import { traceStudentCode, checkMissionSuccess } from '../../services/liveCodeEngine';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Bot,
  Package,
  Monitor,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Award,
  ArrowLeft,
  Repeat,
  Lightbulb
} from 'lucide-react';

interface MissionStudioProps {
  isPlaygroundMode?: boolean;
}

export const MissionStudio: React.FC<MissionStudioProps> = ({ isPlaygroundMode = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find active mission (or default to Level 1)
  const mission: LevelMission =
    ALL_MISSIONS.find((m) => m.id === id) || ALL_MISSIONS[0];

  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [code, setCode] = useState<string>(
    isPlaygroundMode
      ? `# Free Playground: Write any code here!\ncoins = 10\nbonus = 40\ntotal = coins + bonus\nprint("Total coins:")\nprint(total)`
      : mission.starterCode[language] || mission.starterCode['python']
  );

  const [steps, setSteps] = useState<LiveTraceStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [successCelebration, setSuccessCelebration] = useState<{ passed: boolean; message: string } | null>(null);

  // When mission or language changes, load starter code
  useEffect(() => {
    if (!isPlaygroundMode) {
      setCode(mission.starterCode[language] || mission.starterCode['python']);
      setSuccessCelebration(null);
      setShowHint(false);
    }
  }, [mission, language, isPlaygroundMode]);

  // Execute code whenever code or language updates
  useEffect(() => {
    const trace = traceStudentCode(code, language);
    setSteps(trace);
    setCurrentStepIndex(0);

    // Validate mission goal if in mission mode
    if (!isPlaygroundMode && mission.goal) {
      const result = checkMissionSuccess(trace, mission.goal);
      if (result.passed) {
        setSuccessCelebration(result);
        // Save XP and completion in localStorage
        const savedCompleted = JSON.parse(localStorage.getItem('codelens_completed_missions') || '[]');
        if (!savedCompleted.includes(mission.id)) {
          savedCompleted.push(mission.id);
          localStorage.setItem('codelens_completed_missions', JSON.stringify(savedCompleted));

          const currentXp = parseInt(localStorage.getItem('codelens_user_xp') || '0', 10);
          localStorage.setItem('codelens_user_xp', (currentXp + mission.xpReward).toString());
          window.dispatchEvent(new Event('storage'));
        }
      } else {
        setSuccessCelebration(null);
      }
    }
  }, [code, language, mission, isPlaygroundMode]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const codeLines = code.split('\n');

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  // Find next mission for continue button
  const currentMissionIdx = ALL_MISSIONS.findIndex((m) => m.id === mission.id);
  const nextMission = currentMissionIdx < ALL_MISSIONS.length - 1 ? ALL_MISSIONS[currentMissionIdx + 1] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Mission Goal Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Back & Mission Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            to="/"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition shrink-0"
            title="Back to Journey"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-lg">{isPlaygroundMode ? '🧪' : mission.emoji}</span>
              <h2 className="text-sm font-bold text-white">
                {isPlaygroundMode ? 'Free Playground' : mission.title}
              </h2>
              {!isPlaygroundMode && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                  +{mission.xpReward} XP
                </span>
              )}
            </div>

            {!isPlaygroundMode && (
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">Goal:</span>
                <span>{mission.goal.description}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Language Selector & Hint Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {!isPlaygroundMode && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 transition"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
          )}

          {/* Language Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['python', 'javascript', 'cpp', 'java'] as SupportedLanguage[]).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  language === lng
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lng === 'python' ? 'Python' : lng === 'cpp' ? 'C++' : lng === 'java' ? 'Java' : 'JS'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optional Hint Banner */}
      {showHint && !isPlaygroundMode && (
        <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5 animate-fadeIn">
          <HelpCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 block mb-0.5">Helpful Tip:</strong>
            <span>{mission.goal.hint}</span>
          </div>
        </div>
      )}

      {/* Main 2-Column Minimal Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT: PURE FREE-TYPE CODE EDITOR ================= */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Editor Top Bar */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Code Editor <span className="text-slate-600">({language})</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Line {currentStep ? currentStep.lineNumber : 1} of {codeLines.length}
              </span>
            </div>

            {/* Line-Numbered Free-Type Code Canvas */}
            <div className="p-3 bg-slate-950 font-mono text-xs">
              {/* Visual Active Line Spotlight */}
              <div className="space-y-1 mb-2">
                {codeLines.map((lineText, idx) => {
                  const lineNum = idx + 1;
                  const isActive = currentStep && lineNum === currentStep.lineNumber;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start py-0.5 px-2 rounded transition-all ${
                        isActive
                          ? 'bg-emerald-500/15 border-l-4 border-emerald-400 text-emerald-200 font-bold'
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

              {/* Free-Type Textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={Math.max(6, codeLines.length)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition leading-relaxed"
                placeholder="Type your code here..."
              />
            </div>

            {/* Playback Controls Bar */}
            <div className="bg-slate-950 p-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Reset to Step 1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 text-xs font-bold flex items-center gap-1 transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === steps.length - 1}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-500/20 disabled:opacity-30"
                >
                  <span>Next Line</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Step <strong className="text-emerald-400">{currentStepIndex + 1}</strong> of {steps.length}
              </span>
            </div>
          </div>

          {/* 1-2 Sentence Metaphor Card */}
          {!isPlaygroundMode && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Concept Metaphor</span>
              <p>{mission.conceptAnalogy}</p>
            </div>
          )}
        </div>

        {/* ================= RIGHT: TACTILE VISUAL STAGE ================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* 1. Robot Teacher Speech Bubble */}
          <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-2xl space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Robot Teacher:
                </span>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {currentStep ? currentStep.storyHeadline : 'Ready to Run!'}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {currentStep ? currentStep.storyDetail : 'Write code on the left and see what happens here!'}
            </p>
          </div>

          {/* 2. Decision Gate / Loop Track Status (when active) */}
          {currentStep && currentStep.conditionCheck && (
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                currentStep.conditionCheck.result
                  ? 'border-emerald-500 bg-emerald-950/20'
                  : 'border-rose-500 bg-rose-950/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300">🚦 Decision Gate</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    currentStep.conditionCheck.result
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {currentStep.conditionCheck.result ? 'PASS ✅' : 'FAIL ❌'}
                </span>
              </div>
              <p className="text-xs text-white font-mono">{currentStep.conditionCheck.question}</p>
            </div>
          )}

          {currentStep && currentStep.loopCheck && (
            <div className="p-4 rounded-2xl border-2 border-amber-500/50 bg-amber-950/20 flex items-center gap-3">
              <Repeat className="h-5 w-5 text-amber-400 animate-spin" />
              <div>
                <h4 className="text-xs font-bold text-white">
                  Loop Lap {currentStep.loopCheck.currentLap} of {currentStep.loopCheck.totalLaps}
                </h4>
                <p className="text-[11px] text-slate-400">Condition: {currentStep.loopCheck.conditionText}</p>
              </div>
            </div>
          )}

          {/* 3. Tactile Storage Boxes & Lockers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Storage Boxes in Memory
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">
                {currentStep ? currentStep.boxes.length : 0} box(es)
              </span>
            </div>

            {(!currentStep || currentStep.boxes.length === 0) ? (
              <div className="p-6 text-center text-slate-500 bg-slate-950 rounded-xl border border-dashed border-slate-800">
                <p className="text-xs">No storage boxes created yet.</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Write <code className="text-emerald-400">coins = 50</code> to see a box appear!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.boxes.map((box, bIdx) => {
                  return (
                    <div
                      key={bIdx}
                      className={`rounded-2xl border-2 p-3.5 transition-all ${
                        box.hasChanged
                          ? 'border-emerald-400 bg-emerald-950/30 scale-102 ring-2 ring-emerald-500/30'
                          : box.isNew
                          ? 'border-sky-400 bg-sky-950/30 scale-102 ring-2 ring-sky-500/30'
                          : 'border-slate-800 bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="font-mono font-bold text-xs text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                            {box.name}
                          </span>
                        </div>
                        {box.hasChanged && (
                          <span className="text-[9px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.2 rounded-full">
                            Updated!
                          </span>
                        )}
                        {box.isNew && (
                          <span className="text-[9px] uppercase font-bold text-sky-300 bg-sky-500/20 px-2 py-0.2 rounded-full">
                            New Box!
                          </span>
                        )}
                      </div>

                      {/* Numbered Lockers if list */}
                      {box.listItems ? (
                        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1">
                          {box.listItems.map((itemVal, lIdx) => (
                            <div
                              key={lIdx}
                              className="flex flex-col items-center bg-slate-900 border border-slate-700 rounded-lg p-1.5 min-w-[36px]"
                            >
                              <span className="text-[9px] text-slate-500 font-mono">#{lIdx}</span>
                              <span className="text-xs font-bold text-emerald-300 font-mono">
                                {itemVal}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                          <span className="text-xs text-slate-400">Value:</span>
                          <div className="flex items-center gap-2">
                            {box.previousValue !== undefined && (
                              <span className="text-xs text-slate-500 line-through font-mono">
                                {box.previousValue}
                              </span>
                            )}
                            <span className="text-base font-black font-mono text-emerald-400">
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

          {/* 4. Screen Output Monitor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-sky-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Screen Output
                </h4>
              </div>
              <span className="text-[10px] text-slate-500">Computer Display</span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs text-emerald-400 min-h-[46px] border border-slate-800 space-y-1">
              {currentStep && currentStep.screenOutput.length > 0 ? (
                currentStep.screenOutput.map((line, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-1.5">
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span>{line}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-600 italic">Screen is blank</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CELEBRATION MODAL ON SUCCESS ================= */}
      {successCelebration && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl relative">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
              <Award className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>+{mission.xpReward} XP Earned!</span>
              </div>
              <h3 className="text-2xl font-black text-white pt-1">Level Complete!</h3>
              <p className="text-xs text-slate-300">{successCelebration.message}</p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {nextMission ? (
                <button
                  onClick={() => {
                    setSuccessCelebration(null);
                    navigate(`/mission/${nextMission.id}`);
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                >
                  <span>Continue to Next Level: {nextMission.title}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <Link
                  to="/"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <span>You Mastered All Levels! Back to Journey</span>
                </Link>
              )}

              <button
                onClick={() => setSuccessCelebration(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
              >
                Stay and Keep Experimenting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
