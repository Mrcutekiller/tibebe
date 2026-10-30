'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  GraduationCap, Clock, BookOpen, Star, Award, CheckCircle,
  PlayCircle, ChevronRight, ChevronDown, ShieldCheck, Share2,
  Lock, ArrowRight, UserCheck, FileText, Check
} from 'lucide-react';
import { COURSES } from '@/lib/seed-data';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { StarRating } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const params = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const course = COURSES.find(c => c.id === courseId) || COURSES[0];

  const [openModule, setOpenModule] = useState<number>(0);

  if (!course) return notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-tibeb px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-green transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/courses" className="hover:text-green transition-colors">Courses</Link>
            <ChevronRight size={12} />
            <span className="text-ink font-medium truncate">{course.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-ink text-white py-12 px-4 border-b border-white/10">
        <div className="container-tibeb max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-green text-white text-xs font-bold px-3 py-1 rounded-full">
                  {course.university} Curriculum
                </span>
                <span className="bg-white/10 text-gold text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-white/15">
                  <Award size={14} /> Certificate Included
                </span>
                <span className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-full">
                  {course.level} Level
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {course.title}
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {course.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <StarRating rating={course.rating} reviews={course.reviews} size={14} />
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck size={16} className="text-gold" />
                  <span>{course.students.toLocaleString()} students enrolled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-gold" />
                  <span>{course.duration} total duration</span>
                </div>
              </div>
            </div>

            {/* Quick Action Card on Right */}
            <div className="bg-white text-ink rounded-3xl p-6 shadow-2xl border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black text-green">ETB {course.price}</span>
                </div>

                <div className="space-y-2.5 mb-6">
                  {user ? (
                    <Link
                      href={`/courses/${course.id}/learn`}
                      className="w-full py-3.5 px-4 rounded-2xl bg-green hover:bg-emerald-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-green/25 transition-all active:scale-95"
                    >
                      <PlayCircle size={18} />
                      Start Learning Now
                    </Link>
                  ) : (
                    <Link
                      href={`/login?return=${encodeURIComponent(`/courses/${course.id}/learn`)}`}
                      className="w-full py-3.5 px-4 rounded-2xl bg-green hover:bg-emerald-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-green/25 transition-all active:scale-95"
                    >
                      <Lock size={16} />
                      Sign in to Start Course
                    </Link>
                  )}

                  <Link
                    href={`/checkout?item=${course.id}&type=course`}
                    className="w-full py-3 px-4 rounded-2xl border-2 border-green text-green hover:bg-green hover:text-white font-bold text-xs text-center flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    Enroll & Unlock Lifetime Access
                  </Link>

                  <Link
                    href={`/courses/${course.id}/certificate`}
                    className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs text-center flex items-center justify-center gap-2 transition-all border border-amber-200"
                  >
                    <Award size={16} className="text-amber-600" />
                    Preview Completion Certificate
                  </Link>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green" /> Full lifetime access
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green" /> Official Tibeb verified certificate
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green" /> Practice quizzes with verified answers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="container-tibeb max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Syllabus & Learning Outcomes */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
              <h2 className="text-xl font-black text-ink mb-4">What You Will Master</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.learning_outcomes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Check size={16} className="text-green flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Syllabus */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-ink">Course Curriculum</h2>
                  <p className="text-xs text-gray-500">
                    {course.modules.length} modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} interactive lessons
                  </p>
                </div>
                <button
                  onClick={() => setOpenModule(prev => prev === -1 ? 0 : -1)}
                  className="text-xs font-bold text-green hover:underline"
                >
                  {openModule === -1 ? 'Expand First' : 'Collapse All'}
                </button>
              </div>

              <div className="space-y-4">
                {course.modules.map((module, mIdx) => {
                  const isOpen = openModule === mIdx;
                  return (
                    <div
                      key={module.id}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenModule(isOpen ? -1 : mIdx)}
                        className="w-full p-4 md:p-5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {mIdx + 1}
                          </span>
                          <div>
                            <h3 className="font-bold text-sm md:text-base text-ink">{module.title}</h3>
                            <p className="text-xs text-gray-400">{module.lessons.length} lessons & quiz</p>
                          </div>
                        </div>
                        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white divide-y divide-slate-100">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                {lesson.type === 'video' ? (
                                  <PlayCircle size={16} className="text-emerald-600" />
                                ) : lesson.type === 'quiz' ? (
                                  <Award size={16} className="text-amber-600" />
                                ) : (
                                  <FileText size={16} className="text-blue-600" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                                    {lesson.title}
                                    {!user && (
                                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80 inline-flex items-center gap-1">
                                        <Lock size={10} /> Login to play
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[11px] text-slate-400">{lesson.summary}</p>
                                </div>
                              </div>
                              <span className="text-xs text-slate-400 font-mono">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Certificate Spotlight */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-amber-900 font-black text-lg mb-2">
                <Award size={22} className="text-amber-600" />
                Verified Certificate of Completion
              </div>
              <p className="text-xs md:text-sm text-amber-900/80 mb-6 leading-relaxed">
                Upon finishing all video lessons and passing the practice assessment, you will automatically be issued this official certificate featuring your full name, completion date, and verified QR code.
              </p>

              <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300/60 bg-white p-2 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/certificate-template.png"
                  alt="Certificate of Completion"
                  className="w-full h-auto rounded-xl object-contain"
                />
              </div>

              <div className="flex items-center justify-end">
                <Link
                  href={`/courses/${course.id}/certificate`}
                  className="px-5 py-2.5 rounded-xl bg-ink text-white hover:bg-green text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  Generate My Certificate <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Instructor & Requirements */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
              <h3 className="font-bold text-sm text-ink mb-4">Course Instructor</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-green flex items-center justify-center text-white font-bold text-lg">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm text-ink">{course.instructor}</p>
                  <p className="text-xs text-gray-400">{course.university} Department of {course.department}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Curated by top Ethiopian university lecturers and academic prize winners. Aligned with current national examination benchmarks.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 space-y-4">
              <h3 className="font-bold text-sm text-ink">Related Past Exams (20 ETB)</h3>
              <p className="text-xs text-gray-500">
                Boost your preparation with actual past exam papers:
              </p>
              <Link
                href="/exams/exam-001"
                className="block p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-800">Applied Mathematics I</span>
                  <span className="text-xs font-bold text-green">20 ETB</span>
                </div>
                <p className="text-[11px] text-slate-400">MATH 101 • AAU Final Exam</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
