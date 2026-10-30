'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  FileText, Star, ShoppingCart, BookOpen, Share2, Heart, ChevronRight, Zap, Award,
  ChevronLeft, Eye, EyeOff, RotateCcw, Check, X,
  Maximize2, Sparkles, RefreshCw, CheckCircle, Layers, Filter, Lock,
  MessageSquare, Send, ThumbsUp, ShieldCheck, Download, ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { StarRating } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { EXAMS, Question, type Exam } from '@/lib/seed-data';
import { generateWatermarkedExamPDF } from '@/lib/pdf-watermark';
import toast from 'react-hot-toast';

interface QuizAttemptRecord {
  attempts: number;
  lastScore: number;
  totalQuestions: number;
  missedQuestionIds: string[];
  lastCompletedAt: string;
}

interface TestReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export default function ExamDetailPage() {
  const params = useParams();
  const { t } = useLanguage();
  const { user, loading: authLoading, walletBalance, payWithWallet } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Scanned Image Viewer State (0-indexed)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Page Sync Mode: 'current_page' (default) or 'all'
  const [pageSyncMode, setPageSyncMode] = useState<'current_page' | 'all'>('current_page');

  // Question & Solution Viewer State
  const [showAllSolutions, setShowAllSolutions] = useState(true);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // Embedded Quiz Engine State
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isAdaptiveMode, setIsAdaptiveMode] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizAttemptRecord | null>(null);

  // 5-Star Reviews & Comments State
  const [reviewsList, setReviewsList] = useState<TestReview[]>([]);
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [customExam, setCustomExam] = useState<Exam | null>(null);

  const examId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    try {
      const customList: Exam[] = JSON.parse(localStorage.getItem('tibeb_custom_exams') || '[]');
      const found = customList.find((e) => e.id === examId);
      if (found) setCustomExam(found);
    } catch {}
  }, [examId]);

  const exam = (customExam || EXAMS.find(e => e.id === examId) || EXAMS[0]) as Exam;

  // Load quiz history and check purchase/unlock status & reviews from localStorage
  useEffect(() => {
    if (!exam) return;
    try {
      const stored = localStorage.getItem(`tibeb_quiz_history_${exam.id}`);
      if (stored) {
        setQuizHistory(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    try {
      const storedUnlocked = JSON.parse(localStorage.getItem('tibeb_unlocked_items') || '[]');
      const storedOrders = JSON.parse(localStorage.getItem('tibeb_orders') || '[]');
      const inOrders = storedOrders.some((o: any) =>
        o.id === exam.id ||
        (Array.isArray(o.items) && o.items.some((it: any) => it === exam.id || it?.id === exam.id || it?.title === exam.title))
      );
      if (storedUnlocked.includes(exam.id) || inOrders || exam.is_free_sample) {
        setIsUnlocked(true);
      }
    } catch {
      // fallback
    }

    try {
      const storedReviews = localStorage.getItem(`tibeb_reviews_${exam.id}`);
      if (storedReviews) {
        setReviewsList(JSON.parse(storedReviews));
      } else {
        // Starts completely clean from 0 reviews (no fake reviews)
        setReviewsList([]);
      }
    } catch {
      setReviewsList([]);
    }
  }, [exam]);

  const handleQuickUnlockWithWallet = () => {
    if (!exam) return;
    if (walletBalance < 20) {
      toast.error('Insufficient wallet balance (20 ETB required). Redirecting to checkout...');
      handleBuy();
      return;
    }
    const success = payWithWallet(20, [exam.id]);
    if (success) {
      setIsUnlocked(true);
      toast.success('Exam paper unlocked successfully! Scanned photos and solutions are now unblurred.');
    } else {
      toast.error('Payment with wallet failed. Please try again.');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam) return;
    if (!userComment.trim()) {
      toast.error('Please enter your review comment.');
      return;
    }
    const newRev: TestReview = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim() || user?.name || 'Verified Student',
      rating: userRating,
      comment: userComment.trim(),
      date: 'Just now',
      verified: true
    };
    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    try {
      localStorage.setItem(`tibeb_reviews_${exam.id}`, JSON.stringify(updated));
    } catch {}
    setUserComment('');
    toast.success(`Thank you! Your ${userRating}-star review was posted.`);
  };

  if (!exam) return notFound();

  const examQuestions = exam.questions || [];
  const examImages = exam.images && exam.images.length > 0 ? exam.images : ['/test-images/photo_2026-10-23_20-07-33.jpg'];

  const currentPageNumber = currentImageIndex + 1;

  // Filter questions for current page, or fallback to all if in 'all' mode
  const displayedQuestions = pageSyncMode === 'current_page'
    ? examQuestions.filter(q => (q.page_number || 1) === currentPageNumber)
    : examQuestions;

  // If current page has no assigned questions, fallback to all questions
  const finalQuestions = displayedQuestions.length > 0 ? displayedQuestions : examQuestions;

  const changePage = (newIndex: number) => {
    setCurrentImageIndex(newIndex);
    // Smooth scroll down slightly to solutions if desired, or keep view aligned
  };

  const toggleSolution = (qId: string) => {
    setRevealedSolutions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Start Adaptive Quiz
  const startQuiz = (isRetry = false) => {
    if (examQuestions.length === 0) {
      toast.error('No quiz questions configured for this exam.');
      return;
    }

    const shuffleArray = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    let prepared: Question[] = [];
    let adaptiveActive = false;

    const previousMissed = quizHistory?.missedQuestionIds || [];

    if (previousMissed.length > 0) {
      adaptiveActive = true;
      const missed = examQuestions.filter(q => previousMissed.includes(q.id));
      const others = examQuestions.filter(q => !previousMissed.includes(q.id));

      prepared = [
        ...shuffleArray(missed),
        ...shuffleArray(others),
      ].map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));

      toast.success('Adaptive Mode: Weak spots prioritized with shuffled order!', { duration: 4000 });
    } else {
      prepared = shuffleArray(examQuestions).map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
    }

    setActiveQuestions(prepared);
    setIsAdaptiveMode(adaptiveActive);
    setUserAnswers({});
    setCurrentQuizQuestionIndex(0);
    setQuizSubmitted(false);
    setQuizActive(true);

    setTimeout(() => {
      document.getElementById('interactive-quiz-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectOption = (questionId: string, optionKey: string) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(userAnswers).length === 0) {
      toast.error('Please answer at least one question before submitting!');
      return;
    }

    let correctCount = 0;
    const missedIds: string[] = [];

    activeQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correct_option) {
        correctCount++;
      } else {
        missedIds.push(q.id);
      }
    });

    const scorePercent = Math.round((correctCount / activeQuestions.length) * 100);

    const newRecord: QuizAttemptRecord = {
      attempts: (quizHistory?.attempts || 0) + 1,
      lastScore: correctCount,
      totalQuestions: activeQuestions.length,
      missedQuestionIds: missedIds,
      lastCompletedAt: new Date().toISOString()
    };

    setQuizHistory(newRecord);
    try {
      localStorage.setItem(`tibeb_quiz_history_${exam.id}`, JSON.stringify(newRecord));
    } catch {
      // ignore
    }

    setQuizSubmitted(true);

    if (scorePercent >= 70) {
      toast.success(`Outstanding! You scored ${scorePercent}% (${correctCount}/${activeQuestions.length})`);
    } else {
      toast.error(`Score: ${scorePercent}% (${correctCount}/${activeQuestions.length}). Retry with our Adaptive Test to master missed questions!`);
    }
  };

  const handleBuy = () => {
    if (!user) {
      toast.error('Please sign in or create an account to buy this exam.');
      window.location.href = `/login?return=${encodeURIComponent(`/checkout?item=${exam.id}&type=exam`)}`;
      return;
    }
    window.location.href = `/checkout?item=${exam.id}&type=exam`;
  };

  const handleWishlist = () => {
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6EC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0B5D3B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF6EC] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100 text-center max-w-lg mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-gold mx-auto flex items-center justify-center border border-amber-200 shadow-sm">
            <Lock size={32} className="text-gold" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#0B5D3B] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Student Authentication Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              Sign In to Access Exam Test
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Certified university past exam papers, verified step-by-step solutions, and interactive quizzes require an authenticated account. Please sign in or register to view and purchase this test.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              href={`/signup?redirect=/exams/${examId}`}
              className="px-6 py-3.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
            >
              Sign Up to Access <ArrowRight size={16} />
            </Link>
            <Link
              href={`/login?redirect=/exams/${examId}`}
              className="px-6 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-ink font-bold text-sm transition-all text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-tibeb px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-green transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/catalog" className="hover:text-green transition-colors">Catalog</Link>
            <ChevronRight size={12} />
            <span className="text-ink font-medium truncate">{exam.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-tibeb px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ---- Left: Main content ---- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="badge-gray badge font-bold text-xs">{exam.university}</span>
                <span className="badge-gold badge font-bold text-xs">{exam.exam_type} Exam</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified 20 ETB Exam
                </span>
                <span className="badge-gray badge text-xs">{exam.year}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-ink mb-2">{exam.title}</h1>
              <p className="text-gray-500 text-sm mb-4">
                Course Code: <strong className="text-ink">{exam.code}</strong> • {exam.department} • Semester {exam.semester}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-5">
                <StarRating rating={exam.rating} reviews={exam.reviews} />
                <span className="text-xs text-gray-400">
                  {exam.purchases.toLocaleString()} students practiced
                </span>
                {isUnlocked && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1.5 border border-emerald-300">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    Unlocked & Verified (Full Access)
                  </span>
                )}
              </div>

              {/* What is this test about & What year card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 border border-emerald-200/80 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <BookOpen size={15} className="text-emerald-700" />
                    What is this test about?
                  </span>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-gold/20 text-gold-dark border border-gold/40">
                    Year: {exam.year}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  {exam.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-emerald-200/60 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Course Code</span>
                    <strong className="text-ink font-bold">{exam.code}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Academic Year</span>
                    <strong className="text-emerald-800 font-bold">{exam.year}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Semester</span>
                    <strong className="text-ink font-bold">Semester {exam.semester}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Examination Type</span>
                    <strong className="text-ink font-bold">{exam.exam_type} Exam</strong>
                  </div>
                </div>
              </div>

              {/* Action Banner to Quiz Yourself */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-ink text-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-600" />
                    Adaptive Practice Quiz Available
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Tests exclusively on this exam paper. Adapts and shuffles when you retry!
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      generateWatermarkedExamPDF({ exam, student: user });
                      toast.success('Generated official watermarked exam PDF! 📄');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-ink hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <Download size={14} className="text-gold" />
                    Watermarked PDF
                  </button>
                  <button
                    onClick={() => startQuiz(false)}
                    className="px-5 py-2.5 rounded-xl bg-green hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <Zap size={14} className="text-gold fill-current" />
                    Quiz Yourself Now
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================
                SECTION 1: ORIGINAL TEST PAPER VIEWER (THE REAL PHOTOS)
               ======================================================== */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-green" size={20} />
                    <h2 className="font-bold text-ink text-lg">Original Test Paper (Page {currentPageNumber})</h2>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Genuine examination paper from {exam.university}. Questions below sync automatically to this page!
                  </p>
                </div>

                {/* Page Navigation Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Page {currentPageNumber} of {examImages.length}
                  </span>
                  <button
                    onClick={() => changePage(Math.max(0, currentImageIndex - 1))}
                    disabled={currentImageIndex === 0}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => changePage(Math.min(examImages.length - 1, currentImageIndex + 1))}
                    disabled={currentImageIndex === examImages.length - 1}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Main Photo Display */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-gray-200 flex items-center justify-center min-h-[440px] max-h-[620px] group shadow-inner">
                {/* Image (Blurred if !isUnlocked) */}
                <img
                  src={examImages[currentImageIndex]}
                  alt={`${exam.title} - Page ${currentPageNumber}`}
                  className={`w-full h-auto max-h-[620px] object-contain transition-all duration-300 ${
                    isUnlocked
                      ? 'cursor-zoom-in hover:scale-[1.01]'
                      : 'filter blur-2xl select-none pointer-events-none opacity-40 scale-105'
                  }`}
                  onClick={() => {
                    if (isUnlocked) setFullscreenImage(examImages[currentImageIndex]);
                  }}
                />

                {/* Locked Blur Overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-ink/75 backdrop-blur-md flex items-center justify-center p-6 text-center z-10">
                    <div className="max-w-md bg-white/10 border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl text-white space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/40 text-gold flex items-center justify-center mx-auto shadow-inner">
                        <Lock size={28} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gold px-2.5 py-0.5 rounded-full bg-gold/20 border border-gold/30">
                          Exam Paper Locked
                        </span>
                        <h3 className="text-xl font-black mt-2">Unlock Scanned Exam Paper</h3>
                        <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
                          Original high-resolution question sheets from {exam.university} and full step-by-step verified answer keys are locked. Unlock lifetime access for only <strong className="text-gold">20 ETB</strong>.
                        </p>
                      </div>

                      <div className="space-y-2 pt-2">
                        {walletBalance >= 20 ? (
                          <button
                            onClick={handleQuickUnlockWithWallet}
                            className="w-full py-3.5 px-4 rounded-xl bg-gold hover:bg-gold-light text-ink font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                          >
                            <Zap size={15} className="fill-ink" />
                            1-Click Unlock with Wallet (20 ETB)
                          </button>
                        ) : (
                          <button
                            onClick={handleBuy}
                            className="w-full py-3.5 px-4 rounded-xl bg-green hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                          >
                            <ShoppingCart size={15} />
                            Unlock Now (20 ETB) via Telebirr / CBE
                          </button>
                        )}
                        <span className="text-[11px] text-white/60 block">
                          Instant access to all {examImages.length} pages & solutions
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Click to Enlarge Floating Button (Only when Unlocked) */}
                {isUnlocked && (
                  <button
                    onClick={() => setFullscreenImage(examImages[currentImageIndex])}
                    className="absolute bottom-4 right-4 bg-ink/80 hover:bg-ink text-white px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition shadow-lg opacity-90 group-hover:opacity-100 cursor-pointer"
                  >
                    <Maximize2 size={13} /> Click to Enlarge
                  </button>
                )}
              </div>

              {/* Page Thumbnails Bar */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                {examImages.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    onClick={() => changePage(idx)}
                    className={`relative flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      currentImageIndex === idx
                        ? 'border-green ring-2 ring-green/20 scale-105'
                        : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`w-full h-full object-cover ${!isUnlocked ? 'filter blur-sm' : ''}`}
                    />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      P.{idx + 1}
                    </span>
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Lock size={12} className="text-gold" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ========================================================
                SECTION 2: QUESTION, ANSWER & EXPLANATIONS (SYNCED BY PAGE)
               ======================================================== */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <BookOpen className="text-green" size={20} />
                    <h2 className="font-bold text-ink text-lg">
                      Questions & Verified Solutions
                    </h2>
                    <span className="bg-green text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Page {currentPageNumber} Only
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Showing <strong>{finalQuestions.length} questions</strong> that appear on <strong>Page {currentPageNumber}</strong> of the paper above.
                  </p>
                </div>

                {/* Controls: Mode Switcher & Solution Toggle */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* View Mode Toggle */}
                  <button
                    onClick={() => setPageSyncMode(pageSyncMode === 'current_page' ? 'all' : 'current_page')}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition cursor-pointer"
                    title={pageSyncMode === 'current_page' ? 'View all questions at once' : 'Only view questions for current page'}
                  >
                    <Filter size={13} className="text-green" />
                    {pageSyncMode === 'current_page' ? 'View All Pages' : `Filter to Page ${currentPageNumber}`}
                  </button>

                  {/* Master Reveal Toggle */}
                  <button
                    onClick={() => setShowAllSolutions(!showAllSolutions)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition cursor-pointer"
                  >
                    {showAllSolutions ? (
                      <>
                        <EyeOff size={13} className="text-gray-500" />
                        Self-Study
                      </>
                    ) : (
                      <>
                        <Eye size={13} className="text-green" />
                        Show Answers
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* List of Questions with Numbers and Explanations for CURRENT PAGE */}
              <div className="space-y-6">
                {finalQuestions.map((q) => {
                  const isSolutionVisible = showAllSolutions || revealedSolutions[q.id];

                  return (
                    <div
                      key={q.id}
                      className="p-5 md:p-6 rounded-2xl bg-stone-50/70 border border-gray-200 hover:border-gray-300 transition-all space-y-4"
                    >
                      {/* Top Bar: Question Number & Topic */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-green text-white font-black text-sm flex items-center justify-center shadow-sm">
                            #{q.question_number}
                          </span>
                          <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                            Page {q.page_number || currentPageNumber}
                          </span>
                          {q.topic && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800">
                              {q.topic}
                            </span>
                          )}
                        </div>

                        {/* Individual Toggle if master is closed */}
                        {!showAllSolutions && (
                          <button
                            onClick={() => toggleSolution(q.id)}
                            className="text-xs font-bold text-green hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {isSolutionVisible ? 'Hide Answer' : 'Reveal Answer'}
                          </button>
                        )}
                      </div>

                      {/* Question Text */}
                      <p className="text-base font-bold text-ink leading-relaxed">
                        {q.question_text}
                      </p>

                      {/* Options List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map(opt => {
                          const isCorrect = isSolutionVisible && opt.key === q.correct_option;
                          return (
                            <div
                              key={opt.key}
                              className={`p-3 rounded-xl border text-xs md:text-sm flex items-center gap-3 transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-300'
                                  : 'bg-white border-gray-200 text-gray-700'
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {opt.key}
                              </span>
                              <span>{opt.text}</span>
                              {isCorrect && (
                                <Check size={16} className="text-emerald-600 ml-auto flex-shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Answer & Explanation Box */}
                      {isSolutionVisible ? (
                        <div className="p-4 rounded-xl bg-white border border-emerald-200/80 shadow-sm space-y-2 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              Verified Answer: Option ({q.correct_option})
                            </span>
                          </div>

                          <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                            <strong className="text-ink">Explanation: </strong>
                            {q.explanation}
                          </p>

                          {q.formula && (
                            <div className="mt-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs font-mono text-emerald-800">
                              <span className="text-gray-400 font-sans block text-[10px] uppercase font-bold mb-0.5">Academic Formula / Rule:</span>
                              {q.formula}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          onClick={() => toggleSolution(q.id)}
                          className="p-3 rounded-xl bg-gray-100/70 border border-dashed border-gray-300 text-center cursor-pointer hover:bg-gray-100 transition"
                        >
                          <span className="text-xs font-semibold text-gray-500 flex items-center justify-center gap-1.5">
                            <Eye size={13} /> Click to reveal verified answer & explanation
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Synchronized Page Switcher Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => changePage(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex === 0}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft size={15} />
                  Previous Page ({Math.max(1, currentPageNumber - 1)})
                </button>

                <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                  Page {currentPageNumber} of {examImages.length}
                </span>

                <button
                  onClick={() => changePage(Math.min(examImages.length - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex === examImages.length - 1}
                  className="px-4 py-2 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Next Page ({Math.min(examImages.length, currentPageNumber + 1)})
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* ========================================================
                SECTION 3: ON-PAGE ADAPTIVE QUIZ YOURSELF ENGINE
               ======================================================== */}
            <div id="interactive-quiz-section" className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="text-amber-500 fill-amber-500" size={20} />
                    <h2 className="font-bold text-ink text-lg">Quiz Yourself On This Exam</h2>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Practice with instant scoring. If you score low, coming back shuffles and prioritizes your mistakes!
                  </p>
                </div>

                {quizHistory && (
                  <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200/70 px-3 py-1.5 rounded-xl font-medium">
                    Past Attempt: {quizHistory.lastScore}/{quizHistory.totalQuestions} ({Math.round((quizHistory.lastScore / quizHistory.totalQuestions) * 100)}%)
                  </div>
                )}
              </div>

              {!quizActive ? (
                <div className="text-center py-10 px-4 rounded-2xl bg-gradient-to-b from-stone-50 to-white border border-gray-200 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-green/10 text-green flex items-center justify-center mx-auto shadow-sm">
                    <Award size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-ink text-lg">Test Your Knowledge Right Here</h3>
                    <p className="text-xs md:text-sm text-gray-500 max-w-md mx-auto mt-1.5 leading-relaxed">
                      Questions are taken strictly from this {exam.title} paper.
                      Our adaptive engine detects any questions you miss and randomizes them on your next try.
                    </p>
                  </div>

                  {quizHistory && quizHistory.missedQuestionIds.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 max-w-md mx-auto text-xs text-amber-800 text-left">
                      <strong>Adaptive Feedback:</strong> You have {quizHistory.missedQuestionIds.length} missed question(s) from your previous attempt. Starting the quiz will test your weak spots first!
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => startQuiz(false)}
                      className="px-6 py-3 rounded-xl bg-green hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-green/20 transition-all active:scale-95 cursor-pointer"
                    >
                      <Zap size={15} className="text-gold fill-current" />
                      {quizHistory ? 'Re-Take Adaptive Quiz' : 'Start Practice Quiz (10 Questions)'}
                    </button>
                    <Link
                      href={`/exams/${exam.id}/take`}
                      className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-ink font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Maximize2 size={14} />
                      Full Screen Exam Mode
                    </Link>
                  </div>
                </div>
              ) : (
                /* Active Quiz Interface */
                <div className="space-y-6">
                  {/* Adaptive Header Notice */}
                  {isAdaptiveMode && (
                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2.5 text-xs text-blue-900 font-medium">
                      <RefreshCw size={15} className="text-blue-600 flex-shrink-0 animate-spin" />
                      <span>
                        <strong>Smart Adaptive Test Active:</strong> Questions and options are shuffled, with your previous mistakes placed first to guarantee true retention!
                      </span>
                    </div>
                  )}

                  {/* Progress & Question Index Nav */}
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                    <span>
                      Question {currentQuizQuestionIndex + 1} of {activeQuestions.length}
                    </span>
                    <span>
                      Answered: {Object.keys(userAnswers).length}/{activeQuestions.length}
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green h-full transition-all duration-300"
                      style={{
                        width: `${((currentQuizQuestionIndex + 1) / activeQuestions.length) * 100}%`
                      }}
                    />
                  </div>

                  {/* Question Dots */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeQuestions.map((q, idx) => {
                      const isAnswered = !!userAnswers[q.id];
                      const isCurrent = idx === currentQuizQuestionIndex;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuizQuestionIndex(idx)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-ink text-white ring-2 ring-ink/30 scale-110'
                              : isAnswered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Current Active Question Card */}
                  {activeQuestions[currentQuizQuestionIndex] && (
                    <div className="p-6 rounded-2xl bg-stone-50 border border-gray-200 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-green text-white px-2 py-0.5 rounded">
                          Q{currentQuizQuestionIndex + 1}
                        </span>
                        {activeQuestions[currentQuizQuestionIndex].topic && (
                          <span className="text-xs text-gray-500 font-medium">
                            {activeQuestions[currentQuizQuestionIndex].topic}
                          </span>
                        )}
                      </div>

                      <p className="text-base md:text-lg font-bold text-ink">
                        {activeQuestions[currentQuizQuestionIndex].question_text}
                      </p>

                      {/* Options */}
                      <div className="space-y-2.5 pt-2">
                        {activeQuestions[currentQuizQuestionIndex].options.map(opt => {
                          const isSelected = userAnswers[activeQuestions[currentQuizQuestionIndex].id] === opt.key;
                          const isCorrect = opt.key === activeQuestions[currentQuizQuestionIndex].correct_option;
                          const showFeedback = quizSubmitted;

                          let optionStyles = 'bg-white border-gray-200 hover:border-gray-300 text-gray-700';

                          if (showFeedback) {
                            if (isCorrect) {
                              optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                            } else if (isSelected && !isCorrect) {
                              optionStyles = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
                            }
                          } else if (isSelected) {
                            optionStyles = 'bg-emerald-50 border-green text-green font-bold ring-2 ring-green/20';
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={quizSubmitted}
                              onClick={() => handleSelectOption(activeQuestions[currentQuizQuestionIndex].id, opt.key)}
                              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between text-xs md:text-sm transition-all cursor-pointer ${optionStyles}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${
                                  isSelected ? 'bg-green text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {opt.key}
                                </span>
                                <span>{opt.text}</span>
                              </div>

                              {showFeedback && (
                                isCorrect ? (
                                  <Check size={16} className="text-emerald-600 flex-shrink-0" />
                                ) : isSelected ? (
                                  <X size={16} className="text-rose-600 flex-shrink-0" />
                                ) : null
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Post-submission explanation */}
                      {quizSubmitted && (
                        <div className="p-4 rounded-xl bg-white border border-gray-200 text-xs text-gray-700 space-y-1">
                          <p className="font-bold text-ink">
                            Correct Answer: Option ({activeQuestions[currentQuizQuestionIndex].correct_option})
                          </p>
                          <p>{activeQuestions[currentQuizQuestionIndex].explanation}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation & Submit Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setCurrentQuizQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuizQuestionIndex === 0}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      ← Previous
                    </button>

                    {!quizSubmitted ? (
                      currentQuizQuestionIndex === activeQuestions.length - 1 ? (
                        <button
                          onClick={handleSubmitQuiz}
                          className="px-5 py-2.5 rounded-xl bg-green hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          Submit Test & See Score
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentQuizQuestionIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                          className="px-4 py-2 rounded-xl bg-ink text-white text-xs font-semibold hover:bg-gray-800 transition cursor-pointer"
                        >
                          Next →
                        </button>
                      )
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startQuiz(true)}
                          className="px-4 py-2 rounded-xl bg-green text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw size={13} />
                          Re-Take (Adapted & Shuffled)
                        </button>
                        <button
                          onClick={() => setQuizActive(false)}
                          className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 cursor-pointer"
                        >
                          Close Quiz
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Verified Student 5-Star Reviews & Comment Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="font-bold text-ink text-xl flex items-center gap-2">
                    <MessageSquare className="text-green" size={20} />
                    Student Reviews & 5-Star Ratings
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Authentic feedback from Ethiopian university students who practiced this exam
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                  <div className="flex items-center text-gold">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={15} className="fill-current text-gold" />
                    ))}
                  </div>
                  <span className="font-black text-ink text-sm">4.9 / 5</span>
                  <span className="text-xs text-gray-500 font-medium">({reviewsList.length + exam.reviews} reviews)</span>
                </div>
              </div>

              {/* Leave a Review Form */}
              <form onSubmit={handleReviewSubmit} className="mb-8 p-5 rounded-2xl bg-slate-50 border border-gray-200 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-green block">
                  Write a Review & Rate this Test
                </span>

                {/* 5-Star Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Your Rating (Tap to select 1 to 5 Stars):
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating || userRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setUserRating(star)}
                          className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                          title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            size={26}
                            className={`transition-colors ${
                              isFilled ? 'text-gold fill-gold' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-bold text-ink ml-2 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                      {userRating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Reviewer Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Your Name (optional):
                  </label>
                  <input
                    type="text"
                    placeholder={user?.name || "e.g. Dawit Mengistu (AAU Fresh)"}
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green"
                  />
                </div>

                {/* Comment Box */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Your Comment & Feedback on this Exam:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share how this paper helped you, tips for question types, or feedback on answer explanations..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-green hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Send size={13} />
                  Submit 5-Star Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((review) => (
                  <div key={review.id} className="p-4 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green to-emerald-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-ink">{review.name}</span>
                            {review.verified && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <Check size={10} className="text-emerald-600" /> Verified Student
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400">{review.date}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-gold">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={s <= review.rating ? 'fill-gold text-gold' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed pl-10">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---- Right: Sticky purchase card (Desktop Only Sticky) ---- */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                {/* Price Display */}
                <div className="mb-5">
                  <span className="text-xs uppercase tracking-wider font-bold text-gray-400 block mb-1">
                    Student Standard Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-green">
                      20 ETB
                    </span>
                  </div>
                  {isUnlocked && (
                    <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                      <span>You have unlocked this test paper!</span>
                    </div>
                  )}
                </div>

                {/* Primary Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => startQuiz(false)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-green hover:bg-emerald-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-green/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <Zap size={18} className="text-gold fill-current" />
                    Quiz Yourself on this Exam
                  </button>

                  {!isUnlocked ? (
                    walletBalance >= 20 ? (
                      <button
                        onClick={handleQuickUnlockWithWallet}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gold hover:bg-gold-light text-ink font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <Zap size={15} className="fill-ink" />
                        1-Click Unlock with Wallet (20 ETB)
                      </button>
                    ) : (
                      <Button
                        variant="outline"
                        size="lg"
                        fullWidth
                        onClick={handleBuy}
                      >
                        <ShoppingCart size={16} />
                        Buy PDF Paper & Solutions (20 ETB)
                      </Button>
                    )
                  ) : (
                    <Link
                      href="/dashboard/orders"
                      className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-ink font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <FileText size={15} className="text-green" />
                      View Official Electronic Bill
                    </Link>
                  )}
                </div>

                {/* Wishlist */}
                <button
                  onClick={handleWishlist}
                  className={`w-full flex items-center justify-center gap-2 mt-4 py-2 text-sm transition-colors cursor-pointer ${
                    wishlisted ? 'text-red-tibeb font-semibold' : 'text-gray-400 hover:text-red-tibeb'
                  }`}
                >
                  <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
                  {wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
                </button>

                {/* What's included checklist */}
                <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5">
                  {[
                    'Actual scanned exam papers from campus',
                    'Full verified answer keys & step explanations',
                    'Interactive practice quiz with adaptive retry',
                    'Pay via Telebirr, CBE Birr or Chapa (20 ETB)',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle size={14} className="text-green flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Share */}
                <button
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-green mt-5 pt-3 border-t border-gray-100 transition-colors w-full justify-center cursor-pointer"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }}
                >
                  <Share2 size={13} />
                  Share with classmates
                </button>
              </div>

              {/* Quick Jump Widget */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-gray-200 text-xs text-gray-600 space-y-2">
                <span className="font-bold text-ink block">Exam Navigation</span>
                <p>
                  Contains <strong>{examImages.length} original photos</strong> and <strong>{examQuestions.length} verified questions</strong>.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      document.getElementById('interactive-quiz-section')?.scrollIntoView({ behavior: 'smooth' });
                      startQuiz(false);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-white border border-gray-200 text-center font-bold text-green hover:bg-green hover:text-white transition cursor-pointer"
                  >
                    Take Quiz
                  </button>
                  <Link
                    href={`/exams/${exam.id}/take`}
                    className="flex-1 py-1.5 rounded-lg bg-white border border-gray-200 text-center font-bold text-ink hover:bg-ink hover:text-white transition"
                  >
                    Full Screen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-5xl max-h-[92vh] w-full flex items-center justify-center">
            <img
              src={fullscreenImage}
              alt="Fullscreen Exam Paper"
              className="max-h-[90vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-2 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
