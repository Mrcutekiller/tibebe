'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, CheckCircle2, Zap, Award, Smartphone, ShieldCheck,
  ArrowRight, HelpCircle, GraduationCap, Clock, FileText, Check, ChevronDown
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function HowItWorksPage() {
  // Interactive mini-demo state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const demoQuestion = {
    question: "Evaluate the limit: lim (x → 0) [sin(5x) / (2x)]",
    options: [
      { key: 'A', text: '0' },
      { key: 'B', text: '5/2' },
      { key: 'C', text: '2/5' },
      { key: 'D', text: 'Does not exist' }
    ],
    correct: 'B',
    explanation: 'Using the fundamental calculus limit identity lim (u → 0) sin(u)/u = 1: rewrite as (5/2) * [sin(5x)/(5x)] as x → 0 = (5/2) * 1 = 5/2.'
  };

  const steps = [
    {
      num: '01',
      title: 'Find Your University & Department',
      desc: 'Select your institution (AAU, Jimma, Bahir Dar, ASTU, and more) and department. We curate exams strictly matching your university\'s specific instructors and curriculum.',
      icon: GraduationCap,
      tag: 'Step 1'
    },
    {
      num: '02',
      title: 'Instant 20 ETB Unlock with Telebirr',
      desc: 'No credit cards needed. Unlock full past exam papers, midterm solutions, or practice tests for just 20 ETB using Telebirr or CBE Birr. Access is instant and saved to your account forever.',
      icon: Smartphone,
      tag: 'Step 2'
    },
    {
      num: '03',
      title: 'Practice with Interactive Exam Mode',
      desc: 'Simulate the actual test environment with a timed countdown, instant scoring, step-by-step mathematical working, and question bookmarks.',
      icon: Zap,
      tag: 'Step 3'
    },
    {
      num: '04',
      title: 'Master Courses & Earn Verified Certificates',
      desc: 'Enroll in structured video courses taught by top senior university mentors. Complete coursework and receive a unique, verifiable digital certificate with QR verification.',
      icon: Award,
      tag: 'Step 4'
    }
  ];

  const faqs = [
    {
      q: 'How much does a past exam paper cost?',
      a: 'All past exam papers and interactive practice tests on Tibeb are standard 20 ETB. You can also view free sample questions on every exam without paying.'
    },
    {
      q: 'Which payment methods are accepted in Ethiopia?',
      a: 'We support Telebirr (via direct USSD or app) and Commercial Bank of Ethiopia (CBE / CBE Birr). Payment confirmation takes less than 30 seconds.'
    },
    {
      q: 'Are the answer keys verified?',
      a: 'Yes. Every exam solution is written, cross-verified, and reviewed by university instructors and top-ranking alumni with detailed step-by-step explanations.'
    },
    {
      q: 'Can I access materials offline without internet?',
      a: 'Yes! Tibeb works as a Progressive Web App (PWA). You can install it on your Android or iPhone browser, and downloaded PDF papers or completed exams are cached offline.'
    },
    {
      q: 'How do employers verify my Tibeb course certificate?',
      a: 'Every certificate comes with an immutable Verification ID and a scannable QR code linking to our official public registry at /verify/[id].'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-ink text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E0A526_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="container-tibeb max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-gold text-xs font-bold mb-6 border border-white/15">
            <Zap size={14} className="text-gold fill-gold" />
            Simple, Affordable, Verified Ethiopian Learning
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight leading-tight">
            How Tibeb Works for <br />
            <span className="text-gold">Ethiopian University Students</span>
          </h1>

          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10">
            From your first freshmen calculus exam to graduation, Tibeb gives you authentic past exams, step-by-step solutions, and certified courses in just a few clicks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="px-6 py-3.5 rounded-2xl bg-gold hover:bg-amber-400 text-ink font-bold text-sm shadow-lg transition-all"
            >
              Browse 20 ETB Exams
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Explore Video Courses
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Steps Section */}
      <section className="container-tibeb max-w-6xl px-4 py-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-green mb-2 block">The Workflow</span>
          <h2 className="text-3xl font-black text-ink mb-3">Study in 4 Simple Steps</h2>
          <p className="text-sm text-gray-500">Built specifically for the mobile-first Ethiopian student ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover border border-gray-100 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-gray-200">{step.num}</span>
                    <div className="w-11 h-11 rounded-2xl bg-green-muted text-green flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-green block mb-1">
                    {step.tag}
                  </span>
                  <h3 className="font-bold text-ink text-base mb-2.5 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Live Demo */}
      <section className="bg-white py-20 px-4 border-y border-gray-100">
        <div className="container-tibeb max-w-4xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Try It Right Now</span>
            <h2 className="text-3xl font-black text-ink mb-2">Interactive Test Mode Demo</h2>
            <p className="text-sm text-gray-500">
              Click an option below to experience instant test scoring and verified step-by-step explanations.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green text-white text-xs font-bold">
                  AAU Math 101 Sample
                </span>
                <span className="text-xs text-gray-400">Question 1 of 1</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold bg-amber-100 px-3 py-1 rounded-full">
                <Clock size={13} /> Demo Timer: 00:45
              </div>
            </div>

            <h3 className="font-bold text-ink text-lg mb-6 leading-relaxed">
              {demoQuestion.question}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {demoQuestion.options.map(opt => {
                const isSelected = selectedAnswer === opt.key;
                const isCorrect = opt.key === demoQuestion.correct;
                let btnStyle = 'bg-white border-gray-200 hover:border-green text-ink';

                if (selectedAnswer) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSelectedAnswer(opt.key);
                      setShowExplanation(true);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left font-medium text-sm transition-all ${btnStyle}`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {opt.key}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {selectedAnswer && isCorrect && <CheckCircle2 size={18} className="text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 size={16} />
                  {selectedAnswer === demoQuestion.correct ? 'Correct! Excellent job.' : 'Answer: Option B (5/2)'}
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  <strong className="text-emerald-900">Step-by-Step Working: </strong>
                  {demoQuestion.explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200 text-xs text-gray-500">
              <span>All 2,400+ exams include interactive modes and verified answers.</span>
              <Link href="/catalog" className="font-bold text-green hover:underline flex items-center gap-1">
                Explore Full Catalog →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container-tibeb max-w-4xl px-4 py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-green mb-2 block">Common Questions</span>
          <h2 className="text-3xl font-black text-ink mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-500">Everything you need to know about payments, exams, and certificates.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-ink text-sm sm:text-base hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-green' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-emerald-800 to-green text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-black mb-3">Ready to ace your upcoming exams?</h3>
          <p className="text-white/80 max-w-lg mx-auto text-sm mb-6">
            Join over 12,000 university students across Ethiopia. Find your university and start with free samples today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/catalog"
              className="px-6 py-3.5 rounded-2xl bg-gold hover:bg-amber-400 text-ink font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Start Practicing (20 ETB)
            </Link>
            <Link
              href="/universities"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
            >
              Find Your University
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
