'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Award, Search, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyIndexPage() {
  const router = useRouter();
  const [certId, setCertId] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = certId.trim();
    if (!cleanId) {
      toast.error('Please enter a certificate ID');
      return;
    }
    router.push(`/verify/${cleanId}`);
  };

  const sampleIds = [
    { id: 'TIB-AAU-2026-9812', name: 'Applied Mathematics Mastery (AAU)' },
    { id: 'TIB-JU-2026-4421', name: 'Data Structures & Algorithms (JU)' },
    { id: 'TIB-BDU-2026-1108', name: 'Engineering Physics (BDU)' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-ink text-white py-16 px-4 text-center">
        <div className="container-tibeb max-w-3xl">
          <div className="w-16 h-16 rounded-3xl bg-gold/20 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
            <Award size={32} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">
            Official Public Registry
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Verify a Tibeb Certificate</h1>
          <p className="text-white/70 max-w-lg mx-auto text-sm leading-relaxed mb-8">
            Validate the authenticity, completion date, and student identity for any certificate issued by Tibeb.
          </p>

          {/* Search Box */}
          <form onSubmit={handleVerify} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. TIB-AAU-2026-9812)..."
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full bg-white text-ink pl-11 pr-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gold hover:bg-amber-400 text-ink font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Verify Now
            </button>
          </form>
        </div>
      </section>

      {/* Try Demo Verification */}
      <section className="container-tibeb max-w-3xl px-4 py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100">
          <h3 className="font-bold text-ink text-base mb-1 flex items-center gap-2">
            <ShieldCheck size={18} className="text-green" /> Quick Verification Samples
          </h3>
          <p className="text-xs text-gray-400 mb-6">
            Click any demo certificate below to view live digital verification credentials and verification badges:
          </p>

          <div className="space-y-3">
            {sampleIds.map(sample => (
              <div
                key={sample.id}
                onClick={() => router.push(`/verify/${sample.id}`)}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 hover:border-green/30 cursor-pointer transition-all group"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-green block">{sample.id}</span>
                  <span className="text-xs text-ink font-semibold">{sample.name}</span>
                </div>
                <span className="text-xs font-bold text-green flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  View Record <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
            <span>Official digital verification powered by Tibeb University Network</span>
            <Link href="/courses" className="font-bold text-green hover:underline">
              Browse Certified Courses →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
