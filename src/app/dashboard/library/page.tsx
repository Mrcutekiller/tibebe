'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, FileText, Award, PlayCircle, Clock,
  ChevronRight, Search, Download, CheckCircle, ExternalLink,
  ArrowRight, Zap
} from 'lucide-react';
import { EXAMS, COURSES, Exam, Course } from '@/lib/seed-data';
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
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('tibeb_unlocked_items') || '[]');
        setUnlockedItemIds(stored);
      } catch {
        setUnlockedItemIds([]);
      }

      try {
        const custom = JSON.parse(localStorage.getItem('tibeb_custom_exams') || '[]');
        setAllExams([...custom, ...EXAMS]);
      } catch {
        setAllExams([...EXAMS]);
      }

      try {
        const certs = JSON.parse(localStorage.getItem('tibeb_certificates') || '[]');
        setCertificates(certs);
      } catch {
        setCertificates([]);
      }
    }
  }, []);

  // Unlocked exams: strictly items purchased or unlocked by the student
  const unlockedExams = allExams.filter(
    e => unlockedItemIds.includes(e.id)
  );

  // Enrolled courses: courses enrolled/unlocked by the student
  const enrolledCourses = COURSES.filter(
    c => unlockedItemIds.includes(c.id)
  );

  const handleDownloadExamPDF = async (exam: Exam) => {
    toast.loading(`Generating secure watermarked PDF for ${exam.code}...`, { id: 'pdf' });
    try {
      await generateWatermarkedExamPDF({
        exam,
        student: user,
      });
      toast.success(`Downloaded official ${exam.code} examination sheet!`, { id: 'pdf' });
    } catch {
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf' });
    }
  };

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
            <p className="text-xs md:text-sm text-gray-500">Access all your unlocked exam papers, enrolled courses, and verified graduation awards.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/catalog"
              className="px-4 py-2.5 rounded-xl bg-ink text-white hover:bg-[#0B5D3B] text-xs font-bold transition-colors"
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
                ? 'border-[#0B5D3B] text-[#0B5D3B]'
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
                ? 'border-[#0B5D3B] text-[#0B5D3B]'
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
                ? 'border-[#0B5D3B] text-[#0B5D3B]'
                : 'border-transparent text-gray-400 hover:text-ink'
            }`}
          >
            <Award size={17} />
            <span>My Certificates ({certificates.length})</span>
          </button>
        </div>

        {/* TAB 1: UNLOCKED TESTS */}
        {activeTab === 'exams' && (
          <div className="space-y-4">
            {unlockedExams.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center mx-auto">
                  <FileText size={28} />
                </div>
                <h3 className="font-black text-ink text-lg">You haven't bought anything yet</h3>
                <p className="text-xs text-gray-500">
                  Explore verified university exam papers and full solutions. Unlocked tests will appear here.
                </p>
                <div className="pt-2">
                  <Link
                    href="/catalog"
                    className="px-5 py-2.5 rounded-xl bg-[#0B5D3B] text-white text-xs font-bold shadow-md hover:bg-emerald-800 transition-all inline-flex items-center gap-1.5"
                  >
                    Browse Exams <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
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

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleDownloadExamPDF(exam)}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-ink cursor-pointer"
                      >
                        <Download size={14} /> Download PDF
                      </button>

                      <Link
                        href={`/exams/${exam.id}`}
                        className="px-4 py-2 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        Open Paper →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ENROLLED COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {enrolledCourses.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-gold flex items-center justify-center mx-auto">
                  <BookOpen size={28} />
                </div>
                <h3 className="font-black text-ink text-lg">No Enrolled Courses Yet</h3>
                <p className="text-xs text-gray-500">
                  Enroll in semester bootcamps and lecture courses to master your syllabus and earn certificates.
                </p>
                <div className="pt-2">
                  <Link
                    href="/courses"
                    className="px-5 py-2.5 rounded-xl bg-gold text-[#12202B] text-xs font-black shadow-md hover:bg-amber-400 transition-all inline-flex items-center gap-1.5"
                  >
                    Explore Courses <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-base text-ink mb-1">{course.title}</h3>
                      <p className="text-xs text-gray-500 mb-3">{course.department} • {course.instructor}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href={`/courses/${course.id}/learn`}
                        className="px-4 py-2 rounded-xl bg-[#0B5D3B] text-white text-xs font-bold"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-4">
            {certificates.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center mx-auto">
                  <Award size={28} />
                </div>
                <h3 className="font-black text-ink text-lg">No Certificates Earned Yet</h3>
                <p className="text-xs text-gray-500">
                  Complete accredited course modules to earn official verified certificates signed with QR authentication.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert: any) => (
                  <div key={cert.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <CertificateCard
                      compact
                      recipientName={cert.recipient_name || user?.name || 'Student'}
                      courseTitle={cert.title}
                      university="Tibeb Platform"
                      issueDate={cert.issued_at || 'Recently'}
                      certId={cert.certificate_number}
                    />
                  </div>
                ))}
              </div>
            )}
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
