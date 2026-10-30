'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Trophy, Award, Zap, BookOpen, Clock, CheckCircle2,
  AlertCircle, ChevronRight, Sparkles, Flame, Star,
  TrendingUp, RefreshCw, ArrowRight, Shield, Play,
  HelpCircle, User, Check, X, RotateCcw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  COURSE_COMPETITION_QUIZZES,
  COMPETITION_TEST_FEE,
  getStudentPersonalizedChallenges,
  MONTHLY_PRIZES,
  POINT_REWARDS,
  getLeaderboardData,
  awardStudentPoints,
  getStudentPoints,
  CourseQuizChallenge,
  StudentLeaderboardEntry
} from '@/lib/competition-store';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function CompetitionLeaderboardPage() {
  const { user, walletBalance, payWithWallet } = useAuth();
  const [challenges, setChallenges] = useState<CourseQuizChallenge[]>([]);
  const [pendingQuizToPay, setPendingQuizToPay] = useState<CourseQuizChallenge | null>(null);

  useEffect(() => {
    setChallenges(getStudentPersonalizedChallenges(user?.id));
  }, [user?.id]);

  // Active sub-view: 'leaderboard' or 'quiz'
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'quiz'>('leaderboard');
  
  // Real-time live date display
  const [currentDateTime, setCurrentDateTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Leaderboard data state
  const [leaderboardData, setLeaderboardData] = useState(() =>
    getLeaderboardData(user ? {
      id: user.id,
      name: user.name,
      university: user.university_id?.toUpperCase() || 'AAU',
      department: user.department || 'Computer Science',
      avatar_url: user.avatar_url
    } : null)
  );

  const refreshLeaderboard = () => {
    const fresh = getLeaderboardData(user ? {
      id: user.id,
      name: user.name,
      university: user.university_id?.toUpperCase() || 'AAU',
      department: user.department || 'Computer Science',
      avatar_url: user.avatar_url
    } : null);
    setLeaderboardData(fresh);
  };

  // Listen to point updates across tabs
  useEffect(() => {
    refreshLeaderboard();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'tibeb_student_points' || e.key === 'tibeb_competition_leaderboard_v3' || e.key === 'tibeb_competition_leaderboard') {
        refreshLeaderboard();
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('tibeb_student_points_updated', refreshLeaderboard);
    window.addEventListener('tibeb_competition_leaderboard_updated', refreshLeaderboard);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('tibeb_student_points_updated', refreshLeaderboard);
      window.removeEventListener('tibeb_competition_leaderboard_updated', refreshLeaderboard);
    };
  }, [user]);

  // Quiz Player State
  const [selectedQuiz, setSelectedQuiz] = useState<CourseQuizChallenge | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number; pointsEarned: number } | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(180);

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;
    if (secondsRemaining <= 0) {
      handleAutoSubmitQuiz();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, quizSubmitted, secondsRemaining]);

  const handleStartQuiz = (quiz: CourseQuizChallenge) => {
    setSelectedQuiz(quiz);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setSecondsRemaining(quiz.timeSeconds || 180);
    setActiveTab('quiz');
  };

  const handleRequestStartQuiz = (quiz: CourseQuizChallenge) => {
    if (!user) {
      toast.error('Please sign in or create an account to enter the competition test.');
      return;
    }
    if (walletBalance < COMPETITION_TEST_FEE) {
      toast.error(`Competition Test entry requires 5 ETB. Your balance is ${walletBalance} ETB. Please deposit 20 ETB.`);
      return;
    }
    setPendingQuizToPay(quiz);
  };

  const handlePayAndEnter = () => {
    if (!pendingQuizToPay) return;
    if (walletBalance < COMPETITION_TEST_FEE) {
      toast.error('Insufficient wallet balance. 5 ETB required.');
      return;
    }

    const success = payWithWallet(COMPETITION_TEST_FEE, [pendingQuizToPay.id]);
    if (success) {
      // Record verification / order for Admin Total Sales (+5 ETB)
      try {
        const orderId = `ORD-CMP-${Date.now().toString().slice(-6)}`;
        const orders = JSON.parse(localStorage.getItem('tibeb_orders') || '[]');
        orders.unshift({
          id: orderId,
          date: new Date().toISOString().split('T')[0],
          items: [`Competition Test Entry: ${pendingQuizToPay.courseTitle}`],
          total: COMPETITION_TEST_FEE,
          status: 'Paid',
          paymentMethod: 'Student Wallet',
          reference: orderId,
        });
        localStorage.setItem('tibeb_orders', JSON.stringify(orders));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('tibeb_verifications_updated'));
      } catch {}

      toast.success('🎉 5 ETB Entry Fee Paid! Your unique randomized challenge has started.', { duration: 4000 });
      const q = pendingQuizToPay;
      setPendingQuizToPay(null);
      handleStartQuiz(q);
    } else {
      toast.error('Payment failed. Please verify your wallet balance.');
    }
  };

  const handleSelectOption = (questionId: string, optionKey: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const handleAutoSubmitQuiz = () => {
    if (!selectedQuiz || quizSubmitted) return;
    submitQuizAnswers();
  };

  const submitQuizAnswers = () => {
    if (!selectedQuiz) return;
    let correctCount = 0;
    selectedQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOption) {
        correctCount += 1;
      }
    });

    const isPerfect = correctCount === selectedQuiz.questions.length;
    let points = correctCount * POINT_REWARDS.QUIZ_CORRECT_ANSWER;
    if (isPerfect) {
      points += POINT_REWARDS.QUIZ_PERFECT_BONUS;
    }

    setQuizScore({
      correct: correctCount,
      total: selectedQuiz.questions.length,
      pointsEarned: points
    });
    setQuizSubmitted(true);

    if (user && points > 0) {
      awardStudentPoints(user.id, user.name, points, 'quiz', {
        university: user.university_id?.toUpperCase() || 'AAU',
        department: user.department || 'Science'
      });
      refreshLeaderboard();
      toast.success(`🎉 Quiz Completed! You earned +${points} Competition Points!`, { duration: 5000 });
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const { top20, currentUserEntry, userRank, isUserInTop20, pointsToTop20, seasonMonth } = leaderboardData;

  return (
    <div className="space-y-6 pb-16">
      
      {/* =========================================================================
          HERO & MONTHLY CASH PRIZES BANNER
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#083D28] via-[#0B5D3B] to-[#12202B] text-white p-6 sm:p-8 shadow-xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-xs font-black uppercase tracking-wider">
                <Trophy size={14} className="text-gold" />
                Monthly Student Competition
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-sm">
                <Clock size={13} />
                {currentDateTime || 'Real-Time Active Season'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Test Your Course Knowledge & Win Real Cash!
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Compete against top university students from AAU, ASTU, Unity, Hawassa & Jimma. Solve university course quizzes, unlock exam papers, and secure the podium to claim monthly cash rewards!
            </p>
          </div>

          {/* Quick Score Capsule */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-black text-xl">
              <Star size={24} className="fill-gold text-gold" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">Your Current Points</p>
              <p className="text-2xl font-black text-white">{currentUserEntry.points} <span className="text-xs text-gold font-bold">PTS</span></p>
              <p className="text-[11px] text-emerald-100">
                {isUserInTop20 ? `Ranked #${userRank} in Top 20 🏆` : `Rank #${userRank} (${pointsToTop20} pts to Top 20)`}
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TOP 3 MONTHLY CASH PRIZES PODIUM (1k, 600, 300 ETB)
           ========================================================================= */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* 1st Place: 1,000 ETB */}
          <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-950/40 border border-gold/50 p-4 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🥇</span>
              <span className="px-2.5 py-0.5 rounded-full bg-gold text-[#12202B] text-[11px] font-black uppercase tracking-wider">
                1st Place
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gold">1,000 ETB</p>
            <p className="text-xs font-bold text-white mt-1">Cash Prize Every Month</p>
            <p className="text-[11px] text-amber-200/80 mt-0.5">Direct Telebirr / CBE payout</p>
          </div>

          {/* 2nd Place: 600 ETB */}
          <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-b from-slate-400/20 to-slate-900/40 border border-slate-300/40 p-4 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🥈</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-[#12202B] text-[11px] font-black uppercase tracking-wider">
                2nd Place
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-100">600 ETB</p>
            <p className="text-xs font-bold text-white mt-1">Cash Prize Every Month</p>
            <p className="text-[11px] text-slate-300/80 mt-0.5">Direct Telebirr / CBE payout</p>
          </div>

          {/* 3rd Place: 300 ETB */}
          <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-b from-amber-700/20 to-stone-900/40 border border-amber-600/40 p-4 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🥉</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-600/80 text-white text-[11px] font-black uppercase tracking-wider">
                3rd Place
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-300">300 ETB</p>
            <p className="text-xs font-bold text-white mt-1">Cash Prize Every Month</p>
            <p className="text-[11px] text-amber-200/80 mt-0.5">Direct Telebirr / CBE payout</p>
          </div>

        </div>
      </div>

      {/* =========================================================================
          POINT MULTIPLIER RULES & FAST TRACK
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center font-black">
            <BookOpen size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-ink">Course Quizzes</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">+100 PTS</span>
            </div>
            <p className="text-[11px] text-gray-500 truncate">Calculus, Data Structures, Thermo</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <Award size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-ink">Buy Exam Tests</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[10px] font-extrabold">+50 PTS</span>
            </div>
            <p className="text-[11px] text-gray-500 truncate">Instant points per 20 ETB exam</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex items-center gap-3 relative overflow-hidden bg-gradient-to-r from-amber-50/50 to-white">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm">
            <Zap size={20} className="fill-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-ink">Telegram Premium</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white text-[10px] font-black uppercase">5* Points (+250)</span>
            </div>
            <p className="text-[11px] text-gray-500 truncate">5x Mega Booster for rank climb</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STICKY / PROMINENT USER RANK INDICATOR (Requested: user > 20 show rank)
         ========================================================================= */}
      {currentUserEntry.points === 0 ? (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0B5D3B] text-gold flex items-center justify-center font-black text-lg shadow-sm shrink-0">
              0
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-[#12202B]">
                  Ready to Compete (0 Points)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-[#0B5D3B] border border-emerald-300">
                  New Competitor
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Take a 3-minute Course Quiz (+100 pts) or unlock exam tests (+50 pts) to claim your spot on the live Top 20 Leaderboard and win cash prizes!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('quiz');
                if (challenges.length > 0) {
                  handleRequestStartQuiz(challenges[0]);
                }
              }}
              className="px-4 py-2 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Play size={13} />
              Take Quiz (+100 pts)
            </button>
            <Link
              href="/dashboard/telegram-premium"
              className="px-4 py-2 rounded-xl bg-gold hover:bg-amber-400 text-[#12202B] text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Zap size={13} />
              5* Booster (+250)
            </Link>
          </div>
        </div>
      ) : !isUserInTop20 ? (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0B5D3B] text-gold flex items-center justify-center font-black text-lg shadow-sm shrink-0">
              #{userRank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-[#12202B]">
                  Your rank is #{userRank} ({currentUserEntry.points} Points)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                  Target: Top 20
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                You only need <strong className="text-[#0B5D3B] font-black">{pointsToTop20} more points</strong> to enter the Top 20 Leaderboard and qualify for the 1,000 / 600 / 300 ETB cash prizes!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('quiz');
                if (COURSE_COMPETITION_QUIZZES.length > 0) {
                  handleRequestStartQuiz(challenges[0] || COURSE_COMPETITION_QUIZZES[0]);
                }
              }}
              className="px-4 py-2 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Play size={13} />
              Take Quiz (+100 pts)
            </button>
            <Link
              href="/dashboard/telegram-premium"
              className="px-4 py-2 rounded-xl bg-gold hover:bg-amber-400 text-[#12202B] text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Zap size={13} />
              5* Booster (+250)
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold text-[#12202B] flex items-center justify-center font-black text-base">
              #{userRank}
            </div>
            <div>
              <p className="text-xs font-black text-[#0B5D3B]">
                🌟 Outstanding! You are in the Top 20 Leaderboard (Rank #{userRank})
              </p>
              <p className="text-[11px] text-gray-600">
                Current Score: {currentUserEntry.points} Points. Keep competing to take 1st Place (1,000 ETB)!
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            Cash Qualified
          </span>
        </div>
      )}

      {/* =========================================================================
          VIEW SWITCHER TABS (Leaderboard vs Course Quizzes)
         ========================================================================= */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer',
              activeTab === 'leaderboard'
                ? 'bg-[#0B5D3B] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-ink border border-gray-200'
            )}
          >
            <Trophy size={14} />
            Top 20 Leaderboard
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer',
              activeTab === 'quiz'
                ? 'bg-[#0B5D3B] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-ink border border-gray-200'
            )}
          >
            <BookOpen size={14} />
            Course Quizzes ({challenges.length})
          </button>
        </div>

        <button
          onClick={refreshLeaderboard}
          className="p-2 rounded-xl text-gray-400 hover:text-ink hover:bg-gray-100 transition-colors"
          title="Refresh Live Leaderboard"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* =========================================================================
          TAB 1: TOP 20 LEADERBOARD (Strictly 20 ranks displayed)
         ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-black text-ink flex items-center gap-2">
                  Official Top 20 University Rankings
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-[#0B5D3B]">
                    Live {seasonMonth}
                  </span>
                </h2>
                <p className="text-xs text-gray-500">
                  Updated in real-time. Cash prizes are finalized and distributed at the end of every calendar month.
                </p>
              </div>
              <span className="text-[11px] font-bold text-gray-400">
                Displaying 20 Qualified Leaders
              </span>
            </div>

            {/* Top 20 Table / Responsive Mobile Cards */}
            <div className="divide-y divide-gray-100">
              {top20.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-14 h-14 rounded-3xl bg-amber-50 text-gold mx-auto flex items-center justify-center border border-amber-200">
                    <Trophy size={28} className="text-gold" />
                  </div>
                  <h3 className="font-black text-ink text-base">New Season Begins! No Ranked Students Yet</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Be the very first student to complete a course quiz or unlock an exam test to claim the #1 spot and win the 1,000 ETB cash prize!
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('quiz');
                      if (COURSE_COMPETITION_QUIZZES.length > 0) {
                        handleRequestStartQuiz(challenges[0] || COURSE_COMPETITION_QUIZZES[0]);
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0B5D3B] text-white text-xs font-bold shadow-md hover:bg-emerald-800 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Play size={14} /> Start 1st Quiz (+100 Points)
                  </button>
                </div>
              ) : (
                top20.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.id === user?.id || entry.name === user?.name;
                const isFirst = rank === 1;
                const isSecond = rank === 2;
                const isThird = rank === 3;

                return (
                  <div
                    key={entry.id}
                    className={cn(
                      'py-3.5 px-3 sm:px-4 rounded-2xl transition-all flex items-center justify-between gap-3',
                      isCurrentUser ? 'bg-emerald-50/70 border border-emerald-300 font-semibold' : 'hover:bg-gray-50/80',
                      isFirst && 'bg-amber-50/40'
                    )}
                  >
                    {/* Rank Badge & Competitor Info */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Rank icon / number */}
                      <div className="w-8 sm:w-9 text-center shrink-0">
                        {isFirst ? (
                          <div className="w-8 h-8 rounded-full bg-gold text-[#12202B] font-black text-xs flex items-center justify-center shadow-sm">
                            🥇
                          </div>
                        ) : isSecond ? (
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-[#12202B] font-black text-xs flex items-center justify-center shadow-sm">
                            🥈
                          </div>
                        ) : isThird ? (
                          <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                            🥉
                          </div>
                        ) : (
                          <span className="font-mono text-xs sm:text-sm font-black text-gray-400">
                            #{rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#0B5D3B] to-[#12202B] text-gold font-black text-xs flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                        {entry.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                        ) : (
                          entry.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      {/* Name & Uni */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs sm:text-sm font-black text-ink truncate">
                            {entry.name}
                            {isCurrentUser && (
                              <span className="ml-1.5 text-[10px] font-black text-[#0B5D3B] bg-emerald-100 px-1.5 py-0.2 rounded-md">
                                (You)
                              </span>
                            )}
                          </p>

                          {entry.hasTelegramPremium && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black" title="Telegram Premium 5x Booster Active">
                              <Zap size={9} className="fill-amber-500 text-amber-500" /> 5*
                            </span>
                          )}

                          {isFirst && (
                            <span className="px-1.5 py-0.2 rounded bg-gold/30 text-[#083D28] text-[9px] font-black uppercase">
                              1,000 ETB Leader
                            </span>
                          )}
                          {isSecond && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 text-[9px] font-black uppercase">
                              600 ETB
                            </span>
                          )}
                          {isThird && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-black uppercase">
                              300 ETB
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-gray-500 truncate">
                          {entry.university} • {entry.department}
                        </p>
                      </div>
                    </div>

                    {/* Points & Stats */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs sm:text-sm font-black text-ink">
                          {entry.points}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">pts</span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {entry.quizzesCompleted} quizzes • {entry.testsPurchased} tests
                      </p>
                    </div>
                  </div>
                );
              }))}
            </div>

            {/* Bottom Note for user > 20 */}
            {!isUserInTop20 && (
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
                  <span>
                    Your current standing is <strong>Rank #{userRank}</strong> ({currentUserEntry.points} pts).
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('quiz');
                      if (COURSE_COMPETITION_QUIZZES[0]) handleRequestStartQuiz(challenges[0] || COURSE_COMPETITION_QUIZZES[0]);
                    }}
                    className="text-[#0B5D3B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Solve Quiz to enter Top 20 <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: COURSE QUIZZES & LIVE QUIZ RUNNER
         ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {!quizStarted ? (
            /* Quiz Selection Catalog */
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-black text-ink">University Course Challenges</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Answer 5 course-specific multiple choice questions within 3 minutes. Each correct answer awards +20 points, with a +50 bonus for a perfect score!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  {challenges.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="rounded-2xl border border-gray-200 p-5 bg-[#FAF7F0]/40 hover:border-[#0B5D3B] transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-gray-500">{quiz.courseCode}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                              5 ETB Fee
                            </span>
                          </div>
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-black uppercase',
                            quiz.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                          )}>
                            {quiz.difficulty}
                          </span>
                        </div>
                        <h3 className="font-black text-sm text-ink">{quiz.courseTitle}</h3>
                        <p className="text-xs text-gray-500">{quiz.university} • {quiz.department}</p>
                        
                        <div className="pt-2 flex items-center gap-3 text-xs text-gray-600 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-gray-400" />
                            {quiz.timeSeconds / 60} mins
                          </span>
                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-gold" />
                            Up to +{quiz.totalRewardPoints} pts
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRequestStartQuiz(quiz)}
                        className="mt-5 w-full py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Play size={13} />
                        Enter Competition Test (5 ETB)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Live Interactive Quiz Player */
            selectedQuiz && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6 max-w-3xl mx-auto">
                {/* Header with Timer and Progress */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      {selectedQuiz.courseCode} • {selectedQuiz.university}
                    </span>
                    <h2 className="text-lg font-black text-ink">{selectedQuiz.courseTitle}</h2>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Timer Badge */}
                    <div className={cn(
                      'px-3 py-1.5 rounded-xl font-mono text-xs font-black flex items-center gap-1.5',
                      secondsRemaining <= 30 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-50 text-[#0B5D3B]'
                    )}>
                      <Clock size={14} />
                      {formatTimer(secondsRemaining)}
                    </div>

                    <button
                      onClick={() => setQuizStarted(false)}
                      className="text-xs text-gray-400 hover:text-ink font-bold"
                    >
                      Exit Quiz
                    </button>
                  </div>
                </div>

                {!quizSubmitted ? (
                  /* Question Display */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                      <span>Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</span>
                      <span>Worth {selectedQuiz.questions[currentQuestionIndex].points} pts</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <p className="text-sm font-bold text-ink leading-relaxed">
                        {selectedQuiz.questions[currentQuestionIndex].question}
                      </p>
                    </div>

                    {/* Radio Options */}
                    <div className="space-y-2.5">
                      {selectedQuiz.questions[currentQuestionIndex].options.map((opt) => {
                        const qId = selectedQuiz.questions[currentQuestionIndex].id;
                        const isSelected = selectedAnswers[qId] === opt.key;

                        return (
                          <div
                            key={opt.key}
                            onClick={() => handleSelectOption(qId, opt.key)}
                            className={cn(
                              'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3',
                              isSelected
                                ? 'border-[#0B5D3B] bg-emerald-50/40 text-[#0B5D3B] font-bold shadow-xs'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                            )}
                          >
                            <div className={cn(
                              'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
                              isSelected ? 'bg-[#0B5D3B] text-white' : 'bg-gray-100 text-gray-600'
                            )}>
                              {opt.key}
                            </div>
                            <span className="text-xs leading-relaxed">{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 disabled:opacity-40"
                      >
                        Previous
                      </button>

                      {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                          className="px-5 py-2 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-bold transition-all"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={submitQuizAnswers}
                          className="px-6 py-2.5 rounded-xl bg-gold hover:bg-amber-400 text-[#12202B] text-xs font-black transition-all shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} />
                          Submit Answers & Claim Points
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Quiz Result Screen */
                  <div className="space-y-6 text-center py-4">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#0B5D3B] flex items-center justify-center mx-auto text-2xl font-black">
                      <Trophy size={32} />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-ink">Challenge Completed!</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        You scored {quizScore?.correct} of {quizScore?.total} correct answers!
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-sm mx-auto">
                      <p className="text-[11px] font-bold text-emerald-900 uppercase">Points Awarded</p>
                      <p className="text-3xl font-black text-[#0B5D3B]">+{quizScore?.pointsEarned} PTS</p>
                      <p className="text-[11px] text-emerald-800 mt-1">
                        Added to your official monthly leaderboard rank.
                      </p>
                    </div>

                    {/* Explanations List */}
                    <div className="text-left space-y-3 pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-black text-ink uppercase tracking-wider">Answer Review & Explanations:</h4>
                      {selectedQuiz.questions.map((q, idx) => {
                        const userAns = selectedAnswers[q.id];
                        const isCorrect = userAns === q.correctOption;

                        return (
                          <div key={q.id} className="p-3.5 rounded-xl border border-gray-200 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-ink">Q{idx + 1}: {q.question}</span>
                              <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold', isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800')}>
                                {isCorrect ? 'Correct (+20)' : `Incorrect (Correct: ${q.correctOption})`}
                              </span>
                            </div>
                            <p className="text-gray-500 text-[11px] italic mt-1">
                              💡 {q.explanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-4">
                      <button
                        onClick={() => {
                          setQuizStarted(false);
                          setActiveTab('leaderboard');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-bold transition-all"
                      >
                        View Updated Leaderboard
                      </button>
                      <button
                        onClick={() => handleStartQuiz(selectedQuiz)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw size={13} /> Retake Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}


      {/* 5 ETB Competition Test Entry Confirmation Modal */}
      {pendingQuizToPay && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="font-black text-ink text-base">Enter Competition Test</h3>
                  <p className="text-[11px] text-gray-400">Monthly Cash Prize Qualifier</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingQuizToPay(null)}
                className="p-1 rounded-full text-gray-400 hover:text-ink hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">
                Selected Challenge
              </span>
              <h4 className="font-black text-ink text-sm">{pendingQuizToPay.courseTitle}</h4>
              <p className="text-xs text-gray-600">
                Course: <strong className="text-ink">{pendingQuizToPay.courseCode}</strong> • {pendingQuizToPay.department}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800">
                  ⚡ 5 Randomized Questions
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800">
                  ⏱️ 3 Minutes
                </span>
              </div>
            </div>

            {/* Price & Balance */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Entry Fee</span>
                <span className="text-2xl font-black text-[#0B5D3B]">5 ETB</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Your Balance</span>
                <span className="text-sm font-black text-ink">{walletBalance} ETB</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 space-y-1">
              <p className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                <span>Each participant receives a <strong>different randomized test</strong> derived from course exam papers.</span>
              </p>
              <p className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                <span>Earn up to <strong>150 Leaderboard Points</strong> to compete for the 1,000 ETB monthly prize.</span>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPendingQuizToPay(null)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayAndEnter}
                className="flex-1 py-3 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap size={14} className="fill-white" />
                <span>Pay 5 ETB & Begin</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

