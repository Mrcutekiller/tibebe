'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart, BookOpen, FileText, ShoppingCart, Trash2,
  ArrowLeft, Zap, ChevronRight, Star
} from 'lucide-react';
import { EXAMS, COURSES } from '@/lib/seed-data';
import { StarRating } from '@/components/ui/Badge';
import AuthGuard from '@/components/ui/AuthGuard';
import toast from 'react-hot-toast';

function WishlistContent() {
  // Pre-populated wishlist with sample items
  const [wishlistedExamIds, setWishlistedExamIds] = useState(['exam-001', 'exam-003', 'exam-005']);
  const [wishlistedCourseIds, setWishlistedCourseIds] = useState(['course-001']);
  const [activeTab, setActiveTab] = useState<'exams' | 'courses'>('exams');

  const wishlistedExams = EXAMS.filter(e => wishlistedExamIds.includes(e.id));
  const wishlistedCourses = COURSES.filter(c => wishlistedCourseIds.includes(c.id));

  const removeExam = (id: string) => {
    setWishlistedExamIds(prev => prev.filter(i => i !== id));
    toast.success('Removed from wishlist');
  };

  const removeCourse = (id: string) => {
    setWishlistedCourseIds(prev => prev.filter(i => i !== id));
    toast.success('Removed from wishlist');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-xs text-gray-400 hover:text-green">Dashboard</Link>
            <span className="text-xs text-gray-300">/</span>
            <span className="text-xs font-bold text-ink">Wishlist</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-ink flex items-center gap-3">
                <Heart size={26} className="text-red-400 fill-red-400" />
                My Saved Items
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {wishlistedExams.length + wishlistedCourses.length} item{wishlistedExams.length + wishlistedCourses.length !== 1 ? 's' : ''} saved to your wishlist.
              </p>
            </div>
            <Link
              href="/catalog"
              className="px-4 py-2.5 rounded-xl bg-ink text-white hover:bg-green text-xs font-bold transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('exams')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'exams' ? 'border-green text-green' : 'border-transparent text-gray-400 hover:text-ink'
            }`}
          >
            <FileText size={16} />
            Exam Papers ({wishlistedExams.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'courses' ? 'border-green text-green' : 'border-transparent text-gray-400 hover:text-ink'
            }`}
          >
            <BookOpen size={16} />
            Courses ({wishlistedCourses.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'exams' && (
          <div>
            {wishlistedExams.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-card">
                <Heart size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="font-semibold text-ink">No saved exams yet</p>
                <p className="text-sm text-gray-400 mt-1">Browse the catalog and save exams you want to buy later.</p>
                <Link href="/catalog" className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 rounded-xl bg-green text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition-all">
                  Browse Catalog <ChevronRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistedExams.map(exam => (
                  <div
                    key={exam.id}
                    className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                          {exam.university} • {exam.code}
                        </span>
                        <button
                          onClick={() => removeExam(exam.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <h3 className="font-bold text-base text-ink mb-1">{exam.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{exam.department} • {exam.year} {exam.exam_type}</p>
                      <StarRating rating={exam.rating} reviews={exam.reviews} size={12} />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                      <span className="text-base font-black text-green">20 ETB</span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/exams/${exam.id}`}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
                        >
                          Details
                        </Link>
                        <Link
                          href={`/checkout?item=${exam.id}&type=exam`}
                          className="px-4 py-1.5 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                        >
                          <ShoppingCart size={13} /> Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            {wishlistedCourses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-card">
                <Heart size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="font-semibold text-ink">No saved courses yet</p>
                <p className="text-sm text-gray-400 mt-1">Browse courses and save the ones you are interested in.</p>
                <Link href="/courses" className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 rounded-xl bg-green text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition-all">
                  Explore Courses <ChevronRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistedCourses.map(course => (
                  <div
                    key={course.id}
                    className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-ink text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                          {course.university}
                        </span>
                        <button
                          onClick={() => removeCourse(course.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <h3 className="font-black text-base text-ink mb-1">{course.title}</h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{course.subtitle}</p>
                      <StarRating rating={course.rating} reviews={course.reviews} size={12} />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                      <span className="text-base font-black text-green">ETB {course.price}</span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/courses/${course.id}`}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
                        >
                          Details
                        </Link>
                        <Link
                          href={`/checkout?item=${course.id}&type=course`}
                          className="px-4 py-1.5 rounded-xl bg-gold hover:bg-amber-400 text-ink text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                        >
                          <ShoppingCart size={13} /> Enroll
                        </Link>
                      </div>
                    </div>
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

export default function WishlistPage() {
  return (
    <AuthGuard>
      <WishlistContent />
    </AuthGuard>
  );
}
