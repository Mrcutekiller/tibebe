'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="container-tibeb max-w-4xl bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink">100% Student Refund Guarantee</h1>
            <p className="text-xs text-gray-400">Our promise to every university student in Ethiopia</p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed mt-6">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">1. Accuracy Guarantee on 20 ETB Exams</h2>
            <p>
              We stand firmly behind the academic quality of our materials. If an exam paper purchased on Tibeb is unreadable, missing pages, or contains substantial mathematical errors in the verified answer key that our team cannot promptly rectify, you are entitled to a full 100% refund or replacement credits.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">2. Course Completion Refund Window</h2>
            <p>
              For certified video courses, you may request a refund within 7 days of purchase provided you have viewed less than 25% of the total course lessons.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">3. Refund Processing Method</h2>
            <p>
              Approved refunds are credited directly back to your original payment source (Telebirr or CBE Birr) within 24 to 48 business hours.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">4. How to Request a Refund</h2>
            <p>
              Simply send your Order ID (found on your payment receipt) and a brief description of the issue to <strong>support@tibeb.et</strong> or reach out on Telegram <strong>@tibeb_support</strong>.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <Link href="/terms" className="text-green hover:underline">← Terms of Service</Link>
          <Link href="/contact" className="text-green hover:underline">Contact Support →</Link>
        </div>
      </div>
    </div>
  );
}
