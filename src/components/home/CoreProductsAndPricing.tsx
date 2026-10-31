'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Send, Check, ArrowRight, ShieldCheck,
  Zap, Sparkles, CreditCard, HelpCircle, FileText,
  Clock, RotateCcw, Smartphone
} from 'lucide-react';
import { getLocalSettings, type TibebSettings } from '@/lib/settings-store';
import { EXAMS } from '@/lib/seed-data';

export default function CoreProductsAndPricing() {
  const [settings, setSettings] = useState<TibebSettings>(getLocalSettings());

  useEffect(() => {
    const update = () => setSettings(getLocalSettings());
    window.addEventListener('tibeb_settings_updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('tibeb_settings_updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const freeSampleExam = EXAMS.find(e => e.is_free_sample) || EXAMS[0];

  return (
    <div className="space-y-20 py-12 sm:py-16">
      {/* =========================================================================
          1. TWO BIG PRODUCT CARDS UNDER HERO
         ========================================================================= */}
      <section className="container-tibeb max-w-5xl px-4">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#0B5D3B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            What We Offer
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
            Choose Your Learning & Digital Service
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
            Affordable university exam prep with step-by-step solutions, and fast Telegram Premium subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* CARD 1: EXAM TESTS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 hover:border-[#0B5D3B] transition-all shadow-sm hover:shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center font-bold text-xl">
                  <BookOpen size={24} />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0B5D3B] text-xs font-black border border-emerald-200">
                  {settings.exam_price_etb} ETB / Test
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-ink group-hover:text-[#0B5D3B] transition-colors">
                  University Exam Tests
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  Authentic past midterms and final examinations from AAU, ASTU, Unity, and top universities with verified step-by-step solutions.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Curated questions with full answer keys & explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Save for offline dorm study (0 mobile data waste)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Pay effortlessly via Telebirr, Chapa, or CBE</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 space-y-3">
              <Link
                href="/catalog"
                className="w-full py-3.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Tests</span>
                <ArrowRight size={15} />
              </Link>
              {freeSampleExam && (
                <Link
                  href={`/exams/${freeSampleExam.id}`}
                  className="w-full py-2 text-center text-xs font-bold text-emerald-800 hover:text-emerald-950 block hover:underline"
                >
                  Or try a free sample test without paying →
                </Link>
              )}
            </div>
          </div>

          {/* CARD 2: TELEGRAM PREMIUM */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-100 hover:border-gold transition-all shadow-sm hover:shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-gold flex items-center justify-center font-bold text-xl">
                  <Send size={24} />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-black border border-amber-200">
                  From {settings.telegram_premium_plans[0]?.price || 490} ETB
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-ink group-hover:text-amber-700 transition-colors">
                  Telegram Premium Subscriptions
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  Fast, official Telegram Premium delivery to your @username. No international credit card needed — pay easily with Telebirr.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-gold flex-shrink-0" />
                  <span>4 GB uploads, fastest download speeds, voice-to-text</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-gold flex-shrink-0" />
                  <span>No password required — 100% safe gift delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-gold flex-shrink-0" />
                  <span>Usually activated within 30 minutes</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 space-y-3">
              <Link
                href="/telegram-premium"
                className="w-full py-3.5 rounded-2xl bg-[#E0A526] hover:bg-amber-500 text-ink font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Get Telegram Premium</span>
                <ArrowRight size={15} />
              </Link>
              <span className="text-[11px] text-gray-400 text-center block">
                1, 3, 6, and 12-month plans available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PRICING SECTION
         ========================================================================= */}
      <section className="container-tibeb max-w-5xl px-4">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#0B5D3B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Simple Pricing
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
            Transparent Pricing in Ethiopian Birr (ETB)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            No hidden fees. Every price is straightforward, student-friendly, and payable via Telebirr or Chapa.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Single Exam */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between text-center">
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Single Exam Test</span>
              <div className="text-3xl font-black text-ink">
                {settings.exam_price_etb} <span className="text-sm font-semibold text-gray-500">ETB</span>
              </div>
              <p className="text-xs text-gray-500">Full questions, answers, and detailed explanations.</p>
            </div>
            <Link
              href="/catalog"
              className="mt-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-ink text-xs font-bold transition-all block"
            >
              Browse Catalog
            </Link>
          </div>

          {/* Telegram Plans */}
          {settings.telegram_premium_plans.slice(0, 3).map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between text-center relative ${
                plan.popular ? 'border-2 border-gold shadow-md' : 'border-stone-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gold text-ink text-[10px] font-black uppercase tracking-wider shadow-xs">
                  Most Popular
                </span>
              )}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Telegram {plan.label}
                </span>
                <div className="text-3xl font-black text-ink">
                  {plan.price} <span className="text-sm font-semibold text-gray-500">ETB</span>
                </div>
                <p className="text-xs text-gray-500">
                  {plan.savings ? `${plan.savings} • ` : ''}Delivered to your @username
                </p>
              </div>
              <Link
                href="/telegram-premium"
                className={`mt-6 py-2.5 rounded-xl text-xs font-bold transition-all block ${
                  plan.popular ? 'bg-gold hover:bg-amber-400 text-ink' : 'bg-stone-100 hover:bg-stone-200 text-ink'
                }`}
              >
                Choose Plan
              </Link>
            </div>
          ))}
        </div>

        {/* Visible Refund Policy Summary */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0B5D3B] flex items-center justify-center flex-shrink-0 mt-0.5">
              <RotateCcw size={16} />
            </div>
            <div>
              <span className="font-bold text-ink block">Tibeb Refund Policy:</span>
              <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">
                {settings.refund_policy_summary}
              </p>
            </div>
          </div>
          <Link
            href="/refund"
            className="flex-shrink-0 text-xs font-bold text-[#0B5D3B] hover:underline whitespace-nowrap"
          >
            Read full policy →
          </Link>
        </div>
      </section>

      {/* =========================================================================
          3. HOW TO PAY STEPS (Telebirr & Chapa)
         ========================================================================= */}
      <section className="container-tibeb max-w-5xl px-4">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#0B5D3B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Payment Guide
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
            How to Pay with Telebirr or Chapa
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            3 simple steps to unlock exam tests or activate your Telegram Premium subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center font-black mx-auto text-base">
              1
            </div>
            <h3 className="font-bold text-ink text-sm">Select Your Test or Plan</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Browse your university exam bank or choose a 1, 3, 6, or 12-month Telegram Premium plan.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-gold flex items-center justify-center font-black mx-auto text-base">
              2
            </div>
            <h3 className="font-bold text-ink text-sm">Confirm with Telebirr / Chapa</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Open your Telebirr app or pay securely through Chapa gateway. CBE transfer receipt upload is also supported.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black mx-auto text-base">
              3
            </div>
            <h3 className="font-bold text-ink text-sm">Instant Access & Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Exam tests unlock immediately in your Library. Telegram Premium gifts are sent directly to your handle usually within 30 minutes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

