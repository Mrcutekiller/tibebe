'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle, Search, ChevronDown, MessageSquare,
  ShieldCheck, Smartphone, Award, BookOpen, Send
} from 'lucide-react';

interface FaqItem {
  category: 'payments' | 'exams' | 'courses' | 'general';
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
      q: 'How does the 20 ETB payment work with Telebirr?',
      a: 'When you choose Telebirr at checkout, you will either be prompted with the Telebirr web pay QR or a fast USSD push notification directly to your phone. Enter your Telebirr PIN to confirm, and your exam paper unlocks instantly.'
    },
    {
      category: 'payments',
      q: 'Can I pay using CBE Birr or local Ethiopian bank accounts?',
      a: 'Yes! Through our verified payment partner Chapa, we support CBE Birr, Awash Bank, Bank of Abyssinia, Dashen Bank, and all Ethiopian local debit cards.'
    },
    {
      category: 'payments',
      q: 'Do I get a receipt for university reimbursement or proof of purchase?',
      a: 'Yes. Upon completing payment, an official Tibeb Electronic Receipt with unique Order ID and payment timestamp is generated in your dashboard under Orders.'
    },
    {
      category: 'exams',
      q: 'Are the past exam questions and answers 100% verified?',
      a: 'Yes. Every past paper is collected directly from departmental exam archives, and the answer keys are solved step-by-step by top university graduates and lecturers.'
    },
    {
      category: 'exams',
      q: 'What is included in the 20 ETB exam price?',
      a: 'For 20 ETB, you get the complete original exam PDF, full verified answer keys, step-by-step mathematical working, and unlimited interactive practice test sessions with our countdown timer.'
    },
    {
      category: 'exams',
      q: 'My university or department is missing. How can I request it?',
      a: 'You can submit an exam request on our Contact page or via Telegram @tibeb_support. Our campus network adds over 50 new past exams every week during midterm and final seasons.'
    },
    {
      category: 'courses',
      q: 'How do employers verify my Tibeb certificate?',
      a: 'Every completed certificate features a secure cryptographic ID and QR code. Anyone (including employers and university admissions) can verify the certificate by visiting /verify/[id].'
    },
    {
      category: 'courses',
      q: 'Can I download videos and notes for offline studying?',
      a: 'Yes. Since internet in university dormitories can be inconsistent, all notes, summary slides, and exam papers are cached offline in the Tibeb Progressive Web App.'
    },
    {
      category: 'general',
      q: 'How can I become a Tibeb campus contributor or ambassador?',
      a: 'If you have access to verified past papers or excel at tutoring, join our contributor network. Contributors receive royalties for every student who unlocks their study materials.'
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
            Clear answers on payments, past exam accuracy, interactive testing, and certificate verification.
          </p>

          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search answers (e.g. Telebirr, 20 ETB, answers)..."
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
            { id: 'payments', label: 'Telebirr & Payments' },
            { id: 'exams', label: '20 ETB Exams & Solutions' },
            { id: 'courses', label: 'Courses & Certificates' },
            { id: 'general', label: 'General & Campus Network' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                category === cat.id
                  ? 'bg-green text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-ink text-sm sm:text-base hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 flex-shrink-0 ml-4 transition-transform ${isOpen ? 'rotate-180 text-green' : ''}`}
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

        {filteredFaqs.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <HelpCircle size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-ink text-base mb-1">No matching question found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
              Didn't find what you were looking for? Reach out directly to our Ethiopian student support team.
            </p>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-green text-white text-xs font-bold inline-flex items-center gap-2"
            >
              <Send size={13} /> Ask on Telegram
            </Link>
          </div>
        )}

        {/* Telegram Direct Support Box */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-ink text-lg">Still have a question?</h3>
            <p className="text-xs text-gray-500">Chat with a campus coordinator on Telegram right now.</p>
          </div>
          <a
            href="https://t.me/tibeb_support"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all whitespace-nowrap"
          >
            <Send size={15} /> Open @tibeb_support
          </a>
        </div>
      </section>
    </div>
  );
}
