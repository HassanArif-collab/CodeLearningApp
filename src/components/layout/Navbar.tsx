import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, FileUp, Code2, BookOpen, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <Bot className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">CodeLens</span>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Visual Coding
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Write Real Code & Watch What It Actually Does</p>
            </div>
          </Link>

          {/* Clean 3 Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                isActive('/')
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Learn & Write Code</span>
            </Link>

            <Link
              to="/syllabus"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                isActive('/syllabus')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileUp className="h-4 w-4 text-emerald-400" />
              <span>Match School Syllabus</span>
              <span className="hidden md:inline text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">PDF/Photo</span>
            </Link>

            <Link
              to="/sandbox"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                isActive('/sandbox')
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>Playground</span>
            </Link>
          </div>

          {/* Friendly Tag */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Explain Like I'm 10</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
