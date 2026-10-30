'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Download, Printer, ExternalLink, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/ui/AuthGuard';
import CertificateCard from '@/components/certificate/CertificateCard';

function CertificatesContent() {
  const { user } = useAuth();
  const studentName = user?.name || 'Biruk Tadesse';

  const certificates = [
    {
      id: 'cert-01',
      title: 'Applied Mathematics I',
      code: 'MATH 101',
      university: 'Addis Ababa University',
      courseId: 'course-001',
      issueDate: 'October 19, 2026',
      certId: 'TIBEB-AAU-2026-9041'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-xs text-gray-400 hover:text-green">Dashboard</Link>
            <span className="text-xs text-gray-300">/</span>
            <span className="text-xs font-bold text-ink">Certificates</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-ink">My Verified Certificates</h1>
          <p className="text-xs md:text-sm text-gray-500">Official digital credentials earned upon course and exam completion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <CertificateCard
                  compact
                  recipientName={studentName}
                  courseTitle={cert.title}
                  university={cert.university}
                  issueDate={cert.issueDate}
                  certId={cert.certId}
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Verified & Active
                    </span>
                    <span className="text-xs text-gray-400 font-mono">ID: {cert.certId}</span>
                  </div>
                  <h3 className="font-black text-lg text-ink">{cert.title}</h3>
                  <p className="text-xs text-gray-500">{cert.university} • Issued {cert.issueDate}</p>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-100 flex items-center justify-between mt-4">
                <Link
                  href={`/verify/${cert.certId}`}
                  className="text-xs font-bold text-gray-500 hover:text-green flex items-center gap-1"
                >
                  <ExternalLink size={13} /> Verify
                </Link>

                <Link
                  href={`/courses/${cert.courseId}/certificate`}
                  className="px-4 py-2 rounded-xl bg-gold hover:bg-amber-400 text-ink text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Award size={15} /> Open Certificate
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <AuthGuard>
      <CertificatesContent />
    </AuthGuard>
  );
}
