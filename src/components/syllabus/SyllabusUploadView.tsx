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
import { ALL_MISSIONS } from '../../data/conceptsData';
import {
  Upload,
  FileText,
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
          <Sparkles className="h-3 w-3" />
          <span>Upload Teacher Syllabus (PDF / Photo)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Generate Your Custom Class Path
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload your syllabus PDF or take a photo of a printed handout. We will match your class topics to interactive missions.
        </p>
      </div>

      {/* Main Import Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'upload'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload PDF / Photo</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'paste'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Paste Text</span>
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'presets'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Sample Syllabi</span>
          </button>
        </div>

        <div className="p-6">
          {/* Optional Course Title Input */}
          <div className="max-w-md mx-auto mb-5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Class Name (Optional):
            </label>
            <input
              type="text"
              value={courseTitleInput}
              onChange={(e) => setCourseTitleInput(e.target.value)}
              placeholder="e.g. CS101: Intro to Coding"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {activeTab === 'upload' && (
            <div className="max-w-md mx-auto space-y-4">
              <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-950/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition">
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,.txt"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="hidden"
                />
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-xs font-bold text-white mb-0.5">
                  Click to Choose or Drag Syllabus
                </h3>
                <p className="text-[11px] text-slate-500">
                  Accepts PDF (digital or scanned) and Photos (PNG, JPG).
                </p>
              </label>

              {isProcessing && progress && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400 flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      {progress.message}
                    </span>
                    <span className="font-mono text-slate-300 font-bold">{progress.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
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
            <div className="max-w-xl mx-auto space-y-3">
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your course outline, lecture topics, or weekly syllabus here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleParsePastedText}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Build My Class Roadmap</span>
              </button>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_SYLLABI.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(sample)}
                  className="text-left p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-mono mb-1.5 inline-block">
                      {sample.language.toUpperCase()}
                    </span>
                    <h4 className="text-xs font-bold text-white mb-1">{sample.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {sample.text}
                    </p>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold mt-2">Select →</span>
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
        <div className="space-y-4 pt-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Your Class Roadmap
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-300 px-2 py-0.2 rounded">
                    {roadmap.detectedLanguage.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{roadmap.courseTitle}</h2>
              </div>

              <div className="text-right">
                <span className="text-xl font-bold font-mono text-emerald-400">{percentComplete}%</span>
                <span className="text-xs text-slate-400 block">{completedCount} of {totalCount} completed</span>
              </div>
            </div>

            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {roadmap.items.map((item) => {
              const matchedMission = ALL_MISSIONS.find((m) => m.id === item.matchedMissionId);

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.completed
                      ? 'border-emerald-500/30 bg-emerald-950/10'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleComplete(item.id)}
                        className={`h-5 w-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                          item.completed
                            ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                            : 'border-slate-700 bg-slate-950 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">
                            {item.weekLabel}
                          </span>
                        </div>
                        <h4 className={`text-xs sm:text-sm font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                          {matchedMission ? matchedMission.title : item.rawMatchedLine}
                        </h4>
                      </div>
                    </div>

                    {matchedMission && (
                      <Link
                        to={`/mission/${matchedMission.id}?lang=${roadmap.detectedLanguage}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 transition shrink-0"
                      >
                        <Code2 className="h-3 w-3" />
                        <span>Play</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
