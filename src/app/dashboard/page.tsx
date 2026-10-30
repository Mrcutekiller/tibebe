'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen, FileText, Bell, Search,
  ChevronRight, Lock, CheckCircle, Award,
  TrendingUp, Zap, LayoutDashboard, Library,
  ShoppingBag, Settings, HelpCircle, LogOut, GraduationCap,
  Wallet, Plus, ShoppingCart, HelpCircle as QuizIcon, Check, X, RefreshCw,
  Star, User, Download, Printer, QrCode, ArrowUpRight, Flame, Sparkles
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Chip } from '@/components/ui/Badge';
import { EXAMS, COURSES, UNIVERSITIES } from '@/lib/seed-data';
import AuthGuard from '@/components/ui/AuthGuard';
import TibebBillModal, { BillOrder } from '@/components/billing/TibebBillModal';

type ExamFilter = 'all' | 'Final' | 'Mid' | 'Class Test' | 'Quiz';

interface QuizQuestion {
  id: string;
  uniId: string;
  course: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const PRACTICE_QUIZZES: QuizQuestion[] = [
  {
    id: 'q-aau-1',
    uniId: 'aau',
    course: 'MATH 1011 (AAU Fresh)',
    question: 'What is the limit of (sin x) / x as x approaches 0?',
    options: ['0', '1', 'Infinity', 'Undefined'],
    correct: 1,
    explanation: 'By standard calculus limit theorem, lim(x->0) (sin x)/x = 1. A classic AAU freshman mathematics question!'
  },
  {
    id: 'q-astu-1',
    uniId: 'astu',
    course: 'EE 2011 (ASTU Engineering)',
    question: 'In a series RLC circuit at resonant frequency, what is the total circuit impedance Z equal to?',
    options: ['Zero', 'R (Purely Resistive)', 'XL + XC', 'Infinite'],
    correct: 1,
    explanation: 'At resonance, inductive reactance (XL) equals capacitive reactance (XC). They cancel out, leaving Z = R.'
  },
  {
    id: 'q-unity-1',
    uniId: 'unity',
    course: 'ACCT 201 (Unity Business)',
    question: 'Which of the following increases an asset account under double-entry bookkeeping?',
    options: ['Credit', 'Debit', 'Equity Dividend', 'Depreciation'],
    correct: 1,
    explanation: 'Assets increase with a Debit entry and decrease with a Credit entry. Core rule in Unity Financial Accounting.'
  }
];

const SIDEBAR_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/smart-notes', label: 'Smart Notes & Flash', icon: Sparkles },
  { href: '/dashboard/catalog', label: 'Exam Tests', icon: FileText },
  { href: '/dashboard/library', label: 'My Library', icon: Library },
  { href: '/dashboard/orders', label: 'Orders & Bills', icon: ShoppingBag },
  { href: '/dashboard/certificates', label: 'Certificates', icon: Award },
  { href: '/dashboard/telegram-premium', label: 'Telegram Premium', icon: Zap },
  { href: '/dashboard/profile', label: 'Settings', icon: Settings },
];

// Activity hours by month for the bar chart widget
const MONTHLY_ACTIVITY = [
  { month: 'Jan', hours: 2.1, active: false },
  { month: 'Feb', hours: 2.8, active: false },
  { month: 'Mar', hours: 1.5, active: false },
  { month: 'Apr', hours: 3.2, active: false },
  { month: 'May', hours: 2.4, active: false },
  { month: 'Jun', hours: 1.9, active: false },
  { month: 'Jul', hours: 2.7, active: false },
  { month: 'Aug', hours: 3.0, active: false },
  { month: 'Sep', hours: 2.2, active: false },
  { month: 'Oct', hours: 3.5, active: true },
];

const COURSE_PILLS = [
  { id: 'all', label: 'All Courses', icon: '🎓' },
  { id: 'MATH 1011', label: 'Applied Math (MATH 1011)', icon: '📐' },
  { id: 'PHYS 1011', label: 'General Physics (PHYS 1011)', icon: '⚡' },
  { id: 'COSC 1011', label: 'Computer Science (COSC 1011)', icon: '💻' },
  { id: 'FLEn 1011', label: 'English (FLEn 1011)', icon: '📝' },
];

