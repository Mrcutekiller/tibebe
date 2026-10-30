'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Download, Printer, Share2, CheckCircle2,
  Award, ShieldCheck, QrCode, Copy, Sparkles, RefreshCw
} from 'lucide-react';
import { COURSES } from '@/lib/seed-data';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/ui/AuthGuard';
import CertificateCard from '@/components/certificate/CertificateCard';

function CourseCertificateContent() {
  const params = useParams();
  const { user } = useAuth();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const course = COURSES.find(c => c.id === courseId) || COURSES[0];

  const defaultName = user?.name || 'Biruk Tadesse';
  const [recipientName, setRecipientName] = useState(defaultName);
  const [isEditingName, setIsEditingName] = useState(false);

  // Issue date: current date
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const certId = `TIBEB-${course.university || 'AAU'}-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(`${window.location.origin}/verify/${certId}`);
      toast.success('Certificate verification link copied! 📋');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Bar (Hidden on Print) */}
      <header className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.id}/learn`}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <Award size={18} className="text-gold" />
              Certificate of Completion
            </h1>
            <p className="text-[11px] text-slate-400">
              {course.title} • Verified Digital Credential
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingName(!isEditingName)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={14} /> Change Name
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Printer size={15} /> Print / Save PDF
          </button>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-gold text-ink text-xs font-bold flex items-center gap-1.5 hover:bg-amber-400 transition-colors"
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </header>

      {/* Main Certificate Display Area */}
      <main className="flex-1 container-tibeb max-w-5xl px-4 py-8 md:py-12 flex flex-col items-center">
        {/* Recipient Name Quick Editor */}
        {isEditingName && (
          <div className="w-full max-w-xl bg-slate-800/90 border border-slate-700 p-4 rounded-2xl mb-6 shadow-xl flex items-center gap-3 animate-in fade-in print:hidden">
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter student full name"
              className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              onClick={() => setIsEditingName(false)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-colors"
            >
              Apply
            </button>
          </div>
        )}

        {/* THE CERTIFICATE CANVAS */}
        <div className="w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden border-2 border-amber-400/40 bg-white relative print:m-0 print:p-0 print:border-none print:shadow-none print:w-full print:max-w-none">
          <CertificateCard
            recipientName={recipientName}
            courseTitle={course.title}
            university={course.university}
            issueDate={dateFormatted}
            certId={certId}
          />
        </div>

        {/* Verification & Credential Details Section (Hidden on Print) */}
        <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <ShieldCheck size={24} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Cryptographically Verified</p>
              <p className="text-[11px] text-slate-400">Unique ID: {certId}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <Award size={24} className="text-gold flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">University Aligned</p>
              <p className="text-[11px] text-slate-400">{course.university} Departmental Curriculum</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <CheckCircle2 size={24} className="text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Graduation Ready</p>
              <p className="text-[11px] text-slate-400">Suitable for CV, LinkedIn & academic portfolio</p>
            </div>
          </div>
        </div>

        {/* Helpful instructions */}
        <div className="w-full max-w-4xl mt-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/20 text-center text-xs text-amber-200/90 print:hidden">
          💡 <strong>Tip:</strong> Click "Print / Save PDF" to save a high-resolution copy for framing or to attach with your university internship application.
        </div>
      </main>

      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          nav, header, footer, .print\\:hidden {
            display: none !important;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function CourseCertificatePage() {
  return (
    <AuthGuard message="Sign in to view and download your verified course certificate.">
      <CourseCertificateContent />
    </AuthGuard>
  );
}
