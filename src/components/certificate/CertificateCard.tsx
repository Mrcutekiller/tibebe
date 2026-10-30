'use client';

import React from 'react';
import { Award, QrCode, ShieldCheck } from 'lucide-react';

interface CertificateProps {
  recipientName: string;
  courseTitle: string;
  university?: string;
  issueDate?: string;
  certId?: string;
  compact?: boolean;
}

export default function CertificateCard({
  recipientName,
  courseTitle,
  university = 'Addis Ababa University',
  issueDate,
  certId = 'TIBEB-AAU-2026-9041',
  compact = false,
}: CertificateProps) {
  const dateStr =
    issueDate ||
    new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  // Dynamic font sizing based on recipient name length so it never overflows or breaks
  const nameLength = recipientName.trim().length;
  const nameSizeClass =
    nameLength > 28
      ? compact
        ? 'text-[11px] sm:text-xs'
        : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'
      : nameLength > 20
      ? compact
        ? 'text-xs sm:text-sm'
        : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
      : compact
      ? 'text-sm sm:text-base'
      : 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl';

  return (
    <div className="relative w-full aspect-[1.414/1] bg-[#FAF6EC] rounded-2xl overflow-hidden select-none shadow-md border-2 border-amber-300/80">
      {/* Official Certificate Background Template */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/certificate-template.png"
        alt="Tibeb Official Certificate of Completion"
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* 1. MASK OVER PRE-BAKED "Name Surname" DUMMY TEXT */}
      {/* Clean matching parchment patch that seamlessly erases the static placeholder */}
      <div
        className="absolute top-[44%] left-[20%] right-[20%] h-[12%] z-10 pointer-events-none rounded-lg"
        style={{
          background: 'radial-gradient(ellipse at center, #FAF6EC 80%, rgba(250,246,236,0.95) 100%)',
        }}
      />

      {/* 2. DYNAMIC STUDENT NAME OVERLAY */}
      <div className="absolute top-[50%] left-[16%] right-[16%] text-center transform -translate-y-1/2 z-20 pointer-events-auto">
        <span
          className={`font-serif italic font-bold tracking-normal text-[#1A1208] drop-shadow-xs transition-all block truncate px-2 ${nameSizeClass}`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          title={recipientName}
        >
          {recipientName}
        </span>
      </div>

      {/* 3. MASK OVER MID-PARAGRAPH TO PLACE ACCREDITED COURSE BADGE */}
      <div
        className="absolute top-[67%] left-[18%] right-[18%] h-[6%] z-10 pointer-events-none rounded-md"
        style={{
          background: 'rgba(250, 246, 236, 0.92)',
        }}
      />

      {/* 4. DYNAMIC COURSE TITLE & UNIVERSITY BADGE */}
      <div className="absolute top-[70%] left-[15%] right-[15%] text-center transform -translate-y-1/2 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300/80 shadow-xs max-w-full">
          <Award size={compact ? 10 : 13} className="text-amber-800 flex-shrink-0" />
          <span
            className={`font-bold text-amber-950 truncate ${
              compact ? 'text-[9px]' : 'text-[11px] sm:text-xs md:text-sm'
            }`}
          >
            {courseTitle} • {university}
          </span>
        </div>
      </div>

      {/* 5. VERIFIED DIGITAL SIGNATURE (Over the SIGNATURE marker) */}
      <div className="absolute top-[78%] left-[28%] text-center transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <span
          className={`font-serif italic font-bold text-slate-800 opacity-90 block leading-none ${
            compact ? 'text-[8px]' : 'text-[11px] sm:text-sm md:text-base'
          }`}
          style={{ fontFamily: "'Playfair Display', cursive" }}
        >
          Dr. Tsegaye K.
        </span>
        <span className={`text-slate-500 font-semibold uppercase tracking-wider block ${compact ? 'text-[6px]' : 'text-[8px] sm:text-[9px]'}`}>
          Academic Dean
        </span>
      </div>

      {/* 6. DYNAMIC DATE OVERLAY (Over the DATE marker) */}
      <div className="absolute top-[78%] right-[28%] text-center transform translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <span
          className={`font-bold text-slate-800 block leading-none ${
            compact ? 'text-[8px]' : 'text-[10px] sm:text-xs md:text-sm'
          }`}
        >
          {dateStr}
        </span>
        <span className={`text-slate-500 font-semibold uppercase tracking-wider block ${compact ? 'text-[6px]' : 'text-[8px] sm:text-[9px]'}`}>
          Authorized Stamp
        </span>
      </div>

      {/* 7. DIGITAL CREDENTIAL QR & VERIFY BADGE */}
      <div
        className={`absolute bottom-3 left-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs rounded-lg border border-amber-300/70 shadow-xs ${
          compact ? 'p-1' : 'p-1.5'
        }`}
      >
        <QrCode size={compact ? 16 : 22} className="text-slate-800 flex-shrink-0" />
        <div className="font-mono text-slate-800 leading-none">
          <span className={`font-bold block text-emerald-800 ${compact ? 'text-[7px]' : 'text-[8px] sm:text-[10px]'}`}>
            {certId}
          </span>
          <span className={`text-gray-500 ${compact ? 'text-[6px]' : 'text-[7px] sm:text-[8px]'}`}>
            tibeb.et/verify
          </span>
        </div>
      </div>
    </div>
  );
}
