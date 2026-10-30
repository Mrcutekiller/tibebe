'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle, Search, ChevronDown, MessageSquare,
  ShieldCheck, Smartphone, Award, BookOpen, Send, RotateCcw
} from 'lucide-react';

interface FaqItem {
  category: 'payments' | 'delivery' | 'offline' | 'refunds' | 'telegram';
  q: string;
  a: string;
}

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'payments',
      q: 'How do I pay using Telebirr, Chapa, or CBE Birr?',
      a: 'You can pay instantly via Telebirr or CBE Birr through our integrated Chapa payment gateway, or by sending a direct Telebirr/CBE transfer and uploading the confirmation receipt. Once confirmed on the server, your exam test unlocks immediately in your Library.'
    },
    {
      category: 'delivery',
      q: 'How fast is delivery for exam tests and Telegram Premium?',
      a: 'Exam tests unlock immediately upon payment confirmation. Telegram Premium subscriptions are delivered as official gifts to your Telegram @username usually within 30 minutes (always under 2 hours).'
    },
    {
      category: 'offline',
      q: 'How does Dorm Offline Mode work without internet?',
      a: 'Install Tibeb as a Progressive Web App (PWA) on your phone or laptop. Any exam test you unlock has a "Save for Offline Dorm Study" toggle. Once saved, all pages, solutions, and explanations remain fully readable even if your dormitory Wi-Fi goes down and you have zero mobile data.'
    },
    {
      category: 'refunds',
      q: 'What is your refund policy if something goes wrong?',
      a: 'We offer a 100% money-back guarantee. If an unlocked past exam has missing questions, unreadable scans, or incorrect solutions, submit a report within 24 hours for a full refund. For Telegram Premium, if your gift is not delivered within 2 hours, we will immediately refund your payment back to your Telebirr or bank account.'
    },
    {
      category: 'telegram',
      q: 'Is Telegram Premium safe? Do I need to give my password?',
      a: 'It is 100% safe. We NEVER ask for your password, phone number SMS code, or login credentials. We only need your public Telegram @username. The subscription is activated using Telegram\'s official in-app Gift feature.'
    },
    {
      category: 'payments',
      q: 'What is the price of an exam test?',
      a: 'Standard past exam papers with full questions, answers, and explanations cost 20 ETB each. We also offer free sample tests so you can inspect question formatting before unlocking.'
    },
    {
      category: 'offline',
      q: 'Can I use Tibeb on both my Android phone and laptop?',
      a: 'Yes. Your Tibeb student account syncs across your devices. You can install the PWA on both your Android/iOS phone and your PC.'
    }
  ];

  const filteredFaqs = faqs.filter(item => {
    if (category !== 'all' && item.category !== category) return false;
    if (search && !item.q.toLowerCase().includes(search.toLowerCase()) && !item.a.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-ink text-white py-16 px-4 text-center">
        <div className="container-tibeb max-w-4xl">
          <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Help Center</span>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">Frequently Asked Questions</h1>
          <p className="text-white/70 max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-8">
            Honest, transparent answers on payments, delivery speed, offline dorm study, and Telegram Premium safety.
          </p>

          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search answers (Telebirr, delivery, refunds, offline)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-ink pl-12 pr-4 py-3 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories & FAQs */}
      <section className="container-tibeb max-w-4xl px-4 py-16">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'payments', label: 'Payments (Telebirr/CBE)' },
            { id: 'delivery', label: 'Delivery Time' },
            { id: 'offline', label: 'Offline Dorm Mode' },
            { id: 'refunds', label: 'Refunds & Guarantees' },
            { id: 'telegram', label: 'Telegram Premium Safety' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                category === cat.id
                  ? 'bg-[#0B5D3B] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-ink hover:text-[#0B5D3B] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-[#0B5D3B]' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Banner */}
        <div className="mt-14 bg-white rounded-3xl p-8 border border-gray-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center mx-auto font-black text-xl">
            <MessageSquare size={22} />
          </div>
          <div>
            <h3 className="font-bold text-ink text-base">Still Have Questions?</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Our student support team is active on Telegram daily from 8:00 AM to 11:00 PM.
            </p>
          </div>
          <div>
            <a
              href="https://t.me/tibeb_support"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-sm"
            >
              <Send size={14} />
              <span>Chat with Support on Telegram</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
