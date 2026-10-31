'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock, LogIn, UserPlus, BookOpen, Zap, ArrowRight, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  /** Message to show on the login wall. Defaults to a generic one. */
  message?: string;
  /** Whether the access restriction is about purchasing (buy/checkout) vs viewing */
  reason?: 'purchase' | 'access';
}

export default function AuthGuard({ children, message, reason = 'access' }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-muted flex items-center justify-center animate-pulse">
            <BookOpen size={22} className="text-green" />
          </div>
          <p className="text-sm text-gray-400 font-medium">Loading your account…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const isPurchase = reason === 'purchase';
    const returnUrl = encodeURIComponent(pathname);

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-16 relative">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-green via-emerald-400 to-gold" />

            <div className="p-8 text-center space-y-6">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-muted mx-auto">
                <Lock size={28} className="text-green" />
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-2xl font-black text-ink mb-2">
                  {isPurchase ? 'Sign in to Purchase' : 'Sign in to Access'}
                </h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {message || (
                    isPurchase
                      ? 'You need a Tibeb account to buy exam papers and courses. Unlock genuine past exams with verified solutions.'
                      : 'This content is for registered Tibeb students. Create your free account and start studying smarter.'
                  )}
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 gap-2.5 text-left">
                {[
                  { icon: Zap, text: 'Unlock 20 ETB past exam papers with answers' },
                  { icon: BookOpen, text: 'Access certified courses & study materials' },
                  { icon: Shield, text: 'Pay securely via Telebirr or CBE' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="w-7 h-7 rounded-lg bg-green-muted flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-green" />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="space-y-3">
                <Link
                  href={`/login?return=${returnUrl}`}
                  id="auth-guard-login-btn"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-green/20 transition-all active:scale-95"
                >
                  <LogIn size={17} />
                  Sign In to My Account
                </Link>

                <Link
                  href={`/signup?return=${returnUrl}`}
                  id="auth-guard-signup-btn"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-ink text-ink hover:bg-ink hover:text-white font-bold text-sm transition-all active:scale-95"
                >
                  <UserPlus size={17} />
                  Create Free Account
                </Link>
              </div>

              {/* Back link */}
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-green transition-colors"
              >
                Browse free catalog first
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Trust note */}
          <p className="text-center text-xs text-gray-400 mt-5">
            🔒 100% secure · Used by 10,000+ Ethiopian students · Free to join
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
