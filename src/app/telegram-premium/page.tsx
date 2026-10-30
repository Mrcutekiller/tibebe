'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap, Check, Star, Shield, ArrowRight, Smartphone,
  CheckCircle, Sparkles, Send, HelpCircle, Flame, Clock, Award, Lock
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { TELEGRAM_PREMIUM_PLANS } from '@/lib/seed-data';
import { getLocalSettings } from '@/lib/settings-store';
import { getStoredTelegramOrders, type TelegramOrder } from '@/lib/telegram-orders-store';
import toast from 'react-hot-toast';

export default function TelegramPremiumPage() {
  const { t, locale } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('tg-6m');
  const [telegramUsername, setTelegramUsername] = useState<string>('');

  const settings = getLocalSettings();
  const plans = (settings.telegram_premium_plans && settings.telegram_premium_plans.length > 0)
    ? settings.telegram_premium_plans.map(p => ({
        id: p.id,
        duration: p.label,
        months: p.months,
        price: p.price,
        original_price: Math.round(p.price * 1.25),
        discount_percent: 20,
        badge: p.popular ? 'Best Value' : undefined,
        popular: p.popular,
        description: `Official Telegram Premium for ${p.label}. Delivered directly to your @username.`,
      }))
    : TELEGRAM_PREMIUM_PLANS;

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];
  const [studentOrders, setStudentOrders] = useState<TelegramOrder[]>([]);

  useEffect(() => {
    if (user) {
      const all = getStoredTelegramOrders();
      setStudentOrders(all.filter(o => o.userId === user.id));
    }
  }, [user]);

  const handleProceedToPayment = () => {
    let cleanHandle = telegramUsername.trim().replace(/^@/, '');
    if (!cleanHandle) {
      toast.error('Please enter your Telegram @username for delivery!');
      return;
    }
    if (!/^[a-zA-Z0-9_]{5,32}$/.test(cleanHandle)) {
      toast.error('Invalid Telegram username. Must be 5-32 characters (letters, numbers, underscores).');
      return;
    }
    const fullHandle = `@${cleanHandle}`;

    if (!user) {
      router.push(`/signup?redirect=${encodeURIComponent(`/checkout?item=${selectedPlan.id}&type=telegram&username=${fullHandle}`)}`);
      return;
    }

    // Direct to checkout with plan and handle
    router.push(`/checkout?item=${selectedPlan.id}&type=telegram&username=${encodeURIComponent(fullHandle)}`);
  };

  const perks = [
    {
      title: '4 GB File Uploads',
      desc: 'Send large university PDF textbooks, recorded video lectures, and project source files up to 4 GB each (double the free 2 GB limit).',
      badge: '4 GB',
      icon: '📁'
    },
    {
      title: 'Fastest Download Speeds',
      desc: 'Download videos, slides, and files at maximum possible speed with zero bandwidth throttling on Ethio Telecom 4G/5G and WiFi.',
      badge: 'Max Speed',
      icon: '⚡'
    },
    {
      title: 'Voice-to-Text Transcription',
      desc: 'Instantly convert incoming voice messages and audio memos into readable text with a single tap. Ideal for noisy libraries.',
      badge: 'Transcribe',
      icon: '🎙️'
    },
    {
      title: 'Exclusive Star Badge & Emojis',
      desc: 'Get the prestigious Telegram Star badge next to your name and unlock thousands of exclusive animated emojis and custom reactions.',
      badge: 'Star ⭐',
      icon: '⭐'
    },
    {
      title: 'Zero Ads Anywhere',
      desc: 'Enjoy a 100% clean, advertisement-free experience across all public Ethiopian university and departmental channels.',
      badge: 'Ad-Free',
      icon: '🚫'
    },
    {
      title: 'Double Limits: 1000 Channels',
      desc: 'Follow up to 1,000 channels, create 20 chat folders with 200 chats each, pin 10 chats, and save up to 400 favorite GIFs.',
      badge: '2x Limits',
      icon: '🚀'
    }
  ];

  const comparisonRows = [
    { feature: 'Maximum File Upload Size', free: '2 GB', premium: '4 GB' },
    { feature: 'Download Speed Limit', free: 'Standard / Throttled', premium: 'Uncapped Maximum Speed' },
    { feature: 'Voice Message Transcription', free: 'Not available', premium: 'Unlimited 1-Tap Transcription' },
    { feature: 'Ads in Public Channels', free: 'Sponsored ads shown', premium: 'Completely Ad-Free' },
    { feature: 'Channels & Groups Limit', free: 'Up to 500', premium: 'Up to 1,000' },
    { feature: 'Chat Folders', free: 'Up to 10 folders', premium: 'Up to 20 folders (200 chats each)' },
    { feature: 'Profile Star Badge', free: 'No badge', premium: 'Official Telegram Star ⭐' },
    { feature: 'Real-Time Chat Translation', free: 'Single messages only', premium: 'Full Auto-Translate on Fly' },
  ];

  const faqs = [
    {
      q: 'How is Telegram Premium activated on my account?',
      a: 'We send Telegram Premium as an official Telegram Gift Link directly to your @username. You simply tap "Accept Gift" in Telegram and your account is upgraded immediately! No password or phone verification required.'
    },
    {
      q: 'Can I pay using Telebirr or CBE Birr?',
      a: 'Yes! Tibeb allows you to pay easily in Ethiopian Birr (ETB) using Telebirr, CBE Birr, Chapa, or your Tibeb student wallet balance. No international Visa or Mastercard needed.'
    },
    {
      q: 'How long does delivery take?',
      a: 'Delivery takes 15 to 30 minutes after payment verification. Our support team gifts the subscription directly to your official Telegram @username.'
    },
    {
      q: 'Is it safe and official?',
      a: '100% safe. We never ask for your Telegram password or SMS codes. We only need your public @username to send the official Telegram Premium gift.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EC]">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#0B5D3B] via-[#083d28] to-[#12202B] text-white pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E0A526_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="container-tibeb max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-gold text-xs font-bold mb-5 border border-white/15 backdrop-blur-md">
            <Sparkles size={14} className="text-gold" />
            Official Telegram Premium • Instant Ethiopian Birr (ETB) Delivery
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
            Unlock <span className="text-gradient-gold">Telegram Premium</span> <br className="hidden sm:inline" />
            in Ethiopia with Telebirr
          </h1>

          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            No international credit card needed. Pay with Telebirr or CBE Birr and get Telegram Premium delivered directly to your Telegram @username in minutes.
          </p>

          {/* Quick Stats Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-xs text-white/90 bg-white/10 px-6 py-3 rounded-2xl border border-white/15 backdrop-blur-md">
            <span className="flex items-center gap-1.5 font-semibold">
              <Check size={14} className="text-emerald-400" /> 100% Safe Official Gifts
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Check size={14} className="text-emerald-400" /> Fast 15min – 30min Delivery
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Check size={14} className="text-emerald-400" /> Telebirr & CBE Accepted
            </span>
          </div>
        </div>
      </section>

      {/* Main Order Form & Plan Selector OR Locked Gate */}
      <section className="container-tibeb max-w-5xl px-4 -mt-8 relative z-20 mb-20">
        {false ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-gold mx-auto flex items-center justify-center border border-amber-200 shadow-sm">
              <Lock size={32} className="text-gold" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#0B5D3B] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Members-Only Pricing & Plans
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">
                Sign In to View Telegram Premium Plans
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                Official Telegram Premium subscription plans, discounted Ethiopian Birr rates, and 15–30 minute instant delivery are reserved for registered users. Please sign in or register to choose your plan.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Link
                href="/signup?redirect=/telegram-premium"
                className="px-6 py-3.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
              >
                Sign Up to View Plans <ArrowRight size={16} />
              </Link>
              <Link
                href="/login?redirect=/telegram-premium"
                className="px-6 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-ink font-bold text-sm transition-all text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : authLoading ? (
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 text-center max-w-md mx-auto">
            <div className="w-10 h-10 border-4 border-[#0B5D3B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-bold">Verifying student account...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-100">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-green">Step 1: Choose Your Plan</span>
              <h2 className="text-2xl sm:text-3xl font-black text-ink mt-1">Select Subscription Duration</h2>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const monthlyRate = Math.round(plan.price / plan.months);

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-green bg-emerald-50/60 shadow-xl ring-2 ring-green/20 scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300 bg-white shadow-sm'
                    }`}
                  >
                    {plan.badge && (
                      <span className={`absolute -top-3 right-4 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                        plan.popular ? 'bg-gold text-ink' : 'bg-emerald-600 text-white'
                      }`}>
                        {plan.badge}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">👑</span>
                          <span className="font-bold text-ink text-lg">{plan.duration}</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isSelected ? 'bg-green border-green text-white shadow-sm' : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-green">{plan.price.toLocaleString()} ETB</span>
                          <span className="text-xs text-gray-400 line-through">{plan.original_price.toLocaleString()} ETB</span>
                        </div>
                        <span className="text-xs text-emerald-800 font-semibold block mt-0.5">
                          ~{monthlyRate.toLocaleString()} ETB / month
                        </span>
                        {plan.months === 12 && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                            <span>+74 ⭐ FREE Stars Included</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed mb-4">
                        {plan.description}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl text-center">
                      Save {plan.discount_percent}% vs standard rate
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Step 2: Handle Input & Checkout Bar */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-gray-200 max-w-2xl mx-auto">
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                  Step 2: Enter Your Telegram @Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">@</span>
                  <input
                    type="text"
                    placeholder="your_telegram_username"
                    value={telegramUsername.replace(/^@/, '')}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green focus:border-green text-sm font-semibold bg-white"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  We will send the official Telegram Premium gift link directly to this username. No password needed!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 block">Total Due:</span>
                  <span className="text-2xl font-black text-green">{selectedPlan.price} ETB</span>
                  <span className="text-xs text-gray-400 ml-1.5 font-medium">({selectedPlan.duration})</span>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-green hover:bg-emerald-800 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Zap size={16} className="text-gold fill-gold" />
                  Pay with Telebirr & Activate
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Benefits Grid */}
      <section className="container-tibeb max-w-5xl px-4 py-12 mb-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-green">Premium Privileges</span>
          <h2 className="text-2xl sm:text-4xl font-black text-ink mt-1">Why Ethiopian Students Love Telegram Premium</h2>
          <p className="text-xs sm:text-base text-gray-500 max-w-xl mx-auto mt-2">
            Telegram is Ethiopia's #1 educational network. Premium superpowers make studying, downloading, and communicating effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk, i) => (
            <div key={i} className="card p-6 bg-white hover:shadow-xl transition-all border border-gray-100 rounded-3xl">
              <div className="text-3xl mb-3">{perk.icon}</div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-ink text-lg">{perk.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {perk.badge}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mt-2">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Free vs Premium Comparison Table */}
      <section className="container-tibeb max-w-4xl px-4 py-12 mb-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-green">Feature Comparison</span>
          <h2 className="text-2xl sm:text-4xl font-black text-ink mt-1">Free vs Telegram Premium</h2>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100">
          <div className="grid grid-cols-3 bg-slate-900 text-white p-4 font-bold text-xs sm:text-sm">
            <div>Feature</div>
            <div className="text-center text-gray-400">Telegram Free</div>
            <div className="text-center text-gold">Telegram Premium ⭐</div>
          </div>
          <div className="divide-y divide-gray-100">
            {comparisonRows.map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-4 text-xs sm:text-sm items-center hover:bg-slate-50 transition-colors">
                <div className="font-semibold text-ink">{row.feature}</div>
                <div className="text-center text-gray-500">{row.free}</div>
                <div className="text-center font-bold text-emerald-700 bg-emerald-50/60 py-1 rounded-lg">
                  {row.premium}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works 3 Steps */}
      <section className="bg-ink text-white py-16 px-4 mb-20">
        <div className="container-tibeb max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Simple 3-Step Process</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">How You Receive Your Premium</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="w-10 h-10 rounded-full bg-gold text-ink font-black flex items-center justify-center text-base mb-4">
                1
              </span>
              <h3 className="font-bold text-lg mb-2">Select Your Plan</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Choose 1, 3, 6, or 12 months, and enter your Telegram @username.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="w-10 h-10 rounded-full bg-gold text-ink font-black flex items-center justify-center text-base mb-4">
                2
              </span>
              <h3 className="font-bold text-lg mb-2">Pay in ETB</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Complete payment instantly using Telebirr, CBE Birr, or Chapa.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="w-10 h-10 rounded-full bg-gold text-ink font-black flex items-center justify-center text-base mb-4">
                3
              </span>
              <h3 className="font-bold text-lg mb-2">Delivered in 15 – 30 Mins</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Open Telegram, accept your official Gift, and enjoy your Telegram Premium status!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container-tibeb max-w-3xl px-4 py-8 mb-24">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-green">Questions & Answers</span>
          <h2 className="text-2xl sm:text-3xl font-black text-ink mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card p-6 bg-white border border-gray-100 rounded-2xl">
              <h3 className="font-bold text-ink text-base mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-green flex-shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-full bg-green text-white font-bold text-sm uppercase tracking-wider hover:bg-emerald-800 transition shadow-lg cursor-pointer"
          >
            Order Telegram Premium Now →
          </button>
        </div>
      </section>
    </div>
  );
}
