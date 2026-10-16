import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ALL_MISSIONS } from '../../data/conceptsData';
import { LevelMission } from '../../types/visualizer';
import {
  CheckCircle,
  Lock,
  ArrowRight,
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('codelens_completed_missions');
    if (saved) {
      try {
        setCompletedIds(JSON.parse(saved));
      } catch {
        setCompletedIds([]);
      }
    }
  }, []);

  const resetProgress = () => {
    if (window.confirm('Reset your progress back to Level 1?')) {
      localStorage.removeItem('codelens_completed_missions');
      localStorage.setItem('codelens_user_xp', '0');
      setCompletedIds([]);
      window.location.reload();
    }
  };

  const isUnlocked = (_mission: LevelMission, index: number) => {
    if (index === 0) return true; // Level 1 is always unlocked
    const previousMission = ALL_MISSIONS[index - 1];
    return completedIds.includes(previousMission.id);
  };

  const completedCount = completedIds.length;
  const progressPercent = Math.round((completedCount / ALL_MISSIONS.length) * 100);

  // Find next active mission
  const nextMission = ALL_MISSIONS.find((m, idx) => isUnlocked(m, idx) && !completedIds.includes(m.id)) || ALL_MISSIONS[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* Clean Welcome Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Beginner-Friendly Coding Journey</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Learn Code by Seeing It Run
        </h1>

        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Start from Level 1. Write simple instructions, watch your storage boxes come alive, and unlock each chapter step-by-step!
        </p>

        {/* 1-Click Start Button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={`/mission/${nextMission.id}`}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/25 flex items-center gap-2 group"
          >
            <Play className="h-4 w-4 fill-current group-hover:scale-110 transition" />
            <span>Continue: {nextMission.title}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto pt-3 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Progress: {completedCount} of {ALL_MISSIONS.length} levels mastered</span>
            <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Duolingo-Style Vertical Roadmap Path */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Learning Path
          </span>
        </div>

        <div className="relative flex flex-col items-center space-y-6">
          {/* Vertical Connecting Line */}
          <div className="absolute top-8 bottom-8 w-1 bg-slate-800 -z-10 rounded-full" />

          {ALL_MISSIONS.map((mission, idx) => {
            const unlocked = isUnlocked(mission, idx);
            const isFinished = completedIds.includes(mission.id);
            const isCurrent = unlocked && !isFinished;

            return (
              <div key={mission.id} className="w-full max-w-md">
                <Link
                  to={unlocked ? `/mission/${mission.id}` : '#'}
                  onClick={(e) => {
                    if (!unlocked) e.preventDefault();
                  }}
                  className={`block rounded-2xl border p-4 transition-all ${
                    isCurrent
                      ? 'border-emerald-500 bg-slate-900 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/40 -translate-y-0.5'
                      : isFinished
                      ? 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                      : 'border-slate-900 bg-slate-950/40 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Circle Node Icon */}
                    <div
                      className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform ${
                        isCurrent
                          ? 'bg-emerald-500/20 border-2 border-emerald-500 text-white shadow-lg animate-pulse'
                          : isFinished
                          ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border border-slate-800 text-slate-600'
                      }`}
                    >
                      {unlocked ? mission.emoji : <Lock className="h-6 w-6 text-slate-600" />}
                    </div>

                    {/* Mission Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                          Level {mission.levelNumber}
                        </span>
                        {isFinished && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 fill-current" />
                            <span>Done</span>
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.2 rounded-full animate-pulse">
                            Ready to Play!
                          </span>
                        )}
                      </div>

                      <h3 className={`text-base font-bold truncate ${unlocked ? 'text-white' : 'text-slate-500'}`}>
                        {mission.title}
                      </h3>

                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {mission.shortTagline}
                      </p>
                    </div>

                    {/* Right Arrow / XP reward */}
                    <div className="shrink-0 text-right">
                      <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 block">
                        +{mission.xpReward} XP
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Progress Option */}
      <div className="text-center pt-4">
        <button
          onClick={resetProgress}
          className="text-xs text-slate-600 hover:text-slate-400 transition inline-flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset my progress to start over</span>
        </button>
      </div>
    </div>
  );
};
