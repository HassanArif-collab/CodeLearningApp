import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BRILLIANT_LESSONS } from '../../data/conceptsData';
import {
  BrilliantLesson,
  SupportedLanguage,
  LiveTraceStep,
} from '../../types/visualizer';
import { traceStudentCode, checkMissionSuccess } from '../../services/liveCodeEngine';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Bot,
  Package,
  Monitor
} from 'lucide-react';

export const BrilliantLessonView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find active lesson (or default to Level 1)
  const lesson: BrilliantLesson =
    BRILLIANT_LESSONS.find((l) => l.id === id) || BRILLIANT_LESSONS[0];

  // Brilliant 3-Phase Step: 1 = Concept, 2 = Quiz, 3 = Code Challenge
  const [phase, setPhase] = useState<1 | 2 | 3>(1);

  // Phase 1 interactive state
  const [conceptActivated, setConceptActivated] = useState(false);

  // Phase 2 quiz state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);

  // Phase 3 code challenge state
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [code, setCode] = useState<string>(lesson.challenge.starterCode['python']);
  const [steps, setSteps] = useState<LiveTraceStep[]>([]);
  const [hasRunCode, setHasRunCode] = useState(false);
  const [challengeSuccess, setChallengeSuccess] = useState(false);

  // Reset when lesson changes
  useEffect(() => {
    setPhase(1);
    setConceptActivated(false);
    setSelectedOptionId(null);
    setIsQuizCorrect(null);
    setLanguage('python');
    setCode(lesson.challenge.starterCode['python']);
    setHasRunCode(false);
    setChallengeSuccess(false);
  }, [lesson]);

  // Update starter code when language changes
  useEffect(() => {
    setCode(lesson.challenge.starterCode[language] || lesson.challenge.starterCode['python']);
    setHasRunCode(false);
    setChallengeSuccess(false);
  }, [language, lesson]);

  // Handle Quiz option selection
  const handleSelectQuizOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    const opt = lesson.quiz.options.find((o) => o.id === optionId);
    if (opt?.isCorrect) {
      setIsQuizCorrect(true);
    } else {
      setIsQuizCorrect(false);
    }
  };

  // Run Code in Phase 3
  const handleRunCode = () => {
    const trace = traceStudentCode(code, language);
    setSteps(trace);
    setHasRunCode(true);

    const goal = {
      description: lesson.challenge.instruction,
      targetVarName: lesson.challenge.targetVarName,
      expectedValue: lesson.challenge.expectedValue,
      expectedOutputIncludes: lesson.challenge.expectedOutputIncludes,
      hint: lesson.challenge.hint,
    };

    const result = checkMissionSuccess(trace, goal);
    if (result.passed) {
      setChallengeSuccess(true);
      // Save completion & XP in localStorage
      const savedCompleted = JSON.parse(localStorage.getItem('codelens_completed_missions') || '[]');
      if (!savedCompleted.includes(lesson.id)) {
        savedCompleted.push(lesson.id);
        localStorage.setItem('codelens_completed_missions', JSON.stringify(savedCompleted));

        const currentXp = parseInt(localStorage.getItem('codelens_user_xp') || '0', 10);
        localStorage.setItem('codelens_user_xp', (currentXp + lesson.xpReward).toString());
        window.dispatchEvent(new Event('storage'));
      }
    }
  };

  const currentStep = steps[steps.length - 1] || steps[0];
  const nextLessonIdx = BRILLIANT_LESSONS.findIndex((l) => l.id === lesson.id) + 1;
  const nextLesson = nextLessonIdx < BRILLIANT_LESSONS.length ? BRILLIANT_LESSONS[nextLessonIdx] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header & 3-Step Progress Bar (Like Brilliant) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Journey</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xl">{lesson.emoji}</span>
            <span className="text-xs font-bold text-white font-mono">{lesson.title}</span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
              +{lesson.xpReward} XP
            </span>
          </div>
        </div>

        {/* 3-Step Phase Segment Bar */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPhase(1)}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              phase === 1
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>1. Visual Concept</span>
          </button>
          <button
            onClick={() => setPhase(2)}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              phase === 2
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>2. Quick Test</span>
            {isQuizCorrect && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>
          <button
            onClick={() => setPhase(3)}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              phase === 3
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>3. Code It!</span>
            {challengeSuccess && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PHASE 1: VISUAL CONCEPT CARD (Clean, Centered, Focused)        */}
      {/* ============================================================== */}
      {phase === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn text-center">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
              Step 1 • Visual Concept
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {lesson.concept.title}
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              {lesson.concept.subtitle}
            </p>
          </div>

          {/* Interactive Visual Playground Widget */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto shadow-inner">
            {lesson.concept.widgetType === 'robot_talk' && (
              <div className="space-y-4 text-center">
                <div
                  className={`h-20 w-20 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-xl transition-all duration-300 ${
                    conceptActivated
                      ? 'bg-emerald-500 text-slate-950 scale-110 shadow-emerald-500/30 ring-4 ring-emerald-500/30'
                      : 'bg-slate-900 border-2 border-slate-700 text-slate-400'
                  }`}
                >
                  <Bot className="h-10 w-10" />
                </div>

                {conceptActivated ? (
                  <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm font-mono font-bold animate-fadeIn">
                    "Hello, Human! I follow your instructions line-by-line!"
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic">
                    The robot is sleeping. Click below to give it an instruction!
                  </div>
                )}

                <button
                  onClick={() => setConceptActivated(!conceptActivated)}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-emerald-500/20"
                >
                  {conceptActivated ? 'Reset Robot' : '⚡ Tell Robot: print("Hello!")'}
                </button>
              </div>
            )}

            {lesson.concept.widgetType === 'variable_box' && (
              <div className="space-y-4 text-center w-full">
                {/* Physical Cardboard Box Metaphor */}
                <div
                  className={`border-3 rounded-2xl p-6 transition-all duration-300 max-w-xs mx-auto ${
                    conceptActivated
                      ? 'border-emerald-500 bg-emerald-950/30 shadow-xl shadow-emerald-500/20 scale-105'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                      label: "coins"
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Storage Box</span>
                  </div>

                  <div className="h-16 flex items-center justify-center">
                    {conceptActivated ? (
                      <div className="flex items-center gap-2 animate-bounce">
                        <span className="text-3xl">🪙</span>
                        <span className="text-3xl font-black font-mono text-emerald-400">50</span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-600 italic">Empty Box</div>
                    )}
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  {conceptActivated ? (
                    <span className="text-emerald-300">Code: <strong className="text-white">coins = 50</strong> (50 dropped inside!)</span>
                  ) : (
                    <span>Click below to drop 50 coins inside the box:</span>
                  )}
                </div>

                <button
                  onClick={() => setConceptActivated(!conceptActivated)}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-emerald-500/20"
                >
                  {conceptActivated ? 'Empty Box' : '📦 Drop 50 into "coins" box'}
                </button>
              </div>
            )}

            {lesson.concept.widgetType !== 'robot_talk' && lesson.concept.widgetType !== 'variable_box' && (
              <div className="space-y-4 text-center">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto">
                  {lesson.emoji}
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {lesson.concept.analogyTagline}
                </p>
                <button
                  onClick={() => setConceptActivated(true)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl transition border border-slate-700"
                >
                  {conceptActivated ? 'Active' : 'See Animation'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Text */}
          <div className="max-w-lg mx-auto space-y-3">
            <p className="text-sm text-slate-200 leading-relaxed">
              {lesson.concept.explanation}
            </p>
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center justify-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{lesson.concept.analogyTagline}</span>
            </div>
          </div>

          {/* Big Continue Button */}
          <div className="pt-2">
            <button
              onClick={() => setPhase(2)}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl transition shadow-lg shadow-emerald-500/25 inline-flex items-center gap-2"
            >
              <span>Got It! Let's Test It</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 2: VISUAL QUIZ CARD (Immediate Check, Like Brilliant)    */}
      {/* ============================================================== */}
      {phase === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn text-center">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
              Step 2 • Quick Visual Test
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white max-w-lg mx-auto leading-snug">
              {lesson.quiz.question}
            </h2>
            {lesson.quiz.contextNote && (
              <p className="text-xs text-slate-400 font-medium">{lesson.quiz.contextNote}</p>
            )}
          </div>

          {/* Quiz Options */}
          <div className="space-y-3 max-w-md mx-auto text-left">
            {lesson.quiz.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isSubmitted = selectedOptionId !== null;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectQuizOption(opt.id)}
                  className={`w-full p-4 rounded-2xl border-2 text-xs sm:text-sm font-medium transition flex items-start gap-3 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-2 ring-emerald-500/30'
                        : 'border-rose-500 bg-rose-950/40 text-rose-200'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isSelected && opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    {isSelected && !opt.isCorrect && <XCircle className="h-4 w-4 text-rose-400" />}
                    {!isSelected && <div className="h-4 w-4 rounded-full border border-slate-600" />}
                  </div>
                  <div>
                    <span className="block font-bold">{opt.label}</span>
                    {isSubmitted && isSelected && (
                      <p className="text-xs mt-1.5 opacity-90 leading-relaxed font-sans">
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Advance Button (unlocked when correct) */}
          <div className="pt-2">
            {isQuizCorrect ? (
              <button
                onClick={() => setPhase(3)}
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl transition shadow-lg shadow-emerald-500/25 inline-flex items-center gap-2 animate-bounce"
              >
                <span>Awesome! Continue to Code Challenge</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="text-xs text-slate-500 italic">
                Select the correct answer to unlock the code challenge!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 3: CLEAN, FOCUSED CODE CHALLENGE                         */}
      {/* ============================================================== */}
      {phase === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          {/* Challenge Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-mono mb-2 inline-block">
                Step 3 • Hands-On Code
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {lesson.challenge.instruction}
              </h2>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
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

          {/* Clean Single-Pane Free-Type Code Editor */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Code Editor ({language})</span>
              <span className="text-[11px] text-slate-500">{lesson.challenge.hint}</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={5}
              className="w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-white focus:outline-none leading-relaxed resize-none"
              placeholder="Write your code here..."
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => setCode(lesson.challenge.starterCode[language])}
              className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Code</span>
            </button>

            <button
              onClick={handleRunCode}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <span>Run & Check Code</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Result Output Preview (Only shows when code has run) */}
          {hasRunCode && currentStep && (
            <div className="pt-4 border-t border-slate-800 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Visual Storage Boxes (if created) */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Package className="h-4 w-4 text-emerald-400" />
                    <span>Memory Storage Boxes</span>
                  </div>
                  {currentStep.boxes.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentStep.boxes.map((b, idx) => (
                        <div key={idx} className="bg-slate-900 border border-emerald-500/40 rounded-xl p-3 flex-1 min-w-[120px]">
                          <div className="text-[10px] font-mono text-slate-500">{b.name}</div>
                          <div className="text-base font-black font-mono text-emerald-300">{b.value}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 italic">No storage boxes created yet.</div>
                  )}
                </div>

                {/* Screen Display Output */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Monitor className="h-4 w-4 text-sky-400" />
                    <span>Screen Display</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-300 min-h-[36px] flex items-center">
                    {currentStep.screenOutput.length > 0 ? (
                      currentStep.screenOutput.join(', ')
                    ) : (
                      <span className="text-slate-600 italic">Screen is blank</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Celebration Card */}
          {challengeSuccess && (
            <div className="p-6 bg-gradient-to-r from-emerald-950/60 to-slate-900 border-2 border-emerald-500 rounded-2xl text-center space-y-3 animate-fadeIn">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-white">Challenge Complete!</h3>
              <p className="text-xs text-emerald-300">
                You earned <strong className="text-white">+{lesson.xpReward} XP</strong> and mastered this lesson!
              </p>

              <div className="pt-2">
                {nextLesson ? (
                  <button
                    onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/25 inline-flex items-center gap-2"
                  >
                    <span>Next Lesson: {nextLesson.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    to="/"
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition inline-flex items-center gap-2"
                  >
                    <span>Back to Journey Roadmap</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
