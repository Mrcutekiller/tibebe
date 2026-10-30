'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye, EyeOff, ChevronRight, Mail,
  Shield, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

function LoginContent() {
  const { t } = useLanguage();
  const { loginWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('redirect') || searchParams.get('return') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 5) {
      setErrorMessage('Password must be at least 5 characters.');
      return;
    }

    setLoading(true);
    const res = await loginWithEmail(email, password);
    setLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'admin') {
        toast.success('Authenticated as Administrator! Redirecting...');
        router.push('/admin');
      } else {
        toast.success(`Welcome back, ${res.user.name}! 👋`);
        router.push(decodeURIComponent(returnTo));
      }
    } else {
      setErrorMessage(res.error || 'Login failed. Please verify your email and password.');
      toast.error('Authentication failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage('');
    const res = await signInWithGoogle();
    if (res?.error) {
      setErrorMessage(res.error);
      toast.error(res.error);
      setGoogleLoading(false);
    }
    // If successful, user is redirected by browser to Google / Supabase
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0B5D3B 0%, #12754b 60%, #083d28 100%)' }}
      >
        <div className="hero-pattern absolute inset-0" />
        <div className="hero-blob w-96 h-96 -top-20 -left-20" style={{ background: 'var(--color-gold)', opacity: 0.12 }} />
        <div className="hero-blob w-80 h-80 bottom-10 right-10" style={{ background: '#083d28', opacity: 0.4 }} />

        <Link href="/" className="relative z-10 inline-flex items-center gap-3 group focus:outline-none" aria-label="Tibeb Home">
          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-transparent.png"
              alt="Tibeb"
              width={48}
              height={48}
              className="w-12 h-12 object-contain drop-shadow-md"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-white font-black text-3xl leading-tight">Tibeb</span>
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">Higher Ed Platform</span>
          </div>
        </Link>

        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-gold text-xs font-bold uppercase tracking-wider mb-6 border border-white/10">
            <Sparkles size={14} /> Unified Academic Access
          </div>

          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Welcome back to
            <br />
            <span className="text-gradient-gold">your academic hub.</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md">
            Sign in with your Google account or email to access university past exams, smart AI notes, and your verified academic library.
          </p>

          <div className="space-y-3.5">
            {[
              'Direct sign in via Google or registered email',
              'Fast access to 2,400+ solved exam papers & solutions',
              'Instant wallet balance for 20 ETB test unlocks',
              'Bank-grade encrypted authentication powered by Supabase',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-white/85 text-sm font-medium">
                <CheckCircle2 size={18} className="text-gold shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-white/60">
          <span>Tibeb Higher Education Platform • Addis Ababa, Ethiopia</span>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 bg-white min-h-screen">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between mb-8 max-w-md w-full mx-auto">
          <Link href="/" className="inline-flex items-center gap-2.5 focus:outline-none" aria-label="Tibeb Home">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-transparent.png"
                alt="Tibeb"
                width={40}
                height={40}
                className="w-10 h-10 object-contain drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-ink leading-none">
                Tibeb
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold mt-0.5">
                Higher Ed Platform
              </span>
            </div>
          </Link>
          <Link href="/signup" className="text-xs font-bold text-green hover:underline">
            Register →
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-ink mb-1.5">{t('auth.login.title')}</h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Access your exams, courses, and certificates with your account.
            </p>
          </div>

          {/* GOOGLE SIGN IN BUTTON (PROMINENT AT TOP) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-bold text-ink cursor-pointer shadow-xs disabled:opacity-50 mb-6 group active:scale-[0.99]"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@aau.edu.et or yourname@gmail.com"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-green focus:ring-2 focus:ring-green/10 rounded-xl text-ink text-sm placeholder:text-gray-400 transition-all outline-none"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Password
                </label>
                <Link href="/reset-password" className="text-xs text-green hover:underline font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-green focus:ring-2 focus:ring-green/10 rounded-xl text-ink text-sm placeholder:text-gray-400 transition-all outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-green focus:ring-green border-gray-300"
                />
                <span className="text-xs text-gray-500 font-medium">Keep me signed in</span>
              </label>

              {email.toLowerCase().includes('admin') && (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  <Shield size={11} /> Admin Mode
                </span>
              )}
            </div>

            <Button
              id="login-btn"
              variant="green"
              size="lg"
              fullWidth
              loading={loading}
              className="py-3.5 text-sm font-bold shadow-md active:scale-[0.98] transition-all cursor-pointer"
            >
              Sign In to Tibeb
              <ChevronRight size={16} />
            </Button>
          </form>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
            {t('auth.login.noAccount')}{' '}
            <Link href="/signup" className="text-green font-bold hover:underline">
              {t('auth.login.signupLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginContent />
    </Suspense>
  );
}
