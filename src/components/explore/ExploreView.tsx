import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_MISSIONS } from '../../data/conceptsData';
import { Compass, ArrowRight, Sparkles } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'basics' | 'logic' | 'data'>('all');

  const filteredMissions = ALL_MISSIONS.filter((m) => {
    if (filter === 'basics') return [1, 2, 3].includes(m.levelNumber);
    if (filter === 'logic') return [4, 5].includes(m.levelNumber);
    if (filter === 'data') return [6, 7, 8].includes(m.levelNumber);
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-2 font-mono">
            <Sparkles className="h-3 w-3" />
            <span>Open Catalog • No Locked Levels</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Explore All Coding Topics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Jump directly into any topic to write code and watch how memory works.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('basics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'basics' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Basics
          </button>
          <button
            onClick={() => setFilter('logic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'logic' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Logic & Loops
          </button>
          <button
            onClick={() => setFilter('data')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'data' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lists & Pointers
          </button>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => (
          <Link
            key={mission.id}
            to={`/mission/${mission.id}`}
            className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg transition flex flex-col justify-between hover:-translate-y-0.5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{mission.emoji}</span>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Level {mission.levelNumber}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                  {mission.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {mission.conceptAnalogy}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-500">
                <strong className="text-slate-400">Mission: </strong>
                <span>{mission.goal.description}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span className="flex items-center gap-1">
                <Compass className="h-3.5 w-3.5" />
                <span>Launch & Code</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
