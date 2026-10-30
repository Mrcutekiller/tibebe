'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, CheckCircle2, Award, ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';

export default function CertificateVerificationPage() {
  const params = useParams();
  const certId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck size={36} />
        </div>

        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Verified Credential
          </span>
          <h1 className="text-2xl font-black text-ink mt-2">
            Official Tibeb Certificate
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">ID: {certId}</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3.5 text-xs md:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5"><User size={15} /> Student</span>
            <span className="font-bold text-ink">Biruk Tadesse</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5"><BookOpen size={15} /> Course</span>
            <span className="font-bold text-ink">Applied Mathematics I</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5"><Award size={15} /> Institution</span>
            <span className="font-bold text-green">Addis Ababa University</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={15} /> Issue Date</span>
            <span className="font-bold text-ink">October 19, 2026</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-500">Status</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 size={15} /> Authenticated & Valid
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-ink text-white hover:bg-green text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Tibeb Platform
          </Link>
        </div>
      </div>
    </div>
  );
}
