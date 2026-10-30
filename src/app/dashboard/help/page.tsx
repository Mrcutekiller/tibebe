'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle, ChevronDown, ChevronUp, MessageCircle,
  Mail, Phone, ExternalLink, BookOpen, FileText,
  CheckCircle, Clock, Shield, Zap, Sparkles
} from 'lucide-react';
import AuthGuard from '@/components/ui/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: 'How do I access an exam after paying?',
    a: 'After successful payment via Telebirr or Chapa, the exam is instantly unlocked in your library. Go to Dashboard → My Library → Unlocked Tests to start your interactive test session.',
  },
  {
    q: 'Why can\'t I see the exam I purchased?',
    a: 'Make sure you are signed in with the same phone number used during checkout. If the problem persists after 5 minutes, contact our support with your order ID (found in Dashboard → Orders).',
  },
  {
    q: 'Can I download the exam as a PDF?',
    a: 'Yes! Once unlocked, open the exam from your Library, then click the Download button on the exam viewer. PDFs are available for offline study.',
  },
  {
    q: 'How do I get my course certificate?',
    a: 'Complete all lessons in the course and score 70% or above on the final quiz. Your certificate will automatically appear in Dashboard → Certificates and can be verified via a public link.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept Telebirr (Ethio Telecom), Chapa (supports CBE Birr, Awash, Dashen, and cards). All transactions are encrypted and refundable within 30 days.',
  },
  {
    q: 'How do I get a refund?',
    a: 'Refund requests are accepted within 30 days of purchase. If you haven\'t accessed more than 30% of the content, you are eligible for a full refund. Email refunds@tibeb.et with your order ID.',
  },
  {
    q: 'Are the exam answers verified?',
    a: 'Yes. All answer keys are reviewed by university faculty and senior teaching assistants before publishing. We maintain a 98.7% accuracy rate across all exam papers.',
  },
  {
    q: 'Can I change my university or department?',
    a: 'Yes. Go to Dashboard → Profile & Settings and update your university, department, and year. Your catalog will update immediately to show relevant exams.',
  },
];

function HelpContent() {
  const { user, walletBalance, payWithWallet } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggle = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  const handlePrioritySupport = () => {
    if (walletBalance < 5) {
      toast.error(`Priority Solution Support requires 5 ETB. Your balance is ${walletBalance} ETB. Please deposit 20 ETB.`);
      return;
    }
    const success = payWithWallet(5, ['priority-support']);
    if (success) {
      toast.success('⚡ 5 ETB paid! 1-on-1 Priority Exam Solver connected! Master Admin notified.', { duration: 5000 });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-xs text-gray-400 hover:text-green">Dashboard</Link>
            <span className="text-xs text-gray-300">/</span>
            <span className="text-xs font-bold text-ink">Help</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-ink">Help Center</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Find answers to common questions or reach out to our support team.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: BookOpen, label: 'My Library', href: '/dashboard/library', color: 'bg-green-muted text-green' },
            { icon: FileText, label: 'My Orders', href: '/dashboard/orders', color: 'bg-gold-muted text-amber-700' },
            { icon: Shield, label: 'Refund Policy', href: '/refund', color: 'bg-blue-50 text-blue-600' },
            { icon: ExternalLink, label: 'Public FAQ', href: '/faq', color: 'bg-slate-100 text-slate-600' },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl ${color} hover:opacity-90 transition-opacity text-center`}
            >
              <Icon size={20} />
              <span className="text-xs font-bold">{label}</span>
            </Link>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
          <div className="p-6 pb-2 border-b border-gray-100">
            <h2 className="font-bold text-ink text-lg flex items-center gap-2">
              <HelpCircle size={20} className="text-green" />
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-sm text-ink">{faq.q}</span>
                  {openFAQ === i
                    ? <ChevronUp size={16} className="text-green flex-shrink-0" />
                    : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFAQ === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-gray-100">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Priority 1-on-1 Solution Support Card (5 ETB) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#12202B] via-[#0B5D3B] to-[#12202B] text-white shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#12202B] font-black flex items-center justify-center shadow-md">
                <Zap size={20} className="fill-[#12202B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base text-white">1-on-1 Priority Exam Solution Support</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-[#12202B]">
                    5 ETB
                  </span>
                </div>
                <p className="text-xs text-emerald-200">Instant direct assistance on difficult university exam questions & proofs.</p>
              </div>
            </div>

            <button
              onClick={handlePrioritySupport}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#12202B] font-black text-xs transition-transform active:scale-95 shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Unlock Priority Solver (5 ETB)</span>
            </button>
          </div>
        </div>

        {/* Contact support */}
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6 md:p-8">
          <h2 className="font-bold text-ink text-lg mb-1">Still need help?</h2>
          <p className="text-sm text-gray-500 mb-6">
            Our support team is available every day from 8 AM – 8 PM (EAT).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: MessageCircle,
                title: 'Live Chat',
                desc: 'Chat with student support team',
                action: 'Start Chat',
                color: 'bg-green text-white',
                onClick: () => toast.success('Live chat is opening…'),
              },
              {
                icon: Mail,
                title: 'Email Us',
                desc: 'tibebexams@gmail.com',
                action: 'Send Email',
                color: 'bg-slate-100 text-ink',
                onClick: () => { window.location.href = 'mailto:tibebexams@gmail.com'; },
              },
              {
                icon: Phone,
                title: 'Telebirr / Phone',
                desc: '099721895 (Biruk)',
                action: 'Call Now',
                color: 'bg-slate-100 text-ink',
                onClick: () => { window.location.href = 'tel:099721895'; },
              },
            ].map(({ icon: Icon, title, desc, action, color, onClick }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 bg-slate-50"
              >
                <div className="w-10 h-10 rounded-xl bg-green-muted flex items-center justify-center">
                  <Icon size={18} className="text-green" />
                </div>
                <div>
                  <p className="font-bold text-sm text-ink">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={onClick}
                  className={`mt-auto py-2 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${color} hover:opacity-90`}
                >
                  {action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Response time notice */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-sm">
          <Clock size={16} className="text-emerald-600 flex-shrink-0" />
          <span className="text-emerald-900 text-xs font-medium">
            Average response time: <strong>under 2 hours</strong> for email, <strong>instant</strong> for live chat during business hours.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <AuthGuard>
      <HelpContent />
    </AuthGuard>
  );
}
