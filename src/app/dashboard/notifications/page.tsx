'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell, CheckCircle2, ArrowLeft, Zap, Award, BookOpen,
  Clock, Check, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/ui/AuthGuard';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'exam' | 'course' | 'system';
  link: string;
}

function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      title: 'New Past Exam Added: AAU Applied Math I (2024)',
      message: 'Verified answer keys and step-by-step mathematical proofs have been published. Ready for 20 ETB practice test mode.',
      time: '15 mins ago',
      read: false,
      type: 'exam',
      link: '/exams/exam-001'
    },
    {
      id: 'notif-2',
      title: 'Certificate Issued & Verified 🎓',
      message: 'Congratulations! Your certificate for Data Structures & Algorithms is now verified on the official public registry.',
      time: '2 hours ago',
      read: false,
      type: 'course',
      link: '/dashboard/certificates'
    },
    {
      id: 'notif-3',
      title: 'Semester Bundles Now 45% Off',
      message: 'Pre-Engineering and Computer Science semester bundles are discounted for final exam season. Save over 130 ETB.',
      time: 'Yesterday',
      read: true,
      type: 'system',
      link: '/bundles'
    },
    {
      id: 'notif-4',
      title: 'Telebirr Instant USSD Update',
      message: 'Telebirr 1-tap checkout is now live for all Ethiopian university campuses.',
      time: '3 days ago',
      read: true,
      type: 'system',
      link: '/how-it-works'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('Notifications cleared');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="container-tibeb max-w-3xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-green transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              className="text-xs font-bold text-green hover:underline flex items-center gap-1"
            >
              <Check size={13} /> Mark all read
            </button>
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Bell size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink">Notifications</h1>
              <p className="text-xs text-gray-400">Updates on new exams, answer keys, and course milestones.</p>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map(notif => (
              <Link
                key={notif.id}
                href={notif.link}
                className={`p-4 rounded-2xl border transition-all block group ${
                  notif.read
                    ? 'bg-white border-gray-100 hover:border-gray-200'
                    : 'bg-emerald-50/40 border-emerald-200/80 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-green flex-shrink-0" />
                    )}
                    <h4 className="font-bold text-ink text-sm group-hover:text-green transition-colors">
                      {notif.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-xs text-gray-500 pl-4 leading-relaxed">
                  {notif.message}
                </p>
              </Link>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Bell size={36} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-semibold text-ink">No notifications</p>
                <p className="text-xs">You are all caught up with your university coursework.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <NotificationsContent />
    </AuthGuard>
  );
}
