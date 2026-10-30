'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Download, Smartphone, Apple, ShieldCheck, CheckCircle2,
  Zap, BookOpen, Trophy, Sparkles, ExternalLink, ArrowRight,
  Info, QrCode, FileText, Check, Copy, Share2, HelpCircle,
  Terminal, Layers, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function DownloadAppPage() {
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios'>('android');
  const [copiedSha, setCopiedSha] = useState(false);

  const sha256Checksum = '4f656aa9992c8a93c68681b2aa35328e817729e20c27896aac75251db483780f';

  const handleCopySha = () => {
    navigator.clipboard.writeText(sha256Checksum);
    setCopiedSha(true);
    toast.success('SHA-256 Checksum copied to clipboard!');
    setTimeout(() => setCopiedSha(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* =========================================================================
            HERO SECTION
           ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#083D28] via-[#0B5D3B] to-[#12202B] text-white p-8 sm:p-12 shadow-2xl text-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 text-gold border border-gold/40 text-xs font-black uppercase tracking-wider">
              <Sparkles size={14} className="text-gold" />
              Official Tibeb Mobile Release • v1.2.0
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Study Anywhere with the Tibeb Mobile App
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl mx-auto">
              Get all Ethiopian university past exams, certified answer keys, smart AI summaries, and monthly cash competitions directly on your phone — fast, lightweight, and offline-ready.
            </p>

            {/* Quick Stats Pill */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-emerald-200">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <ShieldCheck size={15} className="text-emerald-400" />
                100% Virus & Malware Free
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Zap size={15} className="text-gold" />
                Ultra Fast &lt; 10 MB Size
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <BookOpen size={15} className="text-emerald-300" />
                Offline Exam Library
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PLATFORM SELECTOR TABS (ANDROID VS IOS)
           ========================================================================= */}
        <div className="flex items-center justify-center">
          <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2">
            <button
              onClick={() => setActivePlatform('android')}
              className={cn(
                'px-6 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer',
                activePlatform === 'android'
                  ? 'bg-[#0B5D3B] text-white shadow-md'
                  : 'text-gray-600 hover:text-ink'
              )}
            >
              <Smartphone size={18} />
              Android (.APK)
            </button>

            <button
              onClick={() => setActivePlatform('ios')}
              className={cn(
                'px-6 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer',
                activePlatform === 'ios'
                  ? 'bg-[#12202B] text-white shadow-md'
                  : 'text-gray-600 hover:text-ink'
              )}
            >
              <Apple size={18} />
              iOS (iPhone & iPad)
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: ANDROID DOWNLOAD (APK)
           ========================================================================= */}
        {activePlatform === 'android' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Download Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0B5D3B] text-xs font-black">
                  <Smartphone size={14} /> Android Package (APK)
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-ink">
                  Download Tibeb for Android
                </h2>
                
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Install the official Android package file directly without needing the Google Play Store. Enjoy instant page loading, automatic local caching, and seamless Telebirr & CBE Birr verification.
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href="/api/download?type=apk"
                    download="tibeb.apk"
                    className="px-6 py-4 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer text-center"
                  >
                    <Download size={18} />
                    Download APK (v1.2.0)
                  </a>

                  <a
                    href="/api/download?type=apk"
                    download="tibeb-v1.2.0.apk"
                    className="px-5 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-ink font-bold text-xs transition-all flex items-center justify-center gap-2 text-center"
                  >
                    Direct Mirror (83 KB)
                  </a>
                </div>

                <p className="text-[11px] text-gray-400">
                  ⚡ Compatible with Samsung, Xiaomi, Tecno, Infinix, Huawei, and all Android 7.0+ devices.
                </p>
              </div>

              {/* Technical Specs Box */}
              <div className="lg:col-span-5 bg-[#FAF7F0] rounded-2xl p-5 border border-gray-200/60 space-y-3 text-xs">
                <h3 className="font-black text-ink text-sm pb-2 border-b border-gray-200">
                  Package Details & Verification
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Package Name</span>
                  <span className="font-mono font-bold text-ink">com.tibeb.app</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Version</span>
                  <span className="font-mono font-bold text-emerald-700">v1.2.0 (Build 120)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">File Size</span>
                  <span className="font-bold text-ink">83 KB (Instant Install)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Android Requirement</span>
                  <span className="font-bold text-ink">Android 7.0 (Nougat) to Android 14+</span>
                </div>

                <div className="pt-2 border-t border-gray-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 font-bold">SHA-256 Checksum</span>
                    <button
                      onClick={handleCopySha}
                      className="text-[#0B5D3B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSha ? <Check size={11} /> : <Copy size={11} />}
                      {copiedSha ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="font-mono text-[10px] text-gray-400 break-all bg-white p-2 rounded-lg border border-gray-200">
                    {sha256Checksum}
                  </p>
                </div>
              </div>
            </div>

            {/* 3-Step Visual Installation Guide */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 space-y-6">
              <h3 className="text-lg font-black text-ink text-center">
                How to Install the APK on Your Android Device (3 Easy Steps)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Step 1 */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#0B5D3B] text-white font-black text-xs flex items-center justify-center">
                    1
                  </div>
                  <h4 className="font-black text-xs text-ink">1. Download APK</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Tap the <strong>Download APK</strong> button above. When your browser asks <em>&quot;File might be harmful&quot;</em>, tap <strong>Download Anyway</strong>.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#0B5D3B] text-white font-black text-xs flex items-center justify-center">
                    2
                  </div>
                  <h4 className="font-black text-xs text-ink">2. Allow Unknown Apps</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Open your downloaded file or notifications. If prompted, open <strong>Settings</strong> and toggle on <strong>Allow from this source</strong> (Chrome / Files).
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#0B5D3B] text-white font-black text-xs flex items-center justify-center">
                    3
                  </div>
                  <h4 className="font-black text-xs text-ink">3. Tap Install & Open</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Tap <strong>Install</strong>. Once completed, tap <strong>Open</strong> to start accessing exams and your university course competitions instantly!
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: IOS DOWNLOAD (IPHONE & IPAD via omarchy-apple-dev)
           ========================================================================= */}
        {activePlatform === 'ios' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* iOS Hero Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#12202B] text-xs font-black">
                  <Apple size={14} /> Apple iOS (iPhone & iPad)
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-ink">
                  Download Tibeb for iPhone & iPad
                </h2>
                
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Install Tibeb seamlessly on your iPhone or iPad. Built using the open-source{' '}
                  <a
                    href="https://github.com/joshuaswarren/omarchy-apple-dev.git"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0B5D3B] font-bold underline inline-flex items-center gap-0.5"
                  >
                    omarchy-apple-dev <ExternalLink size={11} />
                  </a>{' '}
                  native pipeline for cross-platform iOS compilation without Xcode restrictions.
                </p>

                {/* Primary iOS Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href="/api/download?type=mobileconfig"
                    className="px-6 py-4 rounded-2xl bg-[#12202B] hover:bg-slate-800 text-white font-black text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer text-center"
                  >
                    <Apple size={18} />
                    1-Tap Install iOS Profile
                  </a>

                  <a
                    href="/api/download?type=ipa"
                    download="tibeb.ipa"
                    className="px-5 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-ink font-bold text-xs transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <Download size={15} />
                    Download .IPA Package (v1.2.0)
                  </a>
                </div>

                {/* Important iOS Steps Notice */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
                  <div className="font-black flex items-center gap-2 text-amber-950">
                    <Info size={14} className="text-amber-600" />
                    When installing on iPhone or iPad:
                  </div>
                  <p className="leading-relaxed text-[11px] text-amber-800">
                    1. Tap <strong>1-Tap Install iOS Profile</strong> above and tap <strong>Allow</strong> when Safari asks to download.<br />
                    2. Open your iPhone <strong>Settings</strong> app → tap <strong>&quot;Profile Downloaded&quot;</strong> near the top.<br />
                    3. Tap <strong>Install</strong> in the top-right corner, enter your passcode, and tap <strong>Done</strong>!
                  </p>
                </div>

                <p className="text-[11px] text-gray-400">
                  🍏 Works on all iPhones running iOS 14.0 or newer. Fullscreen native experience with zero address bar.
                </p>
              </div>

              {/* iOS Toolchain Info Box */}
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-black text-ink text-sm">
                    omarchy-apple-dev Pipeline
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">
                    Open Source
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Toolchain Repo</span>
                  <a
                    href="https://github.com/joshuaswarren/omarchy-apple-dev.git"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] font-bold text-[#0B5D3B] hover:underline flex items-center gap-1"
                  >
                    omarchy-apple-dev <ExternalLink size={10} />
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Bundle Identifier</span>
                  <span className="font-mono font-bold text-ink">com.tibeb.app.ios</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Install Methods</span>
                  <span className="font-bold text-slate-800">MobileConfig, IPA, PWA</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Sideloaders Supported</span>
                  <span className="font-bold text-ink">AltStore, Sideloadly, Scarlet</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <strong>Developer Terminal Command:</strong>
                  <code className="block font-mono text-[10px] text-emerald-800 bg-slate-100 p-1.5 rounded">
                    pymobiledevice3 apps install tibeb.ipa
                  </code>
                </div>
              </div>
            </div>

            {/* iOS Installation Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Option A: Safari Add to Home Screen (Recommended for iOS) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center">
                    ★
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-ink">Method 1: Instant Safari Add to Home Screen</h3>
                    <p className="text-xs text-gray-500">Zero file downloads, instant native app icon</p>
                  </div>
                </div>

                <ol className="space-y-3 text-xs text-gray-600 pt-2 border-t border-gray-100 list-decimal list-inside">
                  <li className="leading-relaxed">
                    Open Safari on your iPhone and visit <strong>tibebexams.com</strong>.
                  </li>
                  <li className="leading-relaxed">
                    Tap the <strong>Share</strong> button at the bottom of the screen (the square icon with an arrow pointing up).
                  </li>
                  <li className="leading-relaxed">
                    Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
                  </li>
                  <li className="leading-relaxed">
                    Tap <strong>Add</strong> in the top right corner. The Tibeb app icon is now on your iPhone home screen!
                  </li>
                </ol>
              </div>

              {/* Option B: Sideloading via IPA / AltStore */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0B5D3B] font-black text-sm flex items-center justify-center">
                    <Terminal size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-ink">Method 2: Sideload IPA via AltStore / Scarlet</h3>
                    <p className="text-xs text-gray-500">For advanced users using the omarchy-apple-dev build</p>
                  </div>
                </div>

                <ol className="space-y-3 text-xs text-gray-600 pt-2 border-t border-gray-100 list-decimal list-inside">
                  <li className="leading-relaxed">
                    Download the <strong>tibeb.ipa</strong> file from the button above.
                  </li>
                  <li className="leading-relaxed">
                    Open your sideloading manager (such as <strong>AltStore</strong>, <strong>Sideloadly</strong>, or <strong>TrollStore</strong>).
                  </li>
                  <li className="leading-relaxed">
                    Select <strong>tibeb.ipa</strong> to sign with your Apple ID.
                  </li>
                  <li className="leading-relaxed">
                    Enjoy the native IPA package compiled via the <code>omarchy-apple-dev</code> toolchain!
                  </li>
                </ol>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            WHY DOWNLOAD THE TIBEB APP? (APP FEATURES GRID)
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200/80 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-ink">Why Install the Mobile App?</h3>
            <p className="text-xs text-gray-500">
              Designed specifically for Ethiopian university students to save data, access materials offline, and excel in midterm and final exams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-gray-200/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0B5D3B] flex items-center justify-center font-bold">
                ⚡
              </div>
              <h4 className="font-bold text-xs text-ink">Zero Data Loss</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Downloaded exams and study sheets stay saved on your phone. Read even during internet drops.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-gray-200/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                📱
              </div>
              <h4 className="font-bold text-xs text-ink">Instant Telebirr & CBE</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Deposit and unlock exams in seconds with automatic OCR receipt scanning and 0 waiting approval.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-gray-200/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                🏆
              </div>
              <h4 className="font-bold text-xs text-ink">Monthly Cash Prizes</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Compete with students across AAU, ASTU, Unity, and win 1,000 ETB, 600 ETB, or 300 ETB every month!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-gray-200/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                💬
              </div>
              <h4 className="font-bold text-xs text-ink">Live Support Chat</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Get help anytime from our administrators via the built-in mini chat, persistent even offline.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

