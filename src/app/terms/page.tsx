'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="container-tibeb max-w-4xl bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-gray-100">
        <h1 className="text-3xl font-black text-ink mb-2">Terms of Service</h1>
        <p className="text-xs text-gray-400 mb-8">Last Updated: October 2026 • Tibeb Educational Technologies Ethiopia</p>

        <div className="space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Tibeb via web browser or mobile PWA, you agree to comply with and be bound by these Terms of Service. These terms govern all purchases of past exam papers, video courses, digital formula sheets, and verified certificate credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">2. Academic Purpose & Integrity</h2>
            <p>
              Tibeb materials (including past midterm and final exams) are compiled strictly for academic revision, personal study, and mock testing. Our mission is to promote academic excellence across Ethiopian universities (AAU, JU, BDU, ASTU, and partner institutions). You agree not to distribute or resell proprietary verified solutions outside the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">3. Standard 20 ETB Pricing & Payments</h2>
            <p>
              All past exam papers and practice test sessions are priced at a standard 20 ETB, payable via Telebirr, CBE Birr, or Chapa. Once payment is confirmed, access is immediate and permanent for that item on your student account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">4. Digital Certificate Verification</h2>
            <p>
              Certificates issued upon completing courses are backed by cryptographic validation records accessible publicly at /verify/[id]. Any attempt to forge or alter digital certificate identifiers will result in permanent account termination and notification to university registrars.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">5. Contact & Jurisdiction</h2>
            <p>
              For legal inquiries, contact legal@tibeb.et or visit our office in Addis Ababa, Ethiopia.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <Link href="/privacy" className="text-green hover:underline">Privacy Policy →</Link>
          <Link href="/refund" className="text-green hover:underline">Refund Policy →</Link>
        </div>
      </div>
    </div>
  );
}
