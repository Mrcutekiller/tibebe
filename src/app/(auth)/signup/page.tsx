'use client';

import React, { useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail, Lock, User, GraduationCap, BookOpen,
  ArrowLeft, CheckCircle, ChevronRight, Eye, EyeOff,
  Sparkles, Shield, AlertCircle, Camera, Upload, Phone, Check, Gift
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { UNIVERSITIES } from '@/lib/seed-data';
import { recordReferralSignup } from '@/lib/referral-store';
import toast from 'react-hot-toast';

type WizardStep = 1 | 2 | 3;

const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Postgraduate'];
const GENDERS = ['Male', 'Female', 'Other'];

// Preset avatars if user doesn't want to upload from phone/disk
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
];

function SignupContent() {
  const { t } = useLanguage();
  const { registerUser, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('redirect') || searchParams.get('return') || '/dashboard';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<WizardStep>(1);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Step 1: Account credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState(searchParams.get('ref') || '');

  // Step 2: Personal Profile & Photo
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // Step 3: Academic Profile
  const [universityId, setUniversityId] = useState('aau');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('Year 2');
  const [studentId, setStudentId] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle local image upload to Base64 data URL
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        toast.success('Profile picture attached! 📸');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setErrors({});
    const refCode = referralCodeInput.trim() || searchParams.get('ref') || '';
    if (refCode && typeof window !== 'undefined') {
      localStorage.setItem('tibeb_pending_ref_code', refCode.toUpperCase());
    }
    const res = await signInWithGoogle();
    if (res?.error) {
      setErrors({ form: res.error });
      toast.error(res.error);
      setGoogleLoading(false);
    }
  };

  // Step 1 validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your full name';
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      errs.phone = 'Please enter a valid Ethiopian phone number (e.g. 0911234567)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 validation & submission
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errs: Record<string, string> = {};
    if (!universityId) errs.universityId = 'Please select your university';
    if (!department.trim()) errs.department = 'Please enter your department or major';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    const yearNum = parseInt(year.replace(/\D/g, '')) || 2;
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('251')
      ? '+' + cleanPhone
      : '+251' + (cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone);

    const res = await registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: formattedPhone,
      gender,
      avatar_url: avatarUrl || undefined,
      password: password.trim(),
      university_id: universityId,
      department: department.trim(),
      year: yearNum,
    });

    setLoading(false);

    if (res.success) {
      if (referralCodeInput.trim() && res.user) {
        try {
          recordReferralSignup(referralCodeInput.trim(), {
            id: res.user.id,
            name: res.user.name,
            university: universityId,
            department: department.trim(),
          });
        } catch (refErr) {
          console.warn('Referral signup record error:', refErr);
        }
      }
      toast.success('Registration complete! Welcome to Tibeb 🎉');
      router.push(decodeURIComponent(returnTo));
    } else {
      toast.error(res.error || 'Registration failed');
      setErrors({ form: res.error || 'Registration failed' });
    }
  };

  const selectedUni = UNIVERSITIES.find((u) => u.id === universityId);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0B5D3B 0%, #12754b 60%, #083d28 100%)' }}
      >
        <div className="hero-pattern absolute inset-0" />
        <div className="hero-blob w-80 h-80 -top-20 -right-20" style={{ background: 'var(--color-gold)', opacity: 0.12 }} />
        <div className="hero-blob w-72 h-72 bottom-10 -left-10" style={{ background: '#083d28', opacity: 0.5 }} />

        <Link href="/" className="relative z-10 inline-flex items-center gap-3 group focus:outline-none" aria-label="Tibeb Home">
          <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-transparent.png"
              alt="Tibeb"
              width={44}
              height={44}
              className="w-11 h-11 object-contain drop-shadow-md"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-white font-black text-2xl leading-tight">Tibeb</span>
            <span className="text-gold text-[10px] font-semibold uppercase tracking-widest">Higher Ed Platform</span>
          </div>
        </Link>

        <div className="relative z-10 my-auto py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-gold text-xs font-bold uppercase tracking-wider mb-5 border border-white/10">
            <Sparkles size={14} /> Join 12,000+ Students
          </div>

          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Your semester success
            <br />
            <span className="text-gradient-gold">starts with Tibeb.</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md">
            Create your student profile in 3 simple steps. Get access to past exam papers, AI smart summaries, and verified certifications.
          </p>

          <div className="space-y-3.5">
            {[
              'Step 1: Secure Account & Google Sign In',
              'Step 2: Profile Picture, Phone & Personal Info',
              'Step 3: University, Department & Year Selection',
              'Instant 120 ETB welcome balance credit in wallet',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-gold flex-shrink-0" />
                <span className="text-white/85 text-sm font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats footer */}
        <div className="relative z-10 flex gap-8 pt-6 border-t border-white/10">
          {[
            ['12K+', 'Active Students'],
            ['2,400+', 'Exam Papers'],
            ['18', 'Universities'],
          ].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl font-black text-gold">{val}</div>
              <div className="text-xs text-white/50 uppercase tracking-wide font-semibold">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Multi-step registration form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 bg-white min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between mb-8 max-w-md w-full mx-auto">
          <Link href="/" className="inline-flex items-center gap-2.5 focus:outline-none" aria-label="Tibeb Home">
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-transparent.png"
                alt="Tibeb"
                width={36}
                height={36}
                className="w-9 h-9 object-contain drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-ink leading-none">Tibeb</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold mt-0.5">Higher Ed</span>
            </div>
          </Link>
          <Link href="/login" className="text-xs font-bold text-green hover:underline">
            Sign In →
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* STEP PROGRESS INDICATOR */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className={step >= 1 ? 'text-green' : 'text-gray-400'}>1. Account</span>
              <span className={step >= 2 ? 'text-green' : 'text-gray-400'}>2. Personal</span>
              <span className={step >= 3 ? 'text-green' : 'text-gray-400'}>3. Academic</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-green transition-all duration-300"
                style={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-ink mb-1">
              {step === 1 && 'Create your Account'}
              {step === 2 && 'Personal Information'}
              {step === 3 && 'Academic Profile'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              {step === 1 && 'Step 1 of 3: Set up your email and password'}
              {step === 2 && 'Step 2 of 3: Upload a photo, enter phone number & gender'}
              {step === 3 && 'Step 3 of 3: Select your Ethiopian university and major'}
            </p>
          </div>

          {errors.form && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* =========================================================================
              STEP 1: ACCOUNT CREDENTIALS & GOOGLE SIGN UP
             ========================================================================= */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Referral Code Banner if clicked link */}
              {referralCodeInput && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-[#0B5D3B] text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift size={16} />
                    <span>Referral Code Applied: <strong className="font-mono text-sm">{referralCodeInput}</strong></span>
                  </div>
                  <span className="text-[10px] uppercase font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Auto-Filled
                  </span>
                </div>
              )}

              {/* GOOGLE SIGN UP BUTTON */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-bold text-ink cursor-pointer shadow-xs disabled:opacity-50 group active:scale-[0.99]"
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
                <span>{googleLoading ? 'Connecting to Google...' : 'Sign up with Google'}</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">or register with email</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com or student@aau.edu.et"
                    className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-green focus:ring-2 focus:ring-green/10 rounded-xl text-ink text-sm placeholder:text-gray-400 transition-all outline-none"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Mail size={16} />
                  </div>
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
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
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-green focus:ring-2 focus:ring-green/10 rounded-xl text-ink text-sm placeholder:text-gray-400 transition-all outline-none"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>



              <Button
                variant="green"
                size="lg"
                fullWidth
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="py-3.5 font-bold mt-2 shadow-md cursor-pointer"
              >
                Next: Personal Details
                <ChevronRight size={16} />
              </Button>
            </div>
          )}

          {/* =========================================================================
              STEP 2: PERSONAL DETAILS, PHOTO UPLOAD, PHONE & GENDER
             ========================================================================= */}
          {step === 2 && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green font-bold mb-1 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to account
              </button>

              {/* Profile Photo Upload Section */}
              <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl flex flex-col items-center text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="relative group cursor-pointer mb-3" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-emerald-100 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={36} className="text-emerald-700" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-ink hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Upload size={13} /> Upload Photo
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-2 py-1.5 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Or pick avatar:</span>
                  <div className="flex items-center gap-1.5">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                          avatarUrl === url ? 'border-green ring-2 ring-green/20' : 'border-transparent'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Biruk Tadesse"
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-green focus:ring-2 focus:ring-green/10 rounded-xl text-ink text-sm placeholder:text-gray-400 transition-all outline-none"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Phone Number (for Telebirr / SMS)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09XX XXX XXXX or 07XX XXX XXXX"
                    className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-green focus:ring-2 focus:ring-green/10 rounded-xl text-ink text-sm placeholder:text-gray-400 transition-all outline-none"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Phone size={16} />
                  </div>
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        gender === g
                          ? 'border-green bg-green text-white shadow-xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* REFERRAL CODE (OPTIONAL) - Asked when filling personal details */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Gift size={14} className="text-amber-800" />
                    <span>Classmate Referral Code (Optional)</span>
                  </label>
                  {searchParams.get('ref') ? (
                    <span className="text-[10px] font-black text-[#0B5D3B] bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      ✓ Auto-Filled from Classmate Link
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-semibold">Optional</span>
                  )}
                </div>
                <input
                  type="text"
                  value={referralCodeInput}
                  onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. TIBEB-84F2 (Leave blank if you don't have one)"
                  className="w-full px-4 py-2.5 bg-white border border-amber-200 focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-ink font-mono font-bold text-sm placeholder:text-gray-400 placeholder:font-sans uppercase outline-none"
                />
                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  Did a friend or classmate invite you? Enter their code above. If you don&apos;t have one, that&apos;s totally okay—leave it blank!
                </p>
              </div>

              <Button
                variant="green"
                size="lg"
                fullWidth
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="py-3.5 font-bold mt-2 shadow-md cursor-pointer"
              >
                Next: Academic Profile
                <ChevronRight size={16} />
              </Button>
            </div>
          )}

          {/* =========================================================================
              STEP 3: ACADEMIC PROFILE (UNIVERSITY, DEPARTMENT, YEAR)
             ========================================================================= */}
          {step === 3 && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green font-bold mb-1 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to personal details
              </button>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  University / College
                </label>
                <select
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-green focus:ring-2 focus:ring-green/10 rounded-xl text-ink text-sm transition-all outline-none font-medium cursor-pointer"
                >
                  {UNIVERSITIES.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} ({uni.short})
                    </option>
                  ))}
                </select>
                {selectedUni && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green inline-block" />
                    {selectedUni.location} • {selectedUni.departments.length} departments supported
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Department / Field of Study
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science, Medicine, Civil Engineering, Law"
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-green focus:ring-2 focus:ring-green/10 rounded-xl text-ink text-sm placeholder:text-gray-400 transition-all outline-none"
                />
                {errors.department && (
                  <p className="text-xs text-red-500 mt-1">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Academic Year
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setYear(y)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        year === y
                          ? 'border-green bg-green text-white shadow-xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Student ID Number <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. UGR/1234/14"
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-green focus:ring-2 focus:ring-green/10 rounded-xl text-ink text-sm placeholder:text-gray-400 transition-all outline-none"
                />
              </div>

              <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-green-900 text-xs flex items-center gap-2.5">
                <Shield size={16} className="text-green shrink-0" />
                <span>
                  Your profile and exam unlocks will be securely saved under your student account.
                </span>
              </div>

              <Button
                variant="green"
                size="lg"
                fullWidth
                loading={loading}
                onClick={handleFinalSubmit}
                className="py-3.5 font-bold shadow-md cursor-pointer mt-2"
              >
                Complete Registration & Start Learning
                <ChevronRight size={16} />
              </Button>
            </div>
          )}

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-green font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SignupContent />
    </Suspense>
  );
}
