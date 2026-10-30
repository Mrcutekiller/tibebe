'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail, Phone, Send, MapPin, MessageSquare,
  Clock, ShieldCheck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { UNIVERSITIES } from '@/lib/seed-data';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [university, setUniversity] = useState('aau');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Message received! Our team will reply within 2 hours.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-ink text-white py-16 px-4 text-center">
        <div className="container-tibeb max-w-4xl">
          <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Student Support</span>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">We are here to help.</h1>
          <p className="text-white/70 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Have questions about past exams, Telebirr payment, or want to contribute materials from your university? Get in touch.
          </p>
        </div>
      </section>

      <section className="container-tibeb max-w-5xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Support Channels Column */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
              <h3 className="font-bold text-ink text-base mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-green" /> Direct Channels
              </h3>
              
              <div className="space-y-4 text-xs text-gray-600">
                <a
                  href="https://t.me/tibeb_support"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50 text-sky-950 hover:bg-sky-100 transition-colors"
                >
                  <Send size={16} className="text-sky-600 mt-0.5" />
                  <div>
                    <strong className="block text-sky-900 font-bold">Official Telegram Support</strong>
                    <span className="text-[11px] text-sky-700">@tibeb_support (Fastest Reply)</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50">
                  <Mail size={16} className="text-green mt-0.5" />
                  <div>
                    <strong className="block text-ink font-bold">Email</strong>
                    <span className="text-[11px] text-gray-500 font-mono">tibebexams@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50">
                  <Phone size={16} className="text-green mt-0.5" />
                  <div>
                    <strong className="block text-ink font-bold">Telebirr / Phone</strong>
                    <span className="text-[11px] text-gray-500 font-mono">099721895 (Biruk)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50">
                  <MapPin size={16} className="text-green mt-0.5" />
                  <div>
                    <strong className="block text-ink font-bold">Addis Ababa Offices</strong>
                    <span className="text-[11px] text-gray-500">Bole Medhanialem & 4 Kilo Campus Hub</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <Clock size={16} className="text-emerald-700" /> Operating Hours
              </div>
              <p className="leading-relaxed">
                Student support operates 7 days a week from <strong>8:00 AM to 10:00 PM (EAT)</strong> during university exam periods.
              </p>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100">
              <h2 className="text-xl font-bold text-ink mb-1">Send us a message</h2>
              <p className="text-xs text-gray-400 mb-6">Our campus support team usually responds in under 2 hours.</p>

              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-ink">Thank you for reaching out!</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    We have logged your ticket. Our academic coordinators will contact you via Telegram or SMS shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setMessage(''); }}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-ink transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1.5">Phone or Telegram Handle *</label>
                      <input
                        type="text"
                        required
                        placeholder="+251 9... or @username"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1.5">Your University</label>
                      <select
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green text-xs bg-white"
                      >
                        {UNIVERSITIES.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.short})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1.5">Subject / Department</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green text-xs bg-white"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="payment">Telebirr / Payment Verification</option>
                        <option value="exam-request">Request Past Exam Paper</option>
                        <option value="contribute">Submit Exam & Earn Royalties</option>
                        <option value="bug">Report Answer Key Correction</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Message / Request Details *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us what course, exam paper, or assistance you need..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-green hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Submit Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
