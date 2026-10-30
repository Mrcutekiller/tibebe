'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, X, ChevronDown, SlidersHorizontal, FileText, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Chip } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Card';
import { EXAMS, UNIVERSITIES } from '@/lib/seed-data';

type ExamType = 'all' | 'Final' | 'Mid' | 'Class Test' | 'Quiz';
type SortBy = 'newest' | 'popular' | 'price_asc' | 'price_desc';

export default function CatalogPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [examType, setExamType] = useState<ExamType>('all');
  const [selectedUni, setSelectedUni] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('popular');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [customExams, setCustomExams] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tibeb_unlocked_items') || '[]');
      setUnlockedItems(stored);
    } catch {
      setUnlockedItems([]);
    }

    try {
      const custom = JSON.parse(localStorage.getItem('tibeb_custom_exams') || '[]');
      setCustomExams(custom);
    } catch {}
  }, []);

  const selectedUniversity = UNIVERSITIES.find(u => u.id === selectedUni);

  const allAvailableExams = useMemo(() => [...customExams, ...EXAMS], [customExams]);

  // HIDE EMPTY: Only show universities that have uploaded exams
  const activeUniversities = useMemo(() => {
    const uniIdsWithExams = new Set(allAvailableExams.map(e => e.university_id?.toLowerCase()).filter(Boolean));
    return UNIVERSITIES.filter(u => uniIdsWithExams.has(u.id.toLowerCase()));
  }, [allAvailableExams]);

  // HIDE EMPTY: Only show courses that have uploaded exams
  const activeCourses = useMemo(() => {
    const map = new Map<string, string>();
    allAvailableExams.forEach(e => {
      if (e.code) {
        map.set(e.code, `${e.title || e.subject || e.code} (${e.code})`);
      }
    });
    return Array.from(map.entries()).map(([code, label]) => ({ id: code, label }));
  }, [allAvailableExams]);

  // Filter exams
  const filteredExams = useMemo(() => {
    let items = [...allAvailableExams];

    if (selectedUni !== 'all') items = items.filter(e => e.university_id === selectedUni);
    if (selectedDept !== 'all') items = items.filter(e => e.department.toLowerCase().includes(selectedDept.toLowerCase()));
    if (selectedCourse !== 'all') items = items.filter(e => e.code === selectedCourse || e.subject.toLowerCase() === selectedCourse.toLowerCase());
    if (examType !== 'all') items = items.filter(e => e.exam_type === examType);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.subject?.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'newest') items.sort((a, b) => b.year - a.year);
    if (sortBy === 'popular') items.sort((a, b) => b.purchases - a.purchases);
    if (sortBy === 'price_asc') items.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') items.sort((a, b) => b.price - a.price);

    return items;
  }, [selectedUni, selectedDept, examType, searchQuery, sortBy, customExams]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6EC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0B5D3B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF6EC] py-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-gold mx-auto flex items-center justify-center border border-amber-200 shadow-sm">
            <Lock size={32} className="text-gold" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#0B5D3B] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Access Restricted • Sign In Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              Sign In to View Exam Tests & Plans
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              To protect verified Ethiopian university past exams, solutions, and Telegram Premium discount rates, an authenticated account is required. Please sign in or create your free account to access the library.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              href="/signup?redirect=/catalog"
              className="px-6 py-3.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
            >
              Sign Up to Access Tests <ArrowRight size={16} />
            </Link>
            <Link
              href="/login?redirect=/catalog"
              className="px-6 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-ink font-bold text-sm transition-all text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EC]">
      {/* Page header */}
      <div className="bg-ink text-white py-12 px-4">
        <div className="container-tibeb">
          <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Tibeb Exam Bank</span>
          <h1 className="text-3xl font-black mb-2">Ethiopian University Exam Tests</h1>
          <p className="text-white/70 text-sm">
            Authentic 20 ETB past exam papers with step-by-step verified answers and marking criteria.
          </p>
        </div>
      </div>

      <div className="container-tibeb px-4 py-8">
        <div className="flex gap-8">

          {/* ---- Sidebar (desktop) ---- */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20 self-start">
            <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <h3 className="font-bold text-ink mb-4 text-sm uppercase tracking-wider">Filter Exam Tests</h3>

              {/* University Filter */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{t('catalog.filter.university')}</p>
                    <select
                      className="input text-xs"
                      value={selectedUni}
                      onChange={(e) => {
                        setSelectedUni(e.target.value);
                        setSelectedDept('all');
                      }}
                    >
                      <option value="all">All Active Campuses ({activeUniversities.length})</option>
                      {activeUniversities.map((uni) => (
                        <option key={uni.id} value={uni.id}>
                          {uni.name} ({uni.short})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Course / Subject Filter */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Filter by Course</p>
                    <select
                      className="select text-xs w-full"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                      <option value="all">All Active Courses ({activeCourses.length})</option>
                      {activeCourses.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Exam Type */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{t('catalog.filter.examType')}</p>
                    <div className="space-y-1">
                      {(['all', 'Final', 'Mid', 'Class Test', 'Quiz'] as ExamType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setExamType(type)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            examType === type ? 'bg-green-muted text-green font-bold' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {type === 'all' ? 'All Types' : type}
                        </button>
                      ))}
                    </div>
                  </div>
            </div>
          </aside>

          {/* ---- Main content area ---- */}
          <div className="flex-1 min-w-0">

            {/* Search and control bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by subject, code, university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none focus:border-green"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-ink"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>
            </div>

            {/* Quick Course Pills Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
              {[{ id: 'all', label: 'All Courses' }, ...activeCourses].map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCourse === course.id
                      ? 'bg-green text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-green/40 hover:text-green'
                  }`}
                >
                  {course.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            {filteredExams.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-lg mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center mx-auto">
                  <FileText size={28} />
                </div>
                <h3 className="font-black text-ink text-lg">No Exam Papers Published Yet</h3>
                <p className="text-xs text-gray-500">
                  New verified university exam papers and solutions will appear here as soon as they are uploaded and published by the administration.
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredExams.map((exam) => {
                  const isUnlocked = unlockedItems.includes(exam.id) || exam.is_free_sample;
                  const firstImage = exam.images && exam.images.length > 0 ? exam.images[0] : '/test-images/photo_2026-10-23_20-07-33.jpg';

                  return (
                    <Link
                      key={exam.id}
                      href={`/exams/${exam.id}`}
                      className="card p-0 overflow-hidden group block bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-3xl"
                    >
                      {/* 1st Test Paper Preview Banner */}
                      <div className="relative h-52 overflow-hidden bg-slate-900 flex items-center justify-center">
                        {isUnlocked ? (
                          <>
                            <img
                              src={firstImage}
                              alt={`${exam.title} - Page 1`}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                              <CheckCircle size={13} /> Unlocked
                            </div>
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-ink text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                              Page 1 Preview
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={firstImage}
                              alt={`${exam.title} - Locked Preview`}
                              className="w-full h-full object-cover object-top blur-[5px] scale-110 brightness-75 select-none"
                            />
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-2 shadow-lg group-hover:scale-110 transition-all">
                                <Lock size={22} className="text-amber-300" />
                              </div>
                              <span className="text-xs font-black text-white uppercase tracking-wider drop-shadow-md">
                                Locked Exam Paper
                              </span>
                              <span className="text-[11px] text-amber-200 font-semibold mt-1 bg-black/50 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                                20 ETB to Unlock
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Card Content Details */}
                      <div className="p-5">
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span className="badge-gray badge text-xs font-semibold">{exam.university}</span>
                          <span className="badge-gold badge text-xs font-bold">{exam.exam_type}</span>
                          <span className="text-xs text-gray-400 font-medium">{exam.year}</span>
                        </div>

                        <h3 className="font-bold text-ink text-base leading-snug mb-1 group-hover:text-green transition-colors line-clamp-1">
                          {exam.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">{exam.code} • {exam.department}</p>

                        <div className="flex gap-2 text-xs text-gray-500 mb-4 flex-wrap">
                          <span className="flex items-center gap-1"><FileText size={12} className="text-gray-400" /> {exam.pages} pages</span>
                          {exam.has_answers && <span className="text-green flex items-center gap-1 font-medium"><CheckCircle size={12} /> Answers</span>}
                          {exam.has_explanations && <span className="text-green flex items-center gap-1 font-medium"><CheckCircle size={12} /> Solutions</span>}
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <span className="text-xl font-black text-green">
                            {exam.price} ETB
                          </span>

                          {isUnlocked ? (
                            <span className="px-4 py-2 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5">
                              Open Paper →
                            </span>
                          ) : (
                            <span className="px-4 py-2 rounded-xl bg-ink hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5">
                              <Lock size={12} className="text-amber-400" />
                              Unlock (20 ETB)
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 sheet-enter max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-ink text-lg">Filters</h3>
              <button onClick={() => setSidebarOpen(false)} className="btn-icon text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="label">{t('catalog.filter.university')}</p>
                <select className="input" value={selectedUni} onChange={(e) => setSelectedUni(e.target.value)}>
                  <option value="all">All Universities</option>
                  {UNIVERSITIES.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <p className="label">{t('catalog.filter.examType')}</p>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'Final', 'Mid', 'Class Test', 'Quiz'] as ExamType[]).map(type => (
                    <Chip key={type} active={examType === type} onClick={() => setExamType(type)}>
                      {type === 'all' ? 'All' : type}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="btn btn-green w-full mt-6"
              onClick={() => setSidebarOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
