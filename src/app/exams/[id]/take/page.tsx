'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, Bookmark, RotateCcw,
  Award, ShieldCheck, Sparkles, RefreshCw, FileText
} from 'lucide-react';
import { EXAMS, Question } from '@/lib/seed-data';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/ui/AuthGuard';

interface QuizAttemptRecord {
  attempts: number;
  lastScore: number;
  totalQuestions: number;
  missedQuestionIds: string[];
  lastCompletedAt: string;
}

function ExamTakeContent() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const examId = Array.isArray(params.id) ? params.id[0] : params.id;

  const exam = EXAMS.find(e => e.id === examId) || EXAMS[0];
  const rawQuestions = useMemo(() => exam.questions || [], [exam]);

  // Adaptive test questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAdaptive, setIsAdaptive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState((exam.duration_minutes || 45) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Initialize questions adaptively
  const initializeAdaptiveExam = () => {
    if (rawQuestions.length === 0) return;

    const shuffle = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    let previousMissed: string[] = [];
    try {
      const saved = localStorage.getItem(`tibeb_quiz_history_${exam.id}`);
      if (saved) {
        const parsed: QuizAttemptRecord = JSON.parse(saved);
        if (parsed.missedQuestionIds && parsed.missedQuestionIds.length > 0) {
          previousMissed = parsed.missedQuestionIds;
        }
      }
    } catch {
      // ignore
    }

    let prepared: Question[] = [];
    let adaptiveActive = false;

    if (previousMissed.length > 0) {
      adaptiveActive = true;
      const missed = rawQuestions.filter(q => previousMissed.includes(q.id));
      const others = rawQuestions.filter(q => !previousMissed.includes(q.id));

      prepared = [
        ...shuffle(missed),
        ...shuffle(others)
      ].map(q => ({
        ...q,
        options: shuffle(q.options)
      }));
    } else {
      prepared = shuffle(rawQuestions).map(q => ({
        ...q,
        options: shuffle(q.options)
      }));
    }

    setQuestions(prepared);
    setIsAdaptive(adaptiveActive);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setFlagged({});
    setSecondsRemaining((exam.duration_minutes || 45) * 60);
    setIsSubmitted(false);
    setShowConfirmModal(false);
  };

  useEffect(() => {
    initializeAdaptiveExam();
  }, [exam.id, rawQuestions]);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, questions]);

  const currentQ = questions[currentIdx] || rawQuestions[0];

  const handleSelectOption = (optKey: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optKey }));
  };

  const toggleFlag = () => {
    setFlagged(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setShowConfirmModal(false);

    // Calculate score & record missed IDs
    let score = 0;
    const missedIds: string[] = [];

    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_option) {
        score += 1;
      } else {
        missedIds.push(q.id);
      }
    });

    const newRecord: QuizAttemptRecord = {
      attempts: 1,
      lastScore: score,
      totalQuestions: questions.length,
      missedQuestionIds: missedIds,
      lastCompletedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(`tibeb_quiz_history_${exam.id}`, JSON.stringify(newRecord));
    } catch {
      // ignore
    }

    toast.success('Test submitted successfully! 🎉');
  };

  // Calculations
  const answeredCount = Object.keys(selectedAnswers).length;
  let score = 0;
  if (isSubmitted) {
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_option) score += 1;
    });
  }
  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // Time formatting
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-3xl shadow-card max-w-md">
          <p className="text-sm font-semibold text-gray-700">Loading questions from {exam.title}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Test Runner Header */}
      <header className="bg-ink text-white sticky top-0 z-40 px-4 py-3 shadow-md border-b border-white/10">
        <div className="container-tibeb flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/exams/${exam.id}`}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Exit Test"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm md:text-base text-white">{exam.title}</span>
                <span className="bg-gold text-ink text-[11px] font-black px-2 py-0.5 rounded-full">
                  20 ETB TEST
                </span>
              </div>
              <p className="text-xs text-white/60">
                {exam.university} • {exam.code} • {questions.length} Questions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Timer */}
            {!isSubmitted ? (
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                <Clock size={16} className={secondsRemaining < 300 ? 'text-red-400 animate-pulse' : 'text-gold'} />
                <span className={`font-mono text-sm font-bold ${secondsRemaining < 300 ? 'text-red-300' : 'text-white'}`}>
                  {timeFormatted}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 size={15} /> Completed
              </div>
            )}

            {!isSubmitted && (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-1.5 rounded-xl bg-green hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Adaptive Banner if active */}
      {isAdaptive && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 font-medium flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-amber-600" />
          <span>
            <strong>Adaptive Re-Test Active:</strong> Prioritizing your previously missed questions with freshly randomized option order.
          </span>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 container-tibeb px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left: Active Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-slate-200/80">
              
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-green text-white font-black text-sm flex items-center justify-center">
                    {currentIdx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Question {currentIdx + 1} of {questions.length}
                    </span>
                    {currentQ.topic && (
                      <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {currentQ.topic}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFlag}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      flagged[currentIdx]
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Bookmark size={13} fill={flagged[currentIdx] ? 'currentColor' : 'none'} />
                    {flagged[currentIdx] ? 'Flagged' : 'Flag Question'}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                  {currentQ.question_text}
                </h2>
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {currentQ.options.map(opt => {
                  const isSelected = selectedAnswers[currentIdx] === opt.key;
                  const isCorrect = opt.key === currentQ.correct_option;

                  let optStyle = 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50 text-slate-700';

                  if (isSubmitted) {
                    if (isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-sm';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                    } else {
                      optStyle = 'border-slate-100 opacity-60 text-slate-500';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold shadow-sm ring-2 ring-emerald-500/20';
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      disabled={isSubmitted}
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${optStyle}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="text-sm md:text-base leading-relaxed">{opt.text}</span>
                      </div>

                      {isSubmitted && (
                        <div>
                          {isCorrect && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                              <CheckCircle2 size={14} /> Correct
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-lg">
                              <XCircle size={14} /> Your Choice
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation when Submitted */}
              {isSubmitted && (
                <div className="mt-6 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                    <ShieldCheck size={18} className="text-emerald-600" />
                    Verified Tibeb Answer Explanation
                  </div>
                  <p className="text-slate-800 text-sm leading-relaxed">
                    {currentQ.explanation}
                  </p>
                  {currentQ.formula && (
                    <div className="mt-2 text-xs font-mono text-emerald-900 bg-white p-2 rounded-lg border border-emerald-100">
                      Rule: {currentQ.formula}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Nav Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                <button
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-ink text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : !isSubmitted ? (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-6 py-2.5 rounded-xl bg-green hover:bg-emerald-600 text-white text-xs font-bold transition shadow-md active:scale-95 cursor-pointer"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={initializeAdaptiveExam}
                    className="px-5 py-2.5 rounded-xl bg-green hover:bg-emerald-600 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Re-Take Adaptive Quiz
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Question Map & Progress Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Score Summary Box if Submitted */}
            {isSubmitted && (
              <div className="bg-white rounded-3xl p-6 shadow-card border border-emerald-200 text-center space-y-3">
                <div className="text-3xl font-black text-emerald-700">
                  {scorePercent}%
                </div>
                <div className="text-xs text-slate-500">
                  You scored <strong>{score}</strong> out of <strong>{questions.length}</strong> questions
                </div>
                <div className={`text-xs font-bold px-3 py-1.5 rounded-full inline-block ${
                  scorePercent >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {scorePercent >= 70 ? 'Passed with Distinction! 🎓' : 'Needs Review • Retry Adaptive Test'}
                </div>

                <button
                  onClick={initializeAdaptiveExam}
                  className="w-full py-2.5 px-4 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  Re-Take Test (Adapted)
                </button>
              </div>
            )}

            {/* Questions Grid Navigator */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
                <span>Question Navigator</span>
                <span className="text-xs text-slate-400 font-normal">
                  {answeredCount}/{questions.length} done
                </span>
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIdx;
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isFlag = flagged[idx];
                  const isCorrect = isSubmitted && selectedAnswers[idx] === q.correct_option;
                  const isWrong = isSubmitted && isAnswered && !isCorrect;

                  let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200';

                  if (isSubmitted) {
                    if (isCorrect) btnStyle = 'bg-emerald-500 text-white font-bold';
                    else if (isWrong) btnStyle = 'bg-rose-500 text-white font-bold';
                    else btnStyle = 'bg-slate-200 text-slate-400';
                  } else {
                    if (isCurrent) btnStyle = 'bg-ink text-white font-bold ring-2 ring-emerald-500 ring-offset-2';
                    else if (isFlag) btnStyle = 'bg-amber-100 text-amber-900 border border-amber-400 font-semibold';
                    else if (isAnswered) btnStyle = 'bg-emerald-100 text-emerald-900 font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-9 rounded-xl text-xs flex items-center justify-center relative transition-all cursor-pointer ${btnStyle}`}
                    >
                      {idx + 1}
                      {isFlag && !isSubmitted && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300" />
                  <span>Flagged</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-ink text-white text-[8px] flex items-center justify-center font-bold">●</span>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-100" />
                  <span>Unvisited</span>
                </div>
              </div>
            </div>

            {/* Back to paper link */}
            <Link
              href={`/exams/${exam.id}`}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center block text-xs font-bold text-green hover:underline shadow-sm"
            >
              <FileText size={14} className="inline mr-1" />
              View Original Scanned Exam Photos
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-black text-slate-900 mb-2">Ready to Submit?</h3>
            <p className="text-sm text-slate-600 mb-6">
              You have answered <span className="font-bold text-emerald-700">{answeredCount}</span> of{' '}
              <span className="font-bold text-slate-900">{questions.length}</span> questions.
              {answeredCount < questions.length && (
                <span className="block mt-2 text-amber-700 bg-amber-50 p-2.5 rounded-xl text-xs font-semibold">
                  ⚠️ Note: You still have {questions.length - answeredCount} unanswered questions!
                </span>
              )}
            </p>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2.5 rounded-xl bg-green hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExamTakePage() {
  return (
    <AuthGuard reason="purchase" message="You need to be signed in to take the exam in interactive test mode. Sign in or create a free account to start.">
      <ExamTakeContent />
    </AuthGuard>
  );
}
