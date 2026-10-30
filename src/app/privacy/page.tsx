'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="container-tibeb max-w-4xl bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-gray-100">
        <h1 className="text-3xl font-black text-ink mb-2">Privacy Policy</h1>
        <p className="text-xs text-gray-400 mb-8">Effective Date: October 2026 • Tibeb Technologies Ethiopia</p>

        <div className="space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">1. Information We Collect</h2>
            <p>
              We collect minimal information necessary to deliver educational services: phone number (used for Ethiopian SMS authentication and account recovery), name, university, department, and course study progress.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">2. Telebirr & Payment Privacy</h2>
            <p>
              We do NOT store your bank account passwords, Telebirr PINs, or financial secrets. All transactions are processed through licensed Ethiopian payment gateways (Telebirr and Chapa) with bank-grade encryption.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">3. Offline Storage & Caching</h2>
            <p>
              Our PWA utilizes local IndexedDB and localStorage to store your unlocked past exam PDFs, notes, and quiz drafts so you can study even when campus Wi-Fi or data connection drops.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-ink">4. Your Rights</h2>
            <p>
              You may request export or deletion of your student account and personal records at any time by contacting privacy@tibeb.et.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <Link href="/terms" className="text-green hover:underline">← Terms of Service</Link>
          <Link href="/refund" className="text-green hover:underline">Refund Policy →</Link>
        </div>
      </div>
    </div>
  );
}
