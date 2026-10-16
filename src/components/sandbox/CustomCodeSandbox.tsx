import React from 'react';
import { InteractiveCodingStudio } from '../visualizer/InteractiveCodingStudio';
import { Sparkles } from 'lucide-react';

export const CustomCodeSandbox: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 font-mono">
              Free-Form Playground
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Write Any Code & Watch It Run
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Type or paste any Python, C++, Java, or JavaScript code. The visualizer animates your storage boxes and explains what each line does.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Live In-Browser Code Tracer</span>
        </div>
      </div>

      <InteractiveCodingStudio />
    </div>
  );
};
