import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Map, Compass, Code2, FileUp, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [xp, setXp] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('codelens_user_xp');
    if (saved) setXp(parseInt(saved, 10));

    const handleStorage = () => {
      const fresh = localStorage.getItem('codelens_user_xp');
      if (fresh) setXp(parseInt(fresh, 10));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/roadmap')) return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">CodeLens</span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                Visual
              </span>
            </div>
          </Link>

          {/* Minimal Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive('/')
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              <span>Journey</span>
            </Link>

            <Link
              to="/explore"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive('/explore')
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Explore Topics</span>
            </Link>

            <Link
              to="/sandbox"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive('/sandbox')
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Playground</span>
            </Link>

            <Link
              to="/syllabus"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive('/syllabus')
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Match Syllabus</span>
            </Link>
          </div>

          {/* XP Progress Badge */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-mono">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>{xp} XP</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
