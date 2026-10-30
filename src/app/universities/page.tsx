'use client';

import React from 'react';
import Link from 'next/link';
import { Search, GraduationCap, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { UNIVERSITIES, EXAMS } from '@/lib/seed-data';

export default function UniversitiesPage() {
  const { t } = useLanguage();
  const [search, setSearch] = React.useState('');

  const filtered = UNIVERSITIES.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.short.toLowerCase().includes(search.toLowerCase()) ||
    u.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-ink text-white py-16 px-4">
        <div className="container-tibeb text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Coverage</span>
          <h1 className="text-4xl font-black mb-3">Find your university.</h1>
          <p className="text-white/60 text-base max-w-lg mx-auto mb-8">
            We cover Ethiopia's leading universities with past exam papers, courses, and study guides.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search university…"
              className="input pl-12 py-3 text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container-tibeb px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((uni) => {
            const examCount = EXAMS.filter(e => e.university_id === uni.id).length;
            return (
              <Link
                key={uni.id}
                href={`/universities/${uni.id}`}
                className="card p-6 group block hover:border-2"
                style={{ '--hover-border': uni.color } as React.CSSProperties}
              >
                {/* Logo placeholder */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0"
                    style={{ background: uni.color }}
                  >
                    {uni.short.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-ink text-lg leading-tight">{uni.name}</h2>
                    <p className="text-sm text-gray-400">{uni.location}, Ethiopia</p>
                  </div>
                </div>

                {/* Departments */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {uni.departments.slice(0, 5).map((dep) => (
                    <span key={dep.id} className="badge-gray badge text-xs">{dep.name}</span>
                  ))}
                  {uni.departments.length > 5 && (
                    <span className="badge-gray badge text-xs">+{uni.departments.length - 5}</span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-lg font-black text-green">{examCount}</p>
                      <p className="text-xs text-gray-400">Exams</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-ink">{uni.departments.length}</p>
                      <p className="text-xs text-gray-400">Departments</p>
                    </div>
                  </div>
                  <span
                    className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
                    style={{ color: uni.color }}
                  >
                    Browse <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* More universities coming */}
        <div
          className="mt-10 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200"
        >
          <GraduationCap size={40} className="text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-ink mb-1">15+ more universities coming</h3>
          <p className="text-sm text-gray-400">JIT, Hawassa, Mekelle, Gondar, Dire Dawa, and more. Request your university.</p>
          <Link href="/contact" className="btn btn-outline btn-sm mt-4 inline-flex">
            Request a University
          </Link>
        </div>
      </div>
    </div>
  );
}
