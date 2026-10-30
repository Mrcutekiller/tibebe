'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  GraduationCap, MapPin, BookOpen, FileText, CheckCircle,
  Star, Award, ArrowRight, Zap, Filter, Search, ChevronRight,
  ShieldCheck, Share2
} from 'lucide-react';
import { UNIVERSITIES, EXAMS, COURSES } from '@/lib/seed-data';
import { useLanguage } from '@/context/LanguageContext';
import { StarRating } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function UniversityDetailPage() {
  const params = useParams();
  const { t } = useLanguage();
  const uniId = Array.isArray(params.id) ? params.id[0] : params.id;

  const university = UNIVERSITIES.find(u => u.id.toLowerCase() === uniId?.toLowerCase()) || UNIVERSITIES[0];
  const [activeTab, setActiveTab] = useState<'exams' | 'courses' | 'departments'>('exams');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [examTypeFilter, setExamTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!university) return notFound();

  // University specific data
  const uniExams = EXAMS.filter(e => e.university_id === university.id || e.university.toLowerCase() === university.short.toLowerCase());
  // Fallback to general exams if none specifically tagged so user has a rich experience
  const displayedExams = uniExams.length > 0 ? uniExams : EXAMS;

  const uniCourses = COURSES.filter(c => c.university.toLowerCase() === university.short.toLowerCase());
  const displayedCourses = uniCourses.length > 0 ? uniCourses : COURSES;

  // Filter exams
  const filteredExams = displayedExams.filter(exam => {
    if (selectedDept !== 'all' && exam.department !== selectedDept) return false;
    if (examTypeFilter !== 'all' && exam.exam_type !== examTypeFilter) return false;
    if (searchQuery && !exam.title.toLowerCase().includes(searchQuery.toLowerCase()) && !exam.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${university.name} Past Exams & Courses | Tibeb`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-tibeb px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-green transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/universities" className="hover:text-green transition-colors">Universities</Link>
            <ChevronRight size={12} />
            <span className="text-ink font-medium">{university.short}</span>
          </nav>
        </div>
      </div>

      {/* University Hero Header */}
      <div
        className="relative text-white py-14 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${university.color} 0%, #12202B 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="container-tibeb max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center font-black text-3xl md:text-4xl text-white shadow-2xl border-2 border-white/20 flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
              >
                {university.short}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-2 border border-white/15">
                  <MapPin size={12} className="text-gold" /> {university.location}, Ethiopia
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                  {university.name}
                </h1>
                <p className="text-white/70 text-sm mt-1">
                  Official verified university curriculum • {university.departments.length} Faculties & Departments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/15 transition-all"
              >
                <Share2 size={15} /> Share Campus
              </button>
              <Link
                href="/catalog"
                className="px-5 py-2.5 rounded-2xl bg-gold hover:bg-amber-400 text-ink text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <BookOpen size={15} /> Full Catalog
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            <div>
              <p className="text-2xl font-black text-gold">{displayedExams.length}+</p>
              <p className="text-xs text-white/70">Verified Past Exams (20 ETB)</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{displayedCourses.length}</p>
              <p className="text-xs text-white/70">Curriculum Video Courses</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">100%</p>
              <p className="text-xs text-white/70">Verified Answer Keys</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">4.8 / 5.0</p>
              <p className="text-xs text-white/70">Student Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Navigation Tabs */}
      <div className="container-tibeb max-w-6xl px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'exams'
                ? 'border-green text-green'
                : 'border-transparent text-gray-500 hover:text-ink'
            }`}
          >
            <FileText size={16} /> Past Exams ({displayedExams.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'courses'
                ? 'border-green text-green'
                : 'border-transparent text-gray-500 hover:text-ink'
            }`}
          >
            <Award size={16} /> University Courses ({displayedCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'departments'
                ? 'border-green text-green'
                : 'border-transparent text-gray-500 hover:text-ink'
            }`}
          >
            <GraduationCap size={16} /> Departments ({university.departments.length})
          </button>
        </div>

        {/* TAB 1: EXAMS */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search course title or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green"
                />
              </div>

              {/* Department pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
                <button
                  onClick={() => setSelectedDept('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedDept === 'all'
                      ? 'bg-green text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Depts
                </button>
                {university.departments.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedDept === dept.name
                        ? 'bg-green text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {dept.name}
                  </button>
                ))}
              </div>

              {/* Exam type pills */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {['all', 'Final', 'Mid'].map(type => (
                  <button
                    key={type}
                    onClick={() => setExamTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      examTypeFilter === type
                        ? 'bg-ink text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Exams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredExams.map(exam => (
                <div
                  key={exam.id}
                  className="bg-white rounded-3xl p-5 shadow-card hover:shadow-card-hover border border-gray-100 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="badge-gray badge text-xs">{exam.code}</span>
                      <span className="badge-gold badge text-xs">{exam.exam_type} {exam.year}</span>
                    </div>

                    <h3 className="font-bold text-ink text-base group-hover:text-green transition-colors leading-snug mb-1">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">{exam.department} • Semester {exam.semester}</p>

                    <div className="space-y-1.5 mb-5 bg-gray-50 p-3 rounded-2xl text-xs">
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Original Pages:</span>
                        <strong className="text-ink">{exam.pages} Pages</strong>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Answer Key:</span>
                        <strong className="text-green flex items-center gap-1">
                          <CheckCircle size={12} /> 100% Verified
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Explanations:</span>
                        <strong className="text-ink">{exam.has_explanations ? 'Step-by-step' : 'Included'}</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-3">
                      <div>
                        <span className="text-lg font-black text-green">20 ETB</span>
                        <span className="text-[10px] text-gray-400 block">Instant Access</span>
                      </div>
                      <StarRating rating={exam.rating} reviews={exam.reviews} size={12} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/exams/${exam.id}`}
                        className="py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-bold text-ink hover:bg-gray-50 text-center transition-all"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/exams/${exam.id}/take`}
                        className="py-2.5 px-3 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <Zap size={13} /> Take Test
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredExams.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <FileText size={40} className="text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-ink text-base mb-1">No exams match your filter</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                  Try clearing your search query or choosing another department.
                </p>
                <button
                  onClick={() => { setSelectedDept('all'); setExamTypeFilter('all'); setSearchQuery(''); }}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-ink text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COURSES */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map(course => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-gray-100 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 bg-gradient-to-tr from-slate-900 to-emerald-950 p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs font-bold relative z-10">
                      <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white">
                        {course.level}
                      </span>
                      <span className="bg-gold text-ink px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Award size={12} /> Certificate
                      </span>
                    </div>

                    <div className="relative z-10">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gold block">
                        {course.department}
                      </span>
                      <h3 className="font-black text-white text-lg leading-snug group-hover:text-gold transition-colors">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {course.subtitle}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pb-4 border-b border-gray-100">
                      <span>Instructor: <strong className="text-ink">{course.instructor}</strong></span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-ink">{course.price} ETB</span>
                  </div>
                  <span className="text-xs font-bold text-green flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    Explore Syllabus <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* TAB 3: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {university.departments.map(dept => {
              const deptExams = displayedExams.filter(e => e.department === dept.name);
              return (
                <div
                  key={dept.id}
                  onClick={() => { setSelectedDept(dept.name); setActiveTab('exams'); }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-green/40 shadow-sm hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-muted text-green flex items-center justify-center font-bold text-sm">
                      <GraduationCap size={20} />
                    </div>
                    <span className="text-xs font-bold text-green group-hover:underline flex items-center gap-1">
                      View Exams →
                    </span>
                  </div>
                  <h4 className="font-bold text-ink text-base mb-1">{dept.name}</h4>
                  <p className="text-xs text-gray-400">
                    {deptExams.length > 0 ? `${deptExams.length} past exam papers available` : 'Curriculum available'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
