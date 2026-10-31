'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone, Apple, Download, Share, PlusSquare,
  CheckCircle2, Monitor, ArrowRight, Sparkles, ExternalLink,
  Package, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function InstallAppSection({ className }: { className?: string }) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop'>('android');
  const [isSafari, setIsSafari] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed in standalone mode
    const isApp = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isApp);

    // 2. Detect platform
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /Android/.test(ua);

    if (isIOS) {
      setPlatform('ios');
      const isWebKit = /WebKit/.test(ua);
      const isSafariBrowser = isWebKit && !/CriOS|FxiOS|OPiOS|EdgiOS|mercury/i.test(ua);
      setIsSafari(isSafariBrowser);
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // 3. Listen for Android PWA beforeinstallprompt
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      toast.success('Tibeb has been added to your Home Screen!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
    };
  }, []);

  // If already running inside installed standalone app, hide section per requirements
  if (isStandalone || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        toast.success('Installing Tibeb to Home Screen...');
      }
      setDeferredPrompt(null);
    } else {
      toast('Tap the 3 dots (⋮) in Chrome and select "Install app" or "Add to Home Screen".', {
        icon: '📱',
        duration: 4500,
      });
    }
  };

  return (
    <section id="download" className={cn('section py-16 sm:py-24 bg-[#FAF6EC]', className)}>
      <div className="container-tibeb max-w-4xl px-4">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0B5D3B] text-xs font-bold border border-emerald-200">
            <Sparkles size={13} className="text-[#0B5D3B]" />
            <span>Install & Offline Mode</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
            Install Tibeb on your phone
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            Choose either Add to Home Screen (instant & light) or download the direct APK / iOS package.
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-2xl bg-stone-200/70 border border-stone-300/80">
            <button
              onClick={() => setPlatform('android')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                platform === 'android'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-gray-600 hover:text-ink'
              )}
            >
              <Smartphone size={15} className="text-emerald-600" />
              <span>Android</span>
            </button>

            <button
              onClick={() => setPlatform('ios')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                platform === 'ios'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-gray-600 hover:text-ink'
              )}
            >
              <Apple size={15} className="text-gray-900" />
              <span>iPhone / iPad</span>
            </button>

            <button
              onClick={() => setPlatform('desktop')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                platform === 'desktop'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-gray-600 hover:text-ink'
              )}
            >
              <Monitor size={15} className="text-blue-600" />
              <span>Laptop / PC</span>
            </button>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm max-w-2xl mx-auto">
          {/* ANDROID TAB: Add to Home + APK side-by-side */}
          {platform === 'android' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center mx-auto border border-emerald-100">
                <Smartphone size={32} />
              </div>

              <div>
                <h3 className="text-lg font-black text-ink mb-1">Android Installation</h3>
                <p className="text-xs text-gray-500">
                  Install via Home Screen for automatic updates, or download the direct APK file below.
                </p>
              </div>

              {/* Side-by-Side Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusSquare size={16} />
                  <span>Add to Home Screen</span>
                </button>

                <a
                  href="/api/download?type=apk"
                  download="tibeb.apk"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#E0A526] hover:bg-amber-500 text-ink font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={16} />
                  <span>Download APK (.apk)</span>
                </a>
              </div>

              {/* Options Explanation */}
              <div className="pt-4 border-t border-gray-100 text-left space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                    <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                      <Check size={13} className="text-emerald-700" />
                      Add to Home (Recommended)
                    </span>
                    <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
                      Instant install, 0 MB phone storage used, offline dorm exam study, auto-updates.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                    <span className="font-bold text-amber-950 block flex items-center gap-1.5">
                      <Package size={13} className="text-amber-700" />
                      Direct APK File (.apk)
                    </span>
                    <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
                      Direct native Android package installer (v1.2.0). Works on all Android versions.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-gray-500 text-[11px]">
                  <strong>Chrome manual hint:</strong> If the button doesn&apos;t prompt, tap browser menu (<strong>3 vertical dots ⋮</strong>) &gt; tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                </div>
              </div>
            </div>
          )}

          {/* IOS TAB: Add to Home + iOS Profile side-by-side */}
          {platform === 'ios' && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 text-gray-800 flex items-center justify-center mx-auto border border-stone-200">
                <Apple size={32} />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-black text-ink mb-1">Install on iPhone & iPad</h3>
                <p className="text-xs text-gray-500">
                  Add Tibeb to your iOS Home Screen via Safari, or download the direct iOS WebClip profile.
                </p>
              </div>

              {!isSafari && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <ExternalLink size={16} className="text-amber-700 flex-shrink-0" />
                  <span>Please <strong>open this page in Safari first</strong> to install the app on iOS.</span>
                </div>
              )}

              {/* Side-by-Side Direct iOS Downloads beside Add to Home */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <a
                  href="/api/download?type=mobileconfig"
                  download="tibeb.mobileconfig"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={16} />
                  <span>Download iOS Profile (.mobileconfig)</span>
                </a>

                <a
                  href="/api/download?type=ipa"
                  download="tibeb.ipa"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-ink font-bold text-xs uppercase tracking-wider border border-stone-300 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Apple size={16} />
                  <span>Download .IPA File</span>
                </a>
              </div>

              {/* Safari Add to Home 3-step guide */}
              <div className="pt-2">
                <span className="text-xs font-bold text-gray-700 block mb-3 text-center sm:text-left">
                  Or Add to Home Screen via Safari (Standard iOS Method):
                </span>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      <Share size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Step 1: Tap the Share Button</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        At the bottom of your Safari screen, tap the Share icon (square with arrow pointing up).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0B5D3B] flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      <PlusSquare size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Step 2: Tap &quot;Add to Home Screen&quot;</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Scroll down in the action sheet and tap <strong>Add to Home Screen</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      <CheckCircle2 size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Step 3: Tap &quot;Add&quot;</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Tap <strong>Add</strong> in the top right corner. Tibeb will appear on your iPhone screen!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DESKTOP TAB */}
          {platform === 'desktop' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto border border-blue-100">
                <Monitor size={32} />
              </div>

              <div>
                <h3 className="text-lg font-black text-ink mb-1">Install on Laptop & Desktop</h3>
                <p className="text-xs text-gray-500">
                  Run Tibeb as a standalone desktop window on Windows, Mac, or Linux.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-gray-600 max-w-md mx-auto text-left space-y-2">
                <p className="font-bold text-ink">How to install in Chrome / Edge:</p>
                <ol className="space-y-1.5 list-decimal list-inside text-gray-500">
                  <li>Look at the right side of your browser address bar.</li>
                  <li>Click the <strong>Install icon (⊕)</strong> or monitor icon.</li>
                  <li>Click <strong>Install</strong> to open Tibeb in its own clean window.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
