'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell, CheckCircle2, ArrowLeft, Zap, Award, BookOpen,
  Clock, Check, Trash2, Trophy, Eye, X, Wallet, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/ui/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import {
  TibebNotification,
  getStoredNotifications,
  markAllNotificationsAsRead,
  clearUserNotifications,
  markNotificationAsRead
} from '@/lib/notification-store';

function NotificationsContent() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<TibebNotification[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'withdrawal' | 'exam' | 'leaderboard'>('all');
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const loadNotifications = () => {
    const list = getStoredNotifications(user?.id);
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    const handleUpdate = () => loadNotifications();
    window.addEventListener('tibeb_notifications_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('tibeb_notifications_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user?.id]);

  const markAllAsRead = () => {
    markAllNotificationsAsRead(user?.id);
    loadNotifications();
    toast.success('All notifications marked as read');
  };

  const clearAll = () => {
    clearUserNotifications(user?.id);
    loadNotifications();
    toast.success('Notifications cleared');
  };

  const filtered = notifications.filter(n => {
    if (selectedFilter === 'all') return true;
    return n.type === selectedFilter;
  });

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
              className="text-xs font-bold text-green hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Check size={13} /> Mark all read
            </button>
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Bell size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-ink">Notifications & Payout Proofs</h1>
                <p className="text-xs text-gray-400">Updates on new exams, cash withdrawals, and competition rankings.</p>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
              {[
                { key: 'all', label: 'All' },
                { key: 'withdrawal', label: 'Payouts' },
                { key: 'exam', label: 'Exams' },
                { key: 'leaderboard', label: 'Rankings' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setSelectedFilter(f.key as any)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedFilter === f.key ? 'bg-white text-ink shadow-xs' : 'text-gray-500 hover:text-ink'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs space-y-2">
                <Bell size={28} className="mx-auto text-gray-300" />
                <p className="font-bold text-ink text-sm">No notifications yet</p>
                <p>When new exams are published, cash withdrawals are transferred, or your competition rank updates, alerts appear here.</p>
              </div>
            ) : (
              filtered.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all block ${
                    notif.read
                      ? 'bg-white border-gray-100 hover:border-gray-200'
                      : 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                      )}
                      <div className="flex items-center gap-1.5">
                        {notif.type === 'withdrawal' && <Wallet size={14} className="text-emerald-700" />}
                        {notif.type === 'exam' && <BookOpen size={14} className="text-blue-600" />}
                        {notif.type === 'leaderboard' && <Trophy size={14} className="text-amber-600" />}
                        <h4 className="font-bold text-ink text-sm">
                          {notif.title}
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 ml-4 leading-relaxed">{notif.message}</p>

                  {/* If Payout Transfer Screenshot is attached, render view thumbnail */}
                  {notif.imageUrl && (
                    <div className="mt-3 ml-4 p-3 rounded-2xl bg-white border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={notif.imageUrl}
                            alt="Payout Transfer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-black text-ink block">Official Payout Transfer Proof</span>
                          <span className="text-[10px] text-emerald-700 font-bold">Verified by Admin Biruk (099721895)</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomImage(notif.imageUrl || null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#0B5D3B] text-white font-extrabold text-xs hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>View Transfer Screenshot</span>
                      </button>
                    </div>
                  )}

                  {notif.link && (
                    <div className="mt-2 ml-4">
                      <Link
                        href={notif.link}
                        className="text-xs font-bold text-[#0B5D3B] hover:underline inline-flex items-center gap-1"
                      >
                        Open Details →
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transfer Screenshot Zoom Modal */}
        {zoomImage && (
          <div
            onClick={() => setZoomImage(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
          >
            <div className="relative max-w-2xl max-h-[90vh] bg-transparent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomImage}
                alt="Transfer Receipt Proof"
                className="max-h-[85vh] w-auto mx-auto rounded-3xl shadow-2xl object-contain border border-white/20"
              />
              <button
                type="button"
                onClick={() => setZoomImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
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
