'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, FileText, Award, PlayCircle, Clock,
  ChevronRight, Search, Download, CheckCircle, ExternalLink,
  ArrowRight, Zap
} from 'lucide-react';
import { EXAMS, COURSES } from '@/lib/seed-data';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/ui/AuthGuard';
import CertificateCard from '@/components/certificate/CertificateCard';
import { generateWatermarkedExamPDF } from '@/lib/pdf-watermark';
import toast from 'react-hot-toast';

type Tab = 'exams' | 'courses' | 'certificates';

function LibraryContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('exams');
  const [searchQuery, setSearchQuery] = useState('');
  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('tibeb_unlocked_items') || '[]');
        setUnlockedItemIds(stored);
      } catch (e) {
        console.error('Error reading library items:', e);
      }
    }
  }, []);

  // Unlocked exams: strictly items purchased or unlocked by the student
  const unlockedExams = EXAMS.filter(
    e => unlockedItemIds.includes(e.id)
  );

  // Enrolled courses: courses enrolled/unlocked by the student
  const enrolledCourses = COURSES.filter(
    c => unlockedItemIds.includes(c.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="container-tibeb max-w-6xl px-4 py-8 space-y-8 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/dashboard" className="text-xs text-gray-400 hover:text-green">Dashboard</Link>
              <span className="text-xs text-gray-300">/</span>
              <span className="text-xs font-bold text-ink">My Library</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-ink">Student Academic Library</h1>
            <p className="text-xs md:text-sm text-gray-500">Access all your unlocked 20 ETB past tests, certified courses, and graduation awards.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/catalog"
              className="px-4 py-2.5 rounded-xl bg-ink text-white hover:bg-green text-xs font-bold transition-colors"
            >
              Browse Catalog
            </Link>
            <Link
              href="/courses"
              className="px-4 py-2.5 rounded-xl bg-gold text-ink hover:bg-amber-400 text-xs font-bold transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('exams')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'exams'
                ? 'border-green text-green'
                : 'border-transparent text-gray-400 hover:text-ink'
            }`}
          >
            <FileText size={17} />
            <span>Unlocked Tests ({unlockedExams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'courses'
                ? 'border-green text-green'
                : 'border-transparent text-gray-400 hover:text-ink'
            }`}
          >
            <BookOpen size={17} />
            <span>Enrolled Courses ({enrolledCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'certificates'
                ? 'border-green text-green'
                : 'border-transparent text-gray-400 hover:text-ink'
            }`}
          >
            <Award size={17} />
            <span>My Certificates (1)</span>
          </button>
        </div>

        {/* TAB 1: UNLOCKED TESTS */}
        {activeTab === 'exams' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedExams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {exam.university} • {exam.code}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle size={13} /> Unlocked
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-ink mb-1">{exam.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">{exam.department} • {exam.year} {exam.exam_type} Exam</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                    <button
                      onClick={() => {
                        generateWatermarkedExamPDF({ exam, student: user });
                        toast.success('Downloaded Watermarked Exam PDF! 📄');
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Download exam with student security watermark"
                    >
                      <Download size={13} /> PDF
                    </button>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/exams/${exam.id}`}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/exams/${exam.id}/take`}
                        className="px-4 py-1.5 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <Zap size={14} /> Take Test Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ENROLLED COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course, idx) => (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-ink text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                        {course.university}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {idx === 0 ? '75% Progress' : '40% Progress'}
                      </span>
                    </div>

                    <h3 className="font-black text-lg text-ink mb-2">{course.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4">{course.subtitle}</p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-4">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: idx === 0 ? '75%' : '40%' }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/courses/${course.id}/certificate`}
                      className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
                    >
                      <Award size={14} /> Certificate
                    </Link>

                    <Link
                      href={`/courses/${course.id}/learn`}
                      className="px-4 py-2 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <PlayCircle size={15} /> Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full md:w-80 flex-shrink-0">
                <CertificateCard
                  compact
                  recipientName={user?.name || 'Biruk Tadesse'}
                  courseTitle="Applied Mathematics I"
                  university="Addis Ababa University"
                  issueDate="October 19, 2026"
                  certId="TIBEB-AAU-2026-9041"
                />
              </div>

              <div className="flex-1 space-y-3">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  Issued on October 19, 2026
                </span>
                <h3 className="text-xl font-black text-ink">
                  Applied Mathematics I Completion Award
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Verified certificate awarded to <strong>{user?.name || 'Biruk Tadesse'}</strong> for successfully mastering the AAU Computer Science Applied Math examination syllabus.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/courses/course-001/certificate"
                    className="px-4 py-2.5 rounded-xl bg-gold hover:bg-amber-400 text-ink text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Award size={15} /> View & Print Certificate
                  </Link>
                  <Link
                    href="/verify/TIBEB-AAU-2026-9041"
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink size={14} /> Verify Credential
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <AuthGuard>
      <LibraryContent />
    </AuthGuard>
  );
}