function DashboardContent() {
  const router = useRouter();
  const { user, signOut, walletBalance, topUpWallet } = useAuth();
  const { addToCart, setIsCartOpen, cart, isInCart } = useCart();
  const [activeFilter, setActiveFilter] = useState<ExamFilter>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [activeUni, setActiveUni] = useState<string>(user?.university_id ?? 'aau');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Selected Bill Modal State
  const [selectedBill, setSelectedBill] = useState<BillOrder | null>(null);

  // Wallet Top-up Modal State
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(100);
  const [topUpMethod, setTopUpMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  // Daily Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const displayName = user?.name || 'Abebe Kebede';
  const firstName = displayName.split(' ')[0] ?? 'Student';
  const currentUni = UNIVERSITIES.find(u => u.id === activeUni) ?? UNIVERSITIES[0];

  const matchingQuizzes = PRACTICE_QUIZZES.filter(q => q.uniId === activeUni);
  const activeQuiz = matchingQuizzes.length > 0 ? matchingQuizzes[currentQuizIndex % matchingQuizzes.length] : PRACTICE_QUIZZES[0];

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(optionIdx);
    setQuizSubmitted(true);
    if (optionIdx === activeQuiz.correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    setCurrentQuizIndex(prev => prev + 1);
  };

  const handleConfirmTopUp = () => {
    if (!topUpAmount || topUpAmount <= 0) return;
    setShowTopUp(false);
    router.push(`/payment?amount=${topUpAmount}&method=${topUpMethod}&type=deposit`);
  };

  // Course & Exam Filtering Logic: strictly filters to that course!
  const myExams = EXAMS.filter(e => {
    if (activeUni !== 'all' && e.university_id !== activeUni) return false;
    if (activeFilter !== 'all' && e.exam_type !== activeFilter) return false;
    if (selectedCourse !== 'all' && e.code !== selectedCourse && e.subject !== selectedCourse) return false;
    return true;
  });

  // Recent Bill Sample
  const sampleBill: BillOrder = {
    id: 'INV-2026-90412',
    date: 'Today, 08:30 PM',
    itemTitle: 'AAU Applied Mathematics I (MATH 1011) Final Exam + Solutions',
    itemType: 'Exam',
    price: 20,
    paymentMethod: 'Telebirr',
    status: 'Completed',
    customerName: displayName,
    university: currentUni.name,
    department: user?.department || 'Technology & Sciences',
    studentId: 'ETS-2026/8941',
    txHash: 'TLB-8910482103'
  };

  // Modern Card Color Accents preserving Tibeb's emerald green & gold brand
  const cardColorThemes = [
    { bg: 'bg-[#EAF5EE]', border: 'border-emerald-200/70', badge: 'bg-emerald-600 text-white', icon: '📐', cat: 'Mathematics' },
    { bg: 'bg-[#FEF7E6]', border: 'border-amber-200/80', badge: 'bg-amber-600 text-white', icon: '⚡', cat: 'Physics' },
    { bg: 'bg-[#F2EDF8]', border: 'border-purple-200/70', badge: 'bg-purple-700 text-white', icon: '💻', cat: 'Computer Science' },
    { bg: 'bg-[#EBF5F6]', border: 'border-teal-200/70', badge: 'bg-teal-700 text-white', icon: '📝', cat: 'Communicative English' },
  ];

  return (
    <div className="flex-1 p-3 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-[1600px] w-full mx-auto">
        
        {/* Outer Modern Application Shell */}
        <div className="bg-[#FAF8F5] rounded-3xl sm:rounded-[36px] shadow-sm border border-stone-200/60 overflow-hidden flex flex-col lg:flex-row min-h-[90vh]">
          
          {/* =========================================================
              CENTER: MAIN DASHBOARD AREA (INSPIRED BY 2ND IMAGE)
             ========================================================= */}
          <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto">
            
            {/* Top Greeting & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#12202B] tracking-tight leading-tight">
                  Invest in your <br className="hidden sm:inline" /> education
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1.5 font-medium">
                  Welcome back, <strong className="text-ink">{displayName}</strong> • {currentUni.name}
                </p>
              </div>

              {/* Top Quick Actions: Wallet, Cart & Account Profile */}
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-stone-200 shadow-sm text-xs font-bold text-ink hover:border-emerald-600 transition-all cursor-pointer"
                  title="My Account & Profile"
                >
                  <User size={15} className="text-emerald-700" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={() => setShowTopUp(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-stone-200 shadow-sm text-xs font-bold text-ink hover:border-green transition-all cursor-pointer"
                >
                  <Wallet size={15} className="text-emerald-700" />
                  <span>{walletBalance} ETB</span>
                  <span className="p-0.5 rounded-full bg-emerald-600 text-white"><Plus size={10} /></span>
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 rounded-2xl bg-white border border-stone-200 text-ink shadow-sm hover:border-green transition-all"
                  title="Open Exam Cart"
                >
                  <ShoppingCart size={18} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Course Filter Pills Row (Requirement: Filter by Course) */}
            <div className="mb-8">
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                {COURSE_PILLS.map((c) => {
                  const isSelected = selectedCourse === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCourse(c.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#12202B] text-white shadow-md scale-105'
                          : 'bg-white border border-stone-200/80 text-gray-600 hover:text-ink hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm">{c.icon}</span>
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Secondary Campus & Exam Type Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-stone-200/50 text-xs">
                {/* University Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider">Campus:</span>
                  {UNIVERSITIES.map((uni) => (
                    <button
                      key={uni.id}
                      onClick={() => setActiveUni(uni.id)}
                      className={`px-3 py-1 rounded-xl font-bold transition-all ${
                        activeUni === uni.id
                          ? 'bg-[#0B5D3B] text-white shadow-sm'
                          : 'bg-white text-gray-600 border border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {uni.short}
                    </button>
                  ))}
                </div>

                {/* Exam Format Filter */}
                <div className="flex items-center gap-1.5">
                  {(['all', 'Final', 'Mid', 'Class Test', 'Quiz'] as ExamFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        activeFilter === f
                          ? 'bg-gold text-ink shadow-sm'
                          : 'text-gray-500 hover:text-ink'
                      }`}
                    >
                      {f === 'all' ? 'All Types' : f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Smart Notes & Flashcards Callout Banner */}
            <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0B5D3B] via-[#0E744A] to-[#12202B] text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold backdrop-blur-sm">
                  <Sparkles size={13} className="text-[#E0A526]" />
                  <span>NEW: Tibeb AI Smart Notes</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Turn Complex Lecture Notes into Short, Easy Words & Flashcards
                </h3>
                <p className="text-xs text-emerald-100 max-w-xl">
                  Paste difficult class notes to get simple explanations, real-world examples (e.g.), 3D flip flashcards, and an auto-generated practice quiz.
                </p>
              </div>
              <Link
                href="/dashboard/smart-notes"
                className="z-10 px-5 py-3 rounded-2xl bg-[#E0A526] hover:bg-amber-400 text-ink text-xs font-black shadow-lg shadow-black/20 flex items-center justify-center gap-2 flex-shrink-0 transition-transform hover:scale-105"
              >
                <Sparkles size={15} />
                Open AI Smart Notes →
              </Link>
            </div>

            {/* Section: Most Popular Tests Grid (4 Cards like 2nd image) */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-ink">Most Popular Past Tests</h2>
                  <p className="text-xs text-gray-400">Filtered strictly for {selectedCourse === 'all' ? 'all courses' : selectedCourse} • 20 ETB each</p>
                </div>
                <Link href="/dashboard/catalog" className="text-xs font-bold text-green hover:underline flex items-center gap-1">
                  Browse All <ArrowUpRight size={14} />
                </Link>
              </div>

              {myExams.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-stone-200">
                  <span className="text-4xl block mb-2">🔍</span>
                  <h3 className="font-bold text-ink">No tests found for this course selection</h3>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Try selecting "All Courses" or switch to another campus.</p>
                  <button
                    onClick={() => { setSelectedCourse('all'); setActiveFilter('all'); }}
                    className="px-4 py-2 rounded-xl bg-green text-white font-bold text-xs"
                  >
                    Reset Course Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {myExams.slice(0, 4).map((exam, idx) => {
                    const theme = cardColorThemes[idx % cardColorThemes.length];
                    const inCart = isInCart(exam.id);

                    return (
                      <div
                        key={exam.id}
                        className={`${theme.bg} rounded-3xl p-6 border ${theme.border} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group`}
                      >
                        {/* Top Card Bar: Category, Rating & Year */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{theme.icon}</span>
                              <span className="text-xs font-bold text-gray-700">{exam.subject || theme.cat}</span>
                            </div>

                            <div className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full text-xs font-bold text-ink shadow-sm">
                              <Star size={13} className="text-gold fill-gold" />
                              <span>{exam.rating}</span>
                            </div>
                          </div>

                          {/* Bold Title */}
                          <h3 className="text-lg sm:text-xl font-black text-ink leading-snug mb-2 group-hover:text-green transition-colors">
                            {exam.title}
                          </h3>

                          {/* Requirement: Show what is the test about & What year */}
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 mb-4 border border-black/5 text-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-800">
                                About this test:
                              </span>
                              <span className="font-black text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark">
                                Year: {exam.year}
                              </span>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-[11px] line-clamp-2">
                              {exam.description}
                            </p>
                            <div className="mt-2 text-[10px] font-bold text-gray-400">
                              {exam.code} • Semester {exam.semester} • {exam.pages} Pages with Solution Key
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom: Student Count & Overlapping Avatars & Actions */}
                        <div className="pt-3 border-t border-black/5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {/* Avatar stack matching 2nd image */}
                            <div className="flex -space-x-2">
                              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">K</div>
                              <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">Y</div>
                              <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">S</div>
                            </div>
                            <span className="text-xs font-semibold text-gray-600">
                              {exam.purchases} students
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => addToCart({
                                id: exam.id,
                                title: exam.title,
                                price: exam.price,
                                type: 'exam',
                                code: exam.code,
                                university: exam.university
                              })}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                inCart
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-white hover:bg-stone-100 text-ink border border-stone-200'
                              }`}
                            >
                              <ShoppingCart size={13} />
                              <span>{inCart ? 'In Basket' : '+ Cart'}</span>
                            </button>

                            <Link
                              href={`/exams/${exam.id}`}
                              className="px-4 py-1.5 rounded-xl bg-[#0B5D3B] hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                            >
                              View Test (20 ETB)
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Practice Quiz Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
                  <Sparkles size={14} className="text-purple-600" />
                  <span>Daily Campus Practice Quiz</span>
                </div>
                <h3 className="text-lg font-bold text-ink">{activeQuiz.question}</h3>
                <p className="text-xs text-gray-500">{activeQuiz.course} • Solve daily questions to boost exam readiness.</p>
              </div>

              <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                  {activeQuiz.options.slice(0, 4).map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(i)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedOption === i
                          ? i === activeQuiz.correct
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-rose-500 text-white border-rose-500'
                          : 'bg-stone-50 text-gray-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {quizSubmitted && (
                  <button
                    onClick={handleNextQuiz}
                    className="p-2.5 rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition-all"
                    title="Next Question"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
              </div>
            </div>
          </main>

          {/* =========================================================
              RIGHT PANEL: USER PROFILE, ACTIVITY & MY COURSES (FROM 2ND IMAGE)
             ========================================================= */}
          <aside className="lg:w-80 bg-white/60 border-l border-stone-200/60 p-6 flex flex-col justify-between gap-6">
            
            {/* Top Bar: Notifications & Settings */}
            <div className="flex items-center justify-between">
              <Link href="/dashboard/notifications" className="relative p-2 rounded-xl bg-white border border-stone-200 text-gray-600 hover:text-ink shadow-sm transition-all">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-tibeb" />
              </Link>
              <Link href="/dashboard/profile" className="p-2 rounded-xl bg-white border border-stone-200 text-gray-600 hover:text-ink shadow-sm transition-all">
                <Settings size={18} />
              </Link>
            </div>

            {/* Profile Card */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green via-gold to-emerald-400 p-0.5 animate-pulse" />
                <div className="w-full h-full rounded-full bg-white p-1 relative z-10 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0B5D3B] to-[#12202B] text-white font-black text-2xl flex items-center justify-center">
                    {firstName.charAt(0)}
                  </div>
                </div>
              </div>

              <h3 className="font-black text-lg text-ink">{displayName}</h3>
              <p className="text-xs text-gray-400 font-medium">{currentUni.short} • {user?.department || 'Computer Science'}</p>

              {/* Friends / Peers Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 text-xs font-semibold text-gray-700 mt-3">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[9px] flex items-center justify-center font-bold">A</div>
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white text-[9px] flex items-center justify-center font-bold">B</div>
                  <div className="w-5 h-5 rounded-full bg-purple-700 text-white text-[9px] flex items-center justify-center font-bold">C</div>
                </div>
                <span>274 Peers studying today</span>
              </div>
            </div>

            {/* Activity Card & Chart (Directly from 2nd image) */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Activity</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Flame size={12} className="text-amber-500 fill-amber-500" /> Great result!
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-black text-ink">3.5h</span>
                <span className="text-xs text-gray-400 font-medium">Daily study time</span>
              </div>

              {/* Vertical Bar Chart matching 2nd image */}
              <div className="flex items-end justify-between gap-1.5 h-24 pt-2">
                {MONTHLY_ACTIVITY.map((item, idx) => {
                  const heightPercent = (item.hours / 4) * 100;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-stone-100 rounded-full h-18 flex items-end p-0.5">
                        <div
                          className={`w-full rounded-full transition-all duration-500 ${
                            item.active
                              ? 'bg-gradient-to-t from-emerald-600 via-green to-gold shadow-md'
                              : 'bg-emerald-200/60 hover:bg-emerald-300'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className={`text-[9px] ${item.active ? 'font-bold text-ink' : 'text-gray-400'}`}>
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* My Courses & Tests Widget (matching 2nd image) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">My Unlocked Tests</h4>
                <Link href="/dashboard/library" className="text-[11px] font-bold text-green hover:underline">
                  View All
                </Link>
              </div>

              {/* Course Card 1 */}
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs flex-shrink-0">
                    M1
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-ink truncate">AAU Math 1011 Final Paper</p>
                    <p className="text-[10px] text-gray-400">Full Verified Solutions • Year 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gold text-xs font-bold">
                  <Star size={12} className="fill-gold" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Course Card 2 */}
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs flex-shrink-0">
                    P1
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-ink truncate">PHYS 1011 Mechanics Bootcamp</p>
                    <p className="text-[10px] text-gray-400">Past Mid-Exams • Solved</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gold text-xs font-bold">
                  <Star size={12} className="fill-gold" />
                  <span>4.8</span>
                </div>
              </div>
            </div>

            {/* Official Electronic Bill Quick Access Button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedBill(sampleBill)}
                className="w-full py-3 px-4 rounded-2xl bg-[#0B5D3B] hover:bg-[#083d28] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Download size={15} />
                <span>Download My Official Bill</span>
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Official Electronic Bill Modal (Original & Cool with Print/Download) */}
      <TibebBillModal
        order={selectedBill}
        onClose={() => setSelectedBill(null)}
      />

      {/* Wallet Top-up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <h3 className="font-black text-ink text-lg mb-1">Top Up Student Wallet</h3>
            <p className="text-xs text-gray-500 mb-4">Fast 1-click test unlocking without SMS OTP waiting</p>

            {/* Type custom amount */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Type Deposit Amount (ETB):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  step="5"
                  value={topUpAmount || ''}
                  onChange={(e) => setTopUpAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full text-xl font-black text-ink px-4 py-3 rounded-2xl border-2 border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 bg-emerald-50/20 pr-16"
                  placeholder="e.g. 250"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500">
                  ETB
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {[50, 100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 rounded-xl font-bold text-xs border transition-all ${
                    topUpAmount === amt
                      ? 'bg-green text-white border-green shadow-sm scale-105'
                      : 'bg-stone-50 text-gray-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  +{amt}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setTopUpMethod('telebirr')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  topUpMethod === 'telebirr' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-stone-200'
                }`}
              >
                Telebirr
              </button>
              <button
                type="button"
                onClick={() => setTopUpMethod('cbe')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  topUpMethod === 'cbe' ? 'border-purple-600 bg-purple-50 text-purple-800' : 'border-stone-200'
                }`}
              >
                CBE Birr
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmTopUp}
                className="flex-1 py-3.5 rounded-2xl bg-green hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02]"
              >
                <span>Deposit {topUpAmount} ETB → Proceed to Payment</span>
              </button>
              <button
                type="button"
                onClick={() => setShowTopUp(false)}
                className="px-4 py-3.5 rounded-2xl bg-stone-100 text-gray-600 font-bold text-xs hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
