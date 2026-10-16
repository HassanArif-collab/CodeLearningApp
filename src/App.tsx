import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { BrilliantLessonView } from './components/brilliant/BrilliantLessonView';
import { MissionStudio } from './components/challenge/MissionStudio';
import { ExploreView } from './components/explore/ExploreView';
import { SyllabusUploadView } from './components/syllabus/SyllabusUploadView';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans">
        <Navbar />

        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/" element={<RoadmapView />} />
            <Route path="/roadmap" element={<RoadmapView />} />
            <Route path="/lesson/:id" element={<BrilliantLessonView />} />
            <Route path="/mission/:id" element={<BrilliantLessonView />} />
            <Route path="/explore" element={<ExploreView />} />
            <Route path="/sandbox" element={<MissionStudio isPlaygroundMode={true} />} />
            <Route path="/syllabus" element={<SyllabusUploadView />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CodeLens • Minimal & Clean Visual Coding Platform</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
