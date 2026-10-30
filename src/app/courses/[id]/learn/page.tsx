'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Play, Pause, RotateCcw, Volume2, Maximize,
  CheckCircle2, Circle, ChevronRight, ChevronLeft, BookOpen,
  Award, FileText, Download, Share2, Sparkles, HelpCircle
} from 'lucide-react';
import { COURSES, Lesson } from '@/lib/seed-data';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/ui/AuthGuard';

function CourseLearningContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const course = COURSES.find(c => c.id === courseId) || COURSES[0];

  // Flatten all lessons
  const allLessons: (Lesson & { moduleTitle: string; moduleIdx: number })[] = [];
  course.modules.forEach((mod, mIdx) => {
    mod.lessons.forEach(l => {
      allLessons.push({ ...l, moduleTitle: mod.title, moduleIdx: mIdx });
    });
  });

  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<number, boolean>>({ 0: true });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [videoProgress, setVideoProgress] = useState(35);
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz' | 'resources'>('notes');
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  const currentLesson = allLessons[currentLessonIdx] || allLessons[0];
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  const handleMarkComplete = () => {
    const nextCompleted = { ...completedLessons, [currentLessonIdx]: true };
    setCompletedLessons(nextCompleted);
    toast.success('Lesson marked complete! ✨');

    if (currentLessonIdx < allLessons.length - 1) {
      setCurrentLessonIdx(prev => prev + 1);
    } else {
      setShowCelebrationModal(true);
    }
  };

  const handleQuizSubmit = () => {
    if (!quizAnswer) {
      toast.error('Please select an option');
      return;
    }
    setQuizSubmitted(true);
    toast.success('Quiz submitted! Great job.');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Learning Bar */}
      <header className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.id}`}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to Course Details"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm md:text-base font-bold text-white truncate max-w-xs md:max-w-md">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-400 truncate">
              {currentLesson.moduleTitle} • {currentLesson.title}
            </p>
          </div>
        </div>

        {/* Progress & Certificate CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {progressPercent}% Complete
            </span>
          </div>

          <Link
            href={`/courses/${course.id}/certificate`}
            className="px-3.5 py-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Award size={15} />
            <span className="hidden md:inline">View Certificate</span>
          </Link>
        </div>
      </header>

      {/* Main Grid: Video/Lesson Player + Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center Area: Video & Notes */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 p-4 md:p-6 lg:p-8 space-y-6">
          {/* Simulated Video Player */}
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-slate-800 flex flex-col justify-between group">
            {/* Video Canvas Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/40 flex items-center justify-center p-6">
              {/* Play / Pause Center Icon */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 group-hover:opacity-100"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1 fill-white" />}
              </button>

              {/* Watermark / Logo */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <img src="/logo-transparent.png" alt="Tibeb" className="w-5 h-5 object-contain" />
                <span className="text-xs font-bold tracking-tight text-white/90">Tibeb Learning</span>
              </div>
            </div>

            {/* Top Video Title Overlay */}
            <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Lesson Video Lecture
              </span>
              <h2 className="text-white text-base md:text-lg font-bold mt-1">
                {currentLesson.title}
              </h2>
            </div>

            {/* Custom Bottom Video Controls Bar */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-2">
              {/* Scrub Bar */}
              <div
                className="w-full bg-white/20 hover:bg-white/30 h-1.5 hover:h-2 rounded-full cursor-pointer transition-all relative overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  setVideoProgress(Math.round((clickX / rect.width) * 100));
                }}
              >
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between text-xs text-white/80 pt-1">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
                  </button>
                  <button
                    onClick={() => setVideoProgress(prev => Math.max(0, prev - 10))}
                    className="hover:text-emerald-400 transition-colors"
                    title="Rewind 10s"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <span className="font-mono text-[11px] text-slate-300">
                    05:24 / {currentLesson.duration}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed toggle */}
                  <button
                    onClick={() => {
                      const speeds = ['1.0x', '1.25x', '1.5x', '2.0x'];
                      const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(next);
                      toast(`Playback speed set to ${next}`, { duration: 1000 });
                    }}
                    className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded font-mono text-[11px] font-bold text-slate-200"
                  >
                    {playbackSpeed}
                  </button>

                  <button className="hover:text-emerald-400 transition-colors">
                    <Volume2 size={16} />
                  </button>
                  <button className="hover:text-emerald-400 transition-colors">
                    <Maximize size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Action Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentLessonIdx(prev => Math.max(0, prev - 1))}
                disabled={currentLessonIdx === 0}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <ChevronLeft size={16} /> Previous Lesson
              </button>
              <button
                onClick={() => setCurrentLessonIdx(prev => Math.min(allLessons.length - 1, prev + 1))}
                disabled={currentLessonIdx === allLessons.length - 1}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 transition-all"
              >
                Next Lesson <ChevronRight size={16} />
              </button>
            </div>

            <button
              onClick={handleMarkComplete}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
            >
              <CheckCircle2 size={16} />
              {completedLessons[currentLessonIdx] ? 'Completed (Next)' : 'Mark Lesson Complete'}
            </button>
          </div>

          {/* Lesson Content & Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2 px-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'notes'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Lesson Notes & Formulas
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`pb-2 px-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'quiz'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Interactive Quiz
              </button>
            </div>

            {activeTab === 'notes' ? (
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <h3 className="text-base font-bold text-white">{currentLesson.title}</h3>
                <p>{currentLesson.summary}</p>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-amber-300 space-y-2">
                  <p className="font-bold text-slate-400 uppercase text-[10px]">Key Mathematical Rule:</p>
                  <p>lim (x → 0) [sin(kx) / x] = k</p>
                  <p>d/dx [f(g(x))] = f'(g(x)) * g'(x)</p>
                </div>
                <p>
                  {currentLesson.content || 'Practice these questions to verify your retention before moving to the next section.'}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-white">Module Checkpoint Quiz</h3>
                <p className="text-xs text-slate-400">
                  Select the correct answer to check your mastery for this module.
                </p>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-200">
                    What is the derivative of e^(2x) with respect to x?
                  </p>
                  {[
                    { key: 'A', text: 'e^(2x)' },
                    { key: 'B', text: '2e^(2x)' },
                    { key: 'C', text: 'e^(2x) / 2' },
                    { key: 'D', text: '2x * e^(2x)' },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => !quizSubmitted && setQuizAnswer(opt.key)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between text-xs md:text-sm transition-all ${
                        quizSubmitted
                          ? opt.key === 'B'
                            ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold'
                            : quizAnswer === opt.key
                            ? 'border-rose-500 bg-rose-950/60 text-rose-300'
                            : 'border-slate-800 text-slate-500'
                          : quizAnswer === opt.key
                          ? 'border-emerald-500 bg-emerald-950/50 text-white font-semibold'
                          : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span><strong className="mr-2">{opt.key}.</strong> {opt.text}</span>
                      {quizSubmitted && opt.key === 'B' && (
                        <span className="text-xs text-emerald-400 font-bold">✓ Correct</span>
                      )}
                    </button>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Check Answer
                  </button>
                ) : (
                  <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800">
                    Verified: By the chain rule, d/dx [e^(u)] = e^(u) * du/dx. For u=2x, du/dx=2, giving 2e^(2x).
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Syllabus & Lesson List */}
        <aside className="w-full lg:w-80 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-400" />
              Course Syllabus
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {completedCount}/{allLessons.length} Done
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {course.modules.map((mod, mIdx) => (
              <div key={mod.id} className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {mod.title}
                </p>

                <div className="space-y-1.5">
                  {mod.lessons.map((lesson) => {
                    // find global index
                    const gIdx = allLessons.findIndex(l => l.id === lesson.id);
                    const isSelected = currentLessonIdx === gIdx;
                    const isDone = completedLessons[gIdx];

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonIdx(gIdx)}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all text-xs ${
                          isSelected
                            ? 'bg-emerald-950/70 border border-emerald-500/50 text-white font-semibold'
                            : 'hover:bg-slate-900 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isDone ? (
                            <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle size={15} className="text-slate-600 flex-shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 flex-shrink-0 ml-2">
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Certificate Generation Widget */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/50 to-slate-900 border border-gold/30 space-y-3">
            <div className="flex items-center gap-2 text-gold font-bold text-xs">
              <Award size={16} /> Official Certificate
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Complete all lessons to generate your verified certificate with the official Tibeb seal.
            </p>
            <Link
              href={`/courses/${course.id}/certificate`}
              className="block w-full py-2 px-3 rounded-xl bg-gold text-ink font-bold text-xs text-center hover:bg-amber-400 transition-colors shadow-md"
            >
              Generate Certificate →
            </Link>
          </div>
        </aside>
      </div>

      {/* Course Completion Celebration Modal */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-gold/40 text-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-5 text-gold animate-bounce">
              <Award size={40} />
            </div>

            <span className="bg-gold text-ink text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Course Completed! 🎓
            </span>

            <h3 className="text-2xl font-black mt-3 mb-2">
              Congratulations, {user?.name?.split(' ')[0] || 'Student'}!
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              You have completed all curriculum modules for <strong className="text-white">{course.title}</strong>. Your verified Tibeb Certificate of Completion is now ready!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/courses/${course.id}/certificate`}
                className="px-6 py-3 rounded-2xl bg-gold hover:bg-amber-400 text-ink font-black text-sm uppercase tracking-wider shadow-xl transition-all"
              >
                Claim Your Certificate Now →
              </Link>
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Review Lessons
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseLearningPlayer() {
  return (
    <AuthGuard reason="purchase" message="Sign in to access your enrolled course content and learning materials.">
      <CourseLearningContent />
    </AuthGuard>
  );
}
