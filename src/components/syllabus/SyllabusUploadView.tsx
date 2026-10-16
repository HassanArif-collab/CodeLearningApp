import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  extractTextFromUploadedFile,
  ExtractionProgress,
} from '../../services/syllabusExtractor';
import {
  parseSyllabusToRoadmap,
  getRoadmapFromStorage,
  saveRoadmapToStorage,
  SAMPLE_SYLLABI,
} from '../../services/syllabusMatcher';
import { CustomSyllabusRoadmap } from '../../types/visualizer';
import { STARTER_LESSONS } from '../../data/conceptsData';
import { AdSlot } from '../monetization/AdSlot';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  RefreshCw,
  Code2
} from 'lucide-react';

export const SyllabusUploadView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'presets'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [courseTitleInput, setCourseTitleInput] = useState('');
  const [progress, setProgress] = useState<ExtractionProgress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<CustomSyllabusRoadmap | null>(null);

  useEffect(() => {
    const existing = getRoadmapFromStorage();
    if (existing) {
      setRoadmap(existing);
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsProcessing(true);
    setProgress({ stage: 'reading', percent: 5, message: `Reading ${file.name}...` });

    try {
      const extractedText = await extractTextFromUploadedFile(file, (p) => {
        setProgress(p);
      });

      const title = courseTitleInput.trim() || file.name.replace(/\.[^/.]+$/, '');
      const newRoadmap = parseSyllabusToRoadmap(extractedText, title);
      setRoadmap(newRoadmap);
      setProgress(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract text from file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Please paste your syllabus text first.');
      return;
    }
    setErrorMsg(null);
    const title = courseTitleInput.trim() || 'My School Coding Class';
    const newRoadmap = parseSyllabusToRoadmap(pastedText, title);
    setRoadmap(newRoadmap);
  };

  const handleSelectPreset = (preset: (typeof SAMPLE_SYLLABI)[0]) => {
    setErrorMsg(null);
    const newRoadmap = parseSyllabusToRoadmap(preset.text, preset.title);
    setRoadmap(newRoadmap);
  };

  const handleToggleComplete = (itemId: string) => {
    if (!roadmap) return;
    const updated = {
      ...roadmap,
      items: roadmap.items.map((it) =>
        it.id === itemId ? { ...it, completed: !it.completed } : it
      ),
    };
    setRoadmap(updated);
    saveRoadmapToStorage(updated);
  };

  const completedCount = roadmap?.items.filter((it) => it.completed).length || 0;
  const totalCount = roadmap?.items.length || 0;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Upload School or University Syllabus</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Match Your Exact Class Syllabus
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Upload your teacher's <strong>PDF</strong>, take a <strong>photo of a printed handout</strong> with your phone, or pick a starter syllabus. We will build a friendly week-by-week visual roadmap for your class!
        </p>
      </div>

      {/* Main Import Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'upload'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload PDF or Photo</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'paste'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Paste Syllabus Text</span>
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'presets'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Sample Syllabi</span>
          </button>
        </div>

        <div className="p-6">
          {/* Optional Course Title Input */}
          <div className="max-w-md mx-auto mb-6">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Course / Class Name (Optional):
            </label>
            <input
              type="text"
              value={courseTitleInput}
              onChange={(e) => setCourseTitleInput(e.target.value)}
              placeholder="e.g. My Semester 1 Coding Class"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {activeTab === 'upload' && (
            <div className="max-w-xl mx-auto space-y-4">
              <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 bg-slate-950/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition group">
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,.txt"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="hidden"
                />
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Click to Choose or Drag Syllabus Here
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-3">
                  Upload a <span className="text-emerald-400 font-semibold">PDF</span> or <span className="text-emerald-400 font-semibold">Photo/Screenshot (PNG, JPG)</span>.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-rose-400" /> PDF Reader</span>
                  <span className="flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5 text-sky-400" /> Image OCR</span>
                </div>
              </label>

              {isProcessing && progress && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400 flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      {progress.message}
                    </span>
                    <span className="font-mono text-slate-300 font-bold">{progress.percent}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <textarea
                rows={7}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your course outline, lecture topics, or homework syllabus here... e.g.&#10;Week 1: Intro to variables and printing&#10;Week 2: Math and updating values&#10;Week 3: If statements and decisions&#10;Week 4: Loops and counting..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleParsePastedText}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Build My Class Roadmap</span>
              </button>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_SYLLABI.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(sample)}
                  className="text-left p-4 rounded-xl border border-slate-800 bg-slate-950 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono mb-2 inline-block">
                      {sample.language.toUpperCase()}
                    </span>
                    <h4 className="text-xs font-bold text-white mb-1">{sample.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-3 font-mono">
                      {sample.text}
                    </p>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold mt-3">Select Syllabus →</span>
                </button>
              ))}
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 text-center">
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* Generated Roadmap */}
      {roadmap && (
        <div className="space-y-6 pt-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Your Personalized Course Path
                  </span>
                  <span className="text-xs font-mono uppercase bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                    Language: {roadmap.detectedLanguage.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{roadmap.courseTitle}</h2>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {percentComplete}%
                </div>
                <div className="text-xs text-slate-400">
                  {completedCount} of {totalCount} topics mastered
                </div>
              </div>
            </div>

            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-3">
            {roadmap.items.map((item, idx) => {
              const matchedLesson = STARTER_LESSONS.find((l) => l.id === item.lessonId);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.completed
                      ? 'border-emerald-500/30 bg-emerald-950/10'
                      : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleComplete(item.id)}
                        className={`mt-0.5 h-6 w-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                          item.completed
                            ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                            : 'border-slate-700 bg-slate-950 text-transparent hover:border-slate-500'
                        }`}
                        title="Mark as Finished"
                      >
                        <CheckCircle2 className="h-4 w-4 fill-current" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                            {item.weekLabel}
                          </span>
                          <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                        </div>

                        <h3
                          className={`text-sm sm:text-base font-bold ${
                            item.completed ? 'text-slate-400 line-through' : 'text-white'
                          }`}
                        >
                          {matchedLesson ? matchedLesson.title : item.rawMatchedLine}
                        </h3>

                        {matchedLesson && (
                          <p className="text-xs text-slate-400 mt-1">
                            {matchedLesson.kidSubtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {matchedLesson && (
                      <Link
                        to={`/lesson/${matchedLesson.id}?lang=${roadmap.detectedLanguage}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 transition shrink-0 border border-slate-700"
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        <span>Open & Write Code</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <AdSlot slotType="leaderboard" />
        </div>
      )}
    </div>
  );
};
