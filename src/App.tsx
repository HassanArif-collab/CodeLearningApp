import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { InteractiveCodingStudio } from './components/visualizer/InteractiveCodingStudio';
import { SyllabusUploadView } from './components/syllabus/SyllabusUploadView';
import { CustomCodeSandbox } from './components/sandbox/CustomCodeSandbox';
import { STARTER_LESSONS } from './data/conceptsData';
import { SupportedLanguage } from './types/visualizer';
import { AdSlot } from './components/monetization/AdSlot';
import {
  FileUp,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

// Single Lesson Route
const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const langParam = (searchParams.get('lang') as SupportedLanguage) || 'python';

  const lesson = STARTER_LESSONS.find((l) => l.id === id) || STARTER_LESSONS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Lesson Selector Bar */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max">
          {STARTER_LESSONS.map((l) => (
            <Link
              key={l.id}
              to={`/lesson/${l.id}?lang=${langParam}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                l.id === lesson.id
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md'
                  : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-sm">{l.emoji}</span>
              <span>{l.title.split(':')[1] || l.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <InteractiveCodingStudio lesson={lesson} initialLanguage={langParam} />
    </div>
  );
};

// Home Main Page
const HomePage: React.FC = () => {
  const [activeLessonId, setActiveLessonId] = useState<string>('variables-storage-boxes');
  const activeLesson = STARTER_LESSONS.find((l) => l.id === activeLessonId) || STARTER_LESSONS[1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Friendly Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Write Code • See What It Actually Does</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Learn Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Visually in Memory</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Type or edit code on the left. The robot teacher explains what every line means, translates words in plain English, and animates your storage boxes live!
        </p>

        <div className="flex items-center justify-center gap-3 pt-1">
          <Link
            to="/syllabus"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 px-3.5 py-2 rounded-xl transition"
          >
            <FileUp className="h-4 w-4" />
            <span>Upload School Syllabus (PDF / Photo)</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Lesson Selector Carousel Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-bold flex items-center gap-1.5 text-slate-200">
            <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
            <span>Pick a Beginner Lesson or Write Your Own:</span>
          </span>
          <span className="text-[11px] text-slate-500">8 Progressive Lessons</span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-max">
            {STARTER_LESSONS.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveLessonId(l.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                  l.id === activeLessonId
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/10 scale-102'
                    : 'border-slate-800 bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-base">{l.emoji}</span>
                <span>{l.title.split(':')[1] || l.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Interactive Coding Studio */}
      <InteractiveCodingStudio lesson={activeLesson} />

      {/* Bottom Subtle Ad Slot */}
      <AdSlot slotType="banner" />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
        <Navbar />
        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lesson/:id" element={<LessonDetailPage />} />
            <Route path="/syllabus" element={<SyllabusUploadView />} />
            <Route path="/sandbox" element={<CustomCodeSandbox />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} CodeLens • Free Visual Learning Tool for Beginning Coders</p>
          <p className="text-[11px] text-slate-600">
            Runs 100% in your browser. No server bills, no latency.
          </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
