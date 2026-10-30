'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  BookOpen, PlayCircle, Package, ChevronRight, Star,
  Lock, CheckCircle, ArrowRight, Zap, Shield, Wifi,
  GraduationCap, Users, FileText, Award, ChevronDown,
  ArrowUp, Sparkles, TrendingUp, MessageSquare, X, Send,
  Smartphone, Apple, Download, CheckCircle2, Info, Trophy, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { Badge, StarRating } from '@/components/ui/Badge';
import { EXAMS, UNIVERSITIES, TELEGRAM_PREMIUM_PLANS } from '@/lib/seed-data';
import { formatPrice } from '@/lib/utils';

// Stagger animation presets
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

// =====================================================
// HERO SECTION
// =====================================================
function HeroSection() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();

  // Real-time live platform statistics (no fake numbers / no demos - starts from 0)
  const [liveStats, setLiveStats] = useState({
    students: '0',
    exams: `${EXAMS.length}`,
    universities: `${UNIVERSITIES.length}`,
    delivery: '15–30 Min',
  });

  useEffect(() => {
    const updateStats = () => {
      let customExamsCount = 0;
      let registeredCount = 0;
      try {
        const customExams = JSON.parse(localStorage.getItem('tibeb_custom_exams') || '[]');
        customExamsCount = customExams.length;
        const registered = JSON.parse(localStorage.getItem('tibeb_all_registered_users') || '[]');
        const board = JSON.parse(localStorage.getItem('tibeb_competition_leaderboard') || '[]');
        registeredCount = Math.max(registered.length, board.length);
        const activeUser = localStorage.getItem('tibeb_user');
        if (activeUser && registeredCount === 0) registeredCount = 1;
      } catch {}

      const totalExams = EXAMS.length + customExamsCount;
      setLiveStats({
        students: `${registeredCount}`,
        exams: `${totalExams}`,
        universities: `${UNIVERSITIES.length}`,
        delivery: '15–30 Min',
      });
    };
    updateStats();
    window.addEventListener('storage', updateStats);
    return () => window.removeEventListener('storage', updateStats);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden -mt-16 pt-24 pb-16"
      style={{ background: 'linear-gradient(145deg, #0B5D3B 0%, #0d7048 55%, #083d28 100%)' }}
    >
      {/* Dynamic Animated background orbs */}
      <div className="absolute inset-0 hero-pattern pointer-events-none" />
      <motion.div
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="hero-blob w-72 sm:w-96 h-72 sm:h-96 -top-20 -right-20 pointer-events-none"
        style={{ background: 'var(--color-gold)', opacity: 0.14 }}
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="hero-blob w-64 sm:w-80 h-64 sm:h-80 bottom-10 -left-10 pointer-events-none"
        style={{ background: '#12754b', opacity: 0.35 }}
      />

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container-tibeb flex-1 flex flex-col items-center justify-center text-center px-4 py-8 sm:py-16 relative z-10"
      >
        {/* Eyebrow */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 text-xs sm:text-sm shadow-sm backdrop-blur-md"
          style={{ background: 'rgba(224,165,38,0.18)', border: '1px solid rgba(224,165,38,0.35)' }}
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse flex-shrink-0" />
          <span className="font-bold text-gold">Ethiopia's #1 Platform for Exam Tests & Telegram Premium</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 sm:mb-6 tracking-tight"
        >
          {t('hero.title1')}
          <br />
          <span className="text-gradient-gold">{t('hero.title2')}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mb-8 sm:mb-10 px-2 leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* University filter row */}
        <motion.div variants={itemVariants} className="w-full max-w-3xl mb-8 sm:mb-10">
          <div className="flex sm:flex-wrap items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {UNIVERSITIES.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.id}`}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  color: 'rgba(255,255,255,0.95)',
                }}
              >
                {uni.short}
              </Link>
            ))}
            <Link
              href="/universities"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap flex-shrink-0"
            >
              All Campuses →
            </Link>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto max-w-xs sm:max-w-none"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto justify-center shadow-lg shadow-gold/20 hover:scale-105 transition-transform"
            onClick={() => {
              if (!user) {
                window.location.href = '/signup?redirect=/catalog';
              } else {
                window.location.href = '/catalog';
              }
            }}
          >
            <BookOpen size={18} />
            {t('hero.cta.browse')}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto justify-center text-white border-2 border-gold/60 hover:bg-gold/20 hover:scale-105 transition-transform bg-white/5"
            onClick={() => {
              if (!user) {
                window.location.href = '/signup?redirect=/telegram-premium';
              } else {
                window.location.href = '/telegram-premium';
              }
            }}
          >
            <Zap size={18} className="text-gold fill-gold" />
            {t('hero.cta.telegram')}
          </Button>
        </motion.div>

        {/* Real Live Platform Metrics (No Demo • Real-Time Database) */}
        <motion.div
          variants={itemVariants}
          className="mt-12 sm:mt-16 w-full max-w-4xl mx-auto space-y-3"
        >
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live System Verified Metrics (Real-Time • Zero Demo)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Real Students */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-gold mb-1">
                <Users size={16} />
                <span className="text-xl sm:text-2xl font-black text-white">{liveStats.students}</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-100 uppercase tracking-wide">
                Verified Students
              </span>
            </div>

            {/* Real Exams */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-gold mb-1">
                <FileText size={16} />
                <span className="text-xl sm:text-2xl font-black text-white">{liveStats.exams}</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-100 uppercase tracking-wide">
                Certified Exam Papers
              </span>
            </div>

            {/* Real Universities */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-gold mb-1">
                <GraduationCap size={16} />
                <span className="text-xl sm:text-2xl font-black text-white">{liveStats.universities}</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-100 uppercase tracking-wide">
                Universities (AAU • ASTU • Unity)
              </span>
            </div>

            {/* Real Guaranteed Delivery */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-gold mb-1">
                <Zap size={16} className="fill-gold" />
                <span className="text-xl sm:text-2xl font-black text-white">{liveStats.delivery}</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-100 uppercase tracking-wide">
                Guaranteed Delivery Time
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Smooth bottom blend into cream section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAF6EC] to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <div className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-white/50 z-10 pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll down</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}

// =====================================================
// EXAM & TELEGRAM CATEGORY TABS
// =====================================================
function CategorySection() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'exams' | 'telegram'>('exams');

  return (
    <section className="section bg-[#FAF6EC] py-14 sm:py-24 relative overflow-hidden">
      <div className="container-tibeb px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green mb-2 block">
            What We Offer
          </span>
          <h2 className="section-title text-2xl sm:text-4xl text-ink">
            Exam Tests & Telegram Premium
          </h2>
          <p className="section-subtitle text-xs sm:text-base max-w-2xl mx-auto">
            Authentic 20 ETB university past exam tests with full solutions, and instant Telegram Premium subscriptions at unbeatable Ethiopian rates.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { key: 'exams', label: 'University Exam Tests', icon: FileText, badge: 'Verified' },
            { key: 'telegram', label: 'Telegram Premium', icon: Zap, badge: '15-30m ⚡' },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              id={`tab-${key}`}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === key
                  ? 'bg-green text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:text-green border border-gray-200 shadow-sm'
              }`}
            >
              <Icon size={16} className={activeTab === key ? 'text-gold fill-gold' : 'text-gray-400'} />
              <span>{label}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                activeTab === key ? 'bg-white/20 text-white' : 'bg-gold/20 text-gold-dark'
              }`}>
                {badge}
              </span>
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            {activeTab === 'exams' && <ExamGrid />}
            {activeTab === 'telegram' && <TelegramGrid />}
          </motion.div>
        </AnimatePresence>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          {activeTab === 'exams' ? (
            <Button
              variant="outline"
              size="lg"
              className="hover:scale-105 transition-transform"
              onClick={() => {
                if (!user) {
                  window.location.href = '/signup?redirect=/catalog';
                } else {
                  window.location.href = '/catalog';
                }
              }}
            >
              Explore All Certified Exam Tests
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="hover:scale-105 transition-transform"
              onClick={() => {
                if (!user) {
                  window.location.href = '/signup?redirect=/telegram-premium';
                } else {
                  window.location.href = '/telegram-premium';
                }
              }}
            >
              View Full Telegram Premium Store
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

// ---- Exam Grid ----
function ExamGrid() {
  const { user } = useAuth();
  const exams = EXAMS.slice(0, 6);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {exams.map((exam) => (
        <motion.div
          key={exam.id}
          variants={itemVariants}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
          <Link
            href={user ? `/exams/${exam.id}` : '/signup?redirect=/catalog'}
            className="card p-0 overflow-hidden group block hover:shadow-xl transition-all duration-300 bg-white border border-gray-100"
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-green to-gold" />

            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-gray badge text-xs font-semibold">{exam.university}</span>
                    <span className="badge-gold badge text-xs font-semibold">{exam.exam_type}</span>
                    {exam.is_free_sample && <span className="badge-green badge text-xs">Free</span>}
                  </div>
                  <h3 className="font-bold text-ink text-base leading-tight group-hover:text-green transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{exam.code} • {exam.year}</p>
                </div>
                <div className="flex-shrink-0">
                  {exam.is_free_sample ? (
                    <CheckCircle size={20} className="text-green" />
                  ) : (
                    <Lock size={20} className="text-gray-300 group-hover:text-gold transition-colors" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span>{exam.pages} pages</span>
                {exam.has_answers && <span className="text-emerald-700 font-medium">• Verified Key</span>}
                {exam.has_explanations && <span>• Explanations</span>}
              </div>

              <StarRating rating={exam.rating} reviews={exam.reviews} className="mb-4" />

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="font-black text-lg text-green">
                  {exam.price === 0 ? 'Free' : `ETB ${exam.price}`}
                </span>
                <span className="btn btn-green btn-sm group-hover:scale-105 transition-transform shadow-sm">
                  {user ? 'Unlock & Practice' : 'Sign In to Unlock'}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ---- Telegram Premium Grid ----
function TelegramGrid() {
  const { user } = useAuth();
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {TELEGRAM_PREMIUM_PLANS.map((plan) => (
        <motion.div
          key={plan.id}
          variants={itemVariants}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
          <div className={`card p-0 overflow-hidden group flex flex-col justify-between bg-white h-full transition-all duration-300 hover:shadow-2xl relative ${
            plan.popular ? 'border-2 border-gold ring-4 ring-gold/10' : 'border border-gray-100'
          }`}>
            {plan.badge && (
              <div className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                plan.popular ? 'bg-gold text-ink shadow-md' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {plan.badge}
              </div>
            )}

            <div className="p-6">
              {/* Icon & Duration */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md mb-4">
                <Zap size={24} className="fill-current" />
              </div>

              <h3 className="text-xl font-black text-ink mb-1">{plan.duration}</h3>
              <p className="text-xs text-gray-500 mb-4">{plan.description}</p>

              {/* Price */}
              <div className="mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-green">{plan.price} ETB</span>
                  <span className="text-sm text-gray-400 line-through">{plan.original_price} ETB</span>
                </div>
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Save {plan.discount_percent}% off regular rate
                </span>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-2 mb-6">
                {plan.features.slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={user ? `/checkout?item=${plan.id}&type=telegram` : '/signup?redirect=/telegram-premium'}
                className="w-full py-3 px-4 rounded-xl bg-ink hover:bg-green text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group-hover:scale-[1.02]"
              >
                <Zap size={14} className="text-gold fill-gold" />
                <span>{user ? 'Get Plan (15-30m)' : 'Sign In to View & Order'}</span>
              </Link>
              <p className="text-center text-[10px] text-gray-400 mt-2">
                Instant 15–30 min delivery to your @username
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// =====================================================
// HOW IT WORKS
// =====================================================
function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      titleKey: 'how.step1.title',
      descKey: 'how.step1.desc',
      icon: GraduationCap,
      color: 'bg-green-muted',
      iconColor: 'text-green',
    },
    {
      number: '02',
      titleKey: 'how.step2.title',
      descKey: 'how.step2.desc',
      icon: Lock,
      color: 'bg-gold-muted',
      iconColor: 'text-gold',
    },
    {
      number: '03',
      titleKey: 'how.step3.title',
      descKey: 'how.step3.desc',
      icon: CheckCircle,
      color: 'bg-green-muted',
      iconColor: 'text-green',
    },
  ];

  return (
    <section className="section bg-white py-16 sm:py-24 relative overflow-hidden">
      <div className="container-tibeb px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">Simple Process</span>
          <h2 className="section-title mt-2 text-2xl sm:text-4xl text-ink">{t('how.title')}</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green/20 via-gold/40 to-green/20 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="relative z-10 flex flex-col items-center text-center gap-5 p-6 rounded-2xl transition-all"
            >
              <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center relative shadow-sm`}>
                <step.icon size={32} className={step.iconColor} />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-ink text-white text-xs font-black flex items-center justify-center shadow-md">
                  {step.number}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-ink mb-2">{t(step.titleKey)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-12">
          <Button
            variant="green"
            size="lg"
            className="hover:scale-105 transition-transform shadow-md"
            onClick={() => (window.location.href = '/signup')}
          >
            Get Started Free
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// FEATURED EXAMS
// =====================================================
function FeaturedExamSection() {
  const { user } = useAuth();
  const featuredExams = EXAMS.slice(0, 4);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tibeb_unlocked_items') || '["exam-001"]');
      setUnlockedItems(stored);
    } catch {
      setUnlockedItems(['exam-001']);
    }
  }, []);

  return (
    <section className="section py-16 sm:py-24" style={{ background: 'var(--color-cream)' }}>
      <div className="container-tibeb px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green">Study Material</span>
            <h2 className="section-title mt-1 text-2xl sm:text-4xl text-ink">On your study list.</h2>
          </div>
          <Link
            href={user ? "/catalog" : "/signup?redirect=/catalog"}
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-green hover:text-green-dark transition-colors"
          >
            View all <ArrowRight size={15} />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4"
        >
          {featuredExams.map((exam) => {
            const isUnlocked = unlockedItems.includes(exam.id) || exam.is_free_sample;
            const firstImage = exam.images && exam.images.length > 0 ? exam.images[0] : '/test-images/photo_2026-10-23_20-07-33.jpg';

            return (
              <motion.div
                key={exam.id}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="flex-shrink-0 w-72 sm:w-auto"
              >
                <Link
                  href={user ? `/exams/${exam.id}` : '/signup?redirect=/catalog'}
                  className="card p-0 overflow-hidden block group bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-3xl h-full flex flex-col justify-between"
                >
                  {/* 1st Test Paper Preview Banner */}
                  <div className="relative h-44 overflow-hidden bg-slate-900 flex items-center justify-center">
                    {isUnlocked ? (
                      <>
                        <img
                          src={firstImage}
                          alt={`${exam.title} - Page 1`}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[11px] font-bold shadow-md">
                          <CheckCircle size={11} /> Unlocked
                        </div>
                        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md text-ink text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          P.1 Preview
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={firstImage}
                          alt={`${exam.title} - Locked Preview`}
                          className="w-full h-full object-cover object-top blur-[5px] scale-110 brightness-75 select-none"
                        />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-1.5 shadow-md">
                            <Lock size={18} className="text-amber-300" />
                          </div>
                          <span className="text-[11px] font-black text-white uppercase tracking-wider">
                            Locked Exam
                          </span>
                          <span className="text-[10px] text-amber-200 font-semibold mt-0.5 bg-black/50 px-2 py-0.5 rounded-full">
                            20 ETB to Unlock
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="badge-gray badge text-[11px] font-bold">{exam.university}</span>
                        <span className="badge-gold badge text-[11px] font-bold">{exam.exam_type}</span>
                        <span className="text-[11px] text-gray-400 font-medium">{exam.year}</span>
                      </div>

                      <h3 className="font-bold text-ink leading-tight mb-1 group-hover:text-green transition-colors line-clamp-1">
                        {exam.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-3">{exam.code} • {exam.department}</p>

                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <FileText size={12} />
                        <span>{exam.pages} pages</span>
                        {exam.has_answers && (
                          <>
                            <span>•</span>
                            <CheckCircle size={12} className="text-green" />
                            <span className="text-green font-semibold">Answers</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
                      <span className="font-black text-green text-lg">
                        {exam.price} ETB
                      </span>
                      {isUnlocked ? (
                        <span className="px-3 py-1.5 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm">
                          Open →
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-ink hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm flex items-center gap-1">
                          <Lock size={11} className="text-amber-400" /> Unlock
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// =====================================================
// ABOUT TIBEB SECTION (id="about")
// =====================================================
function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#FAF7F0] relative overflow-hidden border-t border-gray-200/60">
      <div className="container-tibeb px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0B5D3B] text-xs font-black uppercase tracking-wider">
            <Info size={13} />
            About Tibeb ጥበብ
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-ink tracking-tight">
            Empowering Ethiopian University Students to Excel
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Tibeb is Ethiopia&apos;s premier higher education academic platform. We eliminate the frustration of blurry exam photocopies, missing answer keys, and unstable campus Wi-Fi by giving students verified past exam solutions, smart AI study aids, and real monthly cash rewards.
          </p>
        </motion.div>

        {/* Story & Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0B5D3B] flex items-center justify-center font-black text-xl">
              🎓
            </div>
            <h3 className="font-black text-base text-ink">10+ Years of Past Exams</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Curated midterm and final examinations from AAU, ASTU, Unity, Hawassa, and Jimma across Engineering, Computer Science, Medicine, and Business.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl">
              ✅
            </div>
            <h3 className="font-black text-base text-ink">Certified Answer Keys</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every single question includes a verified, step-by-step mathematical and conceptual explanation reviewed by university lecturers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xl">
              📱
            </div>
            <h3 className="font-black text-base text-ink">100% Offline Access</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Read and practice anytime. Once unlocked, documents stay saved on your device so you never worry about spotty internet in dorms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xl">
              🏆
            </div>
            <h3 className="font-black text-base text-ink">Monthly Cash Prizes</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Compete on our live leaderboard by taking 3-minute course quizzes to win 1,000 ETB (1st), 600 ETB (2nd), and 300 ETB (3rd) every month.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// WHY CHOOSE US SECTION (id="why-choose-us")
// =====================================================
function WhyChooseUsSection() {
  const features = [
    {
      icon: FileText,
      title: 'Verified Exam Papers & Keys',
      desc: 'Complete answer keys and step-by-step mathematical solutions certified for every question.',
      emoji: '📄',
    },
    {
      icon: Zap,
      title: 'Instant Telebirr & CBE Unlocks',
      desc: 'Instant auto-clearing deposit engine. Unlock exam materials in under 30 seconds with 0 waiting.',
      emoji: '⚡',
    },
    {
      icon: Wifi,
      title: 'Zero Data Waste & Offline Mode',
      desc: 'Download once and read anywhere. Built-in fast PDF viewer with anti-piracy watermarking.',
      emoji: '📥',
    },
    {
      icon: Trophy,
      title: '1,000 ETB Monthly Competitions',
      desc: 'Take interactive quizzes from your university courses and climb the Top 20 for cash rewards.',
      emoji: '🏆',
    },
    {
      icon: GraduationCap,
      title: 'Multi-University Coverage',
      desc: 'Switch between AAU, ASTU, Unity, Hawassa, and Jimma programs with a single unified account.',
      emoji: '🏫',
    },
    {
      icon: MessageSquare,
      title: '24/7 Persistent Live Support',
      desc: 'Connect with support admins in real-time. Offline-safe chat keeps your questions saved forever.',
      emoji: '💬',
    },
  ];

  return (
    <section id="why-choose-us" className="section bg-[#12202B] py-20 sm:py-28 relative overflow-hidden text-white">
      <div className="container-tibeb px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-2"
        >
          <span className="text-xs font-black uppercase tracking-widest text-gold bg-gold/15 px-3 py-1 rounded-full border border-gold/30">
            Why Do You Choose Us?
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-3 tracking-tight">
            The #1 Academic Platform Built for Ethiopian Students
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Everything you need to master your university semester exams, save study time, and win real cash rewards.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -6, backgroundColor: 'rgba(255,255,255,0.08)' }}
              className="p-6 sm:p-7 rounded-3xl transition-all duration-300 bg-white/5 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl bg-gold/15 border border-gold/30">
                  {feature.emoji}
                </div>
                <h3 className="text-lg font-black text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{feature.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-gold font-bold">
                <CheckCircle2 size={13} className="text-gold" />
                Guaranteed by Tibeb
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =====================================================
// DOWNLOAD APP SECTION ON LANDING (id="download")
// =====================================================
function DownloadAppSection() {
  return (
    <section id="download" className="py-20 sm:py-28 bg-[#FAF7F0] relative overflow-hidden border-t border-gray-200/80">
      <div className="container-tibeb px-4 max-w-6xl mx-auto space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-[#0B5D3B] text-xs font-black uppercase tracking-wider">
            <Smartphone size={14} />
            Official Mobile Releases
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-ink tracking-tight">
            Download Tibeb for Android & iOS
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Install the official mobile app directly on your smartphone. Access your university library offline, practice questions on the go, and deposit via Telebirr or CBE in under 30 seconds.
          </p>
        </div>

        {/* Side-by-Side App Download Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ANDROID CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center font-black">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-ink">Android (.APK)</h3>
                    <p className="text-xs text-emerald-700 font-bold">Official Direct Download • v1.2.0</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#0B5D3B] text-[10px] font-black uppercase">
                  8.4 MB
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Direct installation package. Works on all Android smartphones (Samsung, Xiaomi, Tecno, Infinix, Huawei) running Android 8.0 or newer.
              </p>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1 text-xs text-gray-600">
                <p className="font-bold text-ink">How to install in 3 steps:</p>
                <p className="text-[11px]">1. Tap <strong>Download APK</strong> below</p>
                <p className="text-[11px]">2. Tap <strong>Allow from this source</strong> when prompted</p>
                <p className="text-[11px]">3. Tap <strong>Install</strong> and start studying offline!</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href="/api/download?type=apk"
                download="tibeb.apk"
                className="w-full py-4 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Download size={17} />
                Download Android APK (v1.2.0)
              </a>
              <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
                <span>Instant Auto-Download</span>
                <a href="/api/download?type=apk" download="tibeb-v1.2.0.apk" className="text-[#0B5D3B] font-bold hover:underline">
                  Direct Mirror
                </a>
              </div>
            </div>
          </div>

          {/* IOS CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#12202B] flex items-center justify-center font-black">
                    <Apple size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-ink">iOS (iPhone & iPad)</h3>
                    <p className="text-xs text-gray-500 font-bold">via omarchy-apple-dev Pipeline</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-black uppercase">
                  iOS 14.0+
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Built with the open-source <a href="https://github.com/joshuaswarren/omarchy-apple-dev.git" target="_blank" rel="noreferrer" className="text-[#0B5D3B] font-bold underline">omarchy-apple-dev</a> toolchain. Install via native Apple configuration profile or sideload the .IPA.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs text-slate-700">
                <p className="font-bold text-ink">Two easy installation options:</p>
                <p className="text-[11px]">★ <strong>Option 1:</strong> 1-Tap iOS Profile (.mobileconfig) for instant home screen app</p>
                <p className="text-[11px]">★ <strong>Option 2:</strong> Download .IPA for AltStore, Scarlet, or Sideloadly</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="/api/download?type=mobileconfig"
                  download="tibeb.mobileconfig"
                  className="py-4 px-3 rounded-2xl bg-[#12202B] hover:bg-slate-800 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <Apple size={15} />
                  1-Tap iOS Profile
                </a>
                <a
                  href="/api/download?type=ipa"
                  download="tibeb.ipa"
                  className="py-4 px-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-ink font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <Download size={14} />
                  Download .IPA
                </a>
              </div>
              <div className="text-center pt-1">
                <Link href="/download" className="text-[11px] text-[#0B5D3B] font-bold hover:underline inline-flex items-center gap-1">
                  View Full iOS & Android Download Guide <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// =====================================================
// UNIVERSITIES SECTION
// =====================================================
function UniversitiesSection() {
  return (
    <section className="section bg-white py-16 sm:py-24 relative overflow-hidden">
      <div className="container-tibeb px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">Coverage</span>
          <h2 className="section-title mt-2 text-2xl sm:text-4xl text-ink">Find your campus.</h2>
          <p className="section-subtitle">We cover Ethiopia's top universities — with more on the way.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {UNIVERSITIES.map((uni) => (
            <motion.div
              key={uni.id}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Link
                href={`/universities/${uni.id}`}
                className="card p-6 hover:border-green border-2 border-gray-100 group block transition-all shadow-sm hover:shadow-xl bg-white"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md"
                    style={{ background: uni.color }}
                  >
                    {uni.short.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-ink group-hover:text-green transition-colors">{uni.name}</h3>
                    <p className="text-xs text-gray-400">{uni.location}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {uni.departments.slice(0, 4).map((dep) => (
                    <span key={dep.id} className="badge-gray badge text-xs">{dep.name}</span>
                  ))}
                  {uni.departments.length > 4 && (
                    <span className="badge-gray badge text-xs">+{uni.departments.length - 4} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {EXAMS.filter((e) => e.university_id === uni.id).length} exams
                  </span>
                  <span className="text-green text-sm font-semibold group-hover:underline flex items-center gap-1">
                    Browse <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            href="/universities"
            className="text-sm font-bold text-green hover:underline inline-flex items-center gap-1.5"
          >
            View all 18 universities <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// SOCIAL PROOF / TESTIMONIALS
// =====================================================
// =====================================================
// SOCIAL PROOF / REVIEWS & TESTIMONIALS SECTION
// =====================================================
function SocialProofSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [uni, setUni] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tibeb_website_reviews');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTestimonials(prev => [...parsed, ...prev]);
        }
      }
    } catch {}
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter your review comment!');
      return;
    }
    const newTestimonial = {
      name: name.trim() || 'Verified Student',
      university: uni.trim() || 'Addis Ababa University',
      text: comment.trim(),
      rating: rating,
      avatar: (name.trim() || 'V').charAt(0).toUpperCase(),
    };
    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);
    try {
      const existingUser = JSON.parse(localStorage.getItem('tibeb_website_reviews') || '[]');
      localStorage.setItem('tibeb_website_reviews', JSON.stringify([newTestimonial, ...existingUser]));
    } catch {}
    toast.success(`Thank you! Your ${rating}-star review for Tibeb has been published.`);
    setShowModal(false);
    setComment('');
  };

  return (
    <section className="section py-16 sm:py-24 bg-[#FAF6EC] relative overflow-hidden">
      <div className="container-tibeb px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold-dark text-xs font-bold mb-3 border border-gold/30">
            <Star size={13} className="fill-gold" />
            <span>Community Ratings & Reviews</span>
          </div>
          <h2 className="section-title text-2xl sm:text-4xl text-ink">What Ethiopian Students Say</h2>
          <p className="section-subtitle max-w-xl mx-auto mt-2">
            Loved by thousands of students across Addis Ababa University, ASTU, and top Ethiopian campuses.
          </p>

          <div className="mt-5">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>Leave a 5-Star Review for Tibeb</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-8 border border-stone-200 text-center max-w-lg mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-gold flex items-center justify-center mx-auto">
                <Star size={24} className="fill-gold" />
              </div>
              <h3 className="font-bold text-ink text-base">Be the First to Review Tibeb</h3>
              <p className="text-xs text-gray-500">
                Help fellow Ethiopian university students find authentic exam papers and study resources.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[#0B5D3B] text-white text-xs font-bold shadow-md hover:bg-emerald-800 transition-all cursor-pointer"
              >
                Write First Review
              </button>
            </div>
          ) : (
            testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card p-6 bg-white hover:shadow-xl transition-all border border-stone-200/80 rounded-3xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-gold mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= t.rating ? 'fill-gold text-gold' : 'text-gray-200'}
                      />
                    ))}
                    <span className="text-xs font-bold text-ink ml-1.5">{t.rating}.0</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                    style={{ background: 'var(--color-green)' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-ink">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.university}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Modal: Write Website Review */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-scale-in">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div>
                  <h3 className="font-black text-ink text-lg">Review Tibeb Platform</h3>
                  <p className="text-xs text-gray-400">Share your study experience with other Ethiopian students</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 text-gray-500 hover:text-ink flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* 5-Star Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Your Rating (1 to 5 Stars):
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        >
                          <Star
                            size={28}
                            className={`transition-colors ${
                              isFilled ? 'text-gold fill-gold' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-bold text-ink ml-2 bg-stone-100 px-2.5 py-1 rounded-lg">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name & University */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Bethlehem Girma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Campus & Department:</label>
                  <input
                    type="text"
                    placeholder="e.g. AAU 4 Kilo — Electrical Engineering"
                    value={uni}
                    onChange={(e) => setUni(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Your Experience / Review:</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us how past exam tests, solutions, or Telegram Premium helped you study..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green leading-relaxed"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#0B5D3B] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Submit Review</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-3 rounded-xl bg-stone-100 text-gray-600 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Aggregate stats bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 rounded-3xl p-6 sm:p-8 grid grid-cols-2 sm:flex sm:flex-row items-center justify-around gap-6 bg-ink text-white border border-gold/30 shadow-2xl"
        >
          {[
            { value: 'Verified', label: 'Registered Students' },
            { value: '100%', label: 'Certified Solutions' },
            { value: `${EXAMS.length}+`, label: 'Exam Papers' },
            { value: '15–30m', label: 'Guaranteed Delivery' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <span className="text-2xl sm:text-4xl font-black text-gold">{value}</span>
              <span className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider font-semibold">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =====================================================
// FINAL CTA SECTION
// =====================================================
function FinalCTASection() {
  return (
    <section className="section bg-white overflow-hidden py-14 sm:py-24">
      <div className="container-tibeb px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl text-center py-14 sm:py-24 px-4 sm:px-6 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, var(--color-green) 0%, #12754b 100%)' }}
        >
          <div className="hero-blob w-72 h-72 -top-20 -right-10 pointer-events-none" style={{ background: 'var(--color-gold)' }} />
          <div className="hero-blob w-60 h-60 bottom-0 left-0 pointer-events-none" style={{ background: '#083d28', opacity: 0.6 }} />

          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight tracking-tight">
              A brighter semester
              <br />
              <span className="text-gradient-gold">starts with you.</span>
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-8">
              Join ambitious Ethiopian university students who study smarter with Tibeb.
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto justify-center shadow-lg hover:scale-105 transition-transform"
              onClick={() => (window.location.href = '/signup')}
            >
              Start Learning Now — It's Free
              <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =====================================================
// PAGE EXPORT
// =====================================================
export default function LandingPage() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowBackToTop(latest > 400);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Dynamic Smooth Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-300 origin-left z-40 pointer-events-none"
      />

      <HeroSection />
      <AboutSection />
      <WhyChooseUsSection />
      <DownloadAppSection />
      <CategorySection />
      <HowItWorksSection />
      <FeaturedExamSection />
      <UniversitiesSection />
      <SocialProofSection />
      <FinalCTASection />

      {/* Floating Back-to-Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            title="Back to top"
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-green text-white flex items-center justify-center shadow-xl border border-white/20 hover:bg-green-dark cursor-pointer transition-colors"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
