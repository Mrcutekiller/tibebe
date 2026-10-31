'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Gift, Copy, Check, Send, Users, Wallet,
  ArrowRight, Sparkles, Share2, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getStudentReferralCode,
  getReferralShareUrl,
  getReferralWalletBalance,
  getReferralsList,
  type ReferralRecord
} from '@/lib/referral-store';
import toast from 'react-hot-toast';

export default function ReferralProgramSection() {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralCode, setReferralCode] = useState('TIBEB-CAMPUS');
  const [referralBalance, setReferralBalance] = useState(0);
  const [invitedFriends, setInvitedFriends] = useState<ReferralRecord[]>([]);
  const [incomingRefCode, setIncomingRefCode] = useState<string | null>(null);

  useEffect(() => {
    // 1. Capture incoming ?ref=CODE from URL if visiting via classmate's share link
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref') || urlParams.get('r');
      if (refParam) {
        const cleanCode = refParam.trim().toUpperCase();
        setIncomingRefCode(cleanCode);
        localStorage.setItem('tibeb_pending_ref_code', cleanCode);
        localStorage.setItem('tibeb_referred_by_code', cleanCode);
      } else {
        const stored = localStorage.getItem('tibeb_pending_ref_code');
        if (stored) setIncomingRefCode(stored);
      }
    }

    // 2. Load logged-in student's referral data
    if (user) {
      const code = getStudentReferralCode(user);
      setReferralCode(code);
      setReferralBalance(getReferralWalletBalance(user.id));
      setInvitedFriends(getReferralsList(user.id));
    }
  }, [user]);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/signup?ref=${referralCode}`
    : `https://tibebexams.com/signup?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    toast.success(`Referral code ${referralCode} copied!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    toast.success('Invite link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `📚 Pass your semester exams with Tibeb!\nGet authentic university past exam papers with step-by-step solutions.\n\nUse my invite code ${referralCode} when you sign up:`
    );
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`;
    window.open(tgUrl, '_blank');
  };

  return (
    <section id="referral" className="section py-16 sm:py-24 bg-gradient-to-b from-[#FAF6EC] via-white to-[#FAF6EC] relative overflow-hidden border-y border-stone-200/80">
      <div className="container-tibeb max-w-5xl px-4 relative z-10">

        {/* Incoming Referral Banner if visiting from a classmate's invite link */}
        {incomingRefCode && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                🎁
              </span>
              <p className="text-xs font-bold">
                You were invited by a classmate! Invite code <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-[#0B5D3B]">{incomingRefCode}</span> is active for your account.
              </p>
            </div>
            {!user && (
              <Link
                href={`/signup?ref=${incomingRefCode}`}
                className="px-4 py-2 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-bold text-xs shrink-0 transition-all shadow-xs"
              >
                Sign Up with Invite Code →
              </Link>
            )}
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-300">
            <Gift size={14} className="text-amber-700" />
            <span>Viral Student Rewards • Invite a Classmate</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight">
            Invite a Classmate, <span className="text-[#0B5D3B]">Get 5 ETB</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            Share Tibeb with dorm-mates and campus groups. When your classmate unlocks their first 20 ETB past exam, you receive <strong className="text-[#0B5D3B]">5 ETB directly into your Referral Wallet</strong>.
          </p>
        </div>

        {/* =========================================================================
            STATE 1: LOGGED-IN STUDENT WITH ACTIVE REFERRAL CODE
           ========================================================================= */}
        {user ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-100 shadow-xl max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Your Unique Promoter Code
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#0B5D3B] tracking-wider bg-emerald-50 px-3.5 py-1 rounded-2xl border border-emerald-200">
                    {referralCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer"
                    title="Copy code"
                  >
                    {copiedCode ? <Check size={18} className="text-[#0B5D3B]" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* Referral Balance Quick Stat */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center font-black">
                  <Wallet size={20} className="text-amber-800" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                    Referral Wallet
                  </span>
                  <span className="text-xl font-black text-ink">{referralBalance} ETB</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleShareTelegram}
                className="w-full py-3.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} />
                <span>Share Code on Telegram</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check size={15} /> : <Share2 size={15} />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
              </button>
            </div>

            {/* Portal Link */}
            <div className="text-center pt-2">
              <Link
                href="/dashboard/referrals"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5D3B] hover:underline"
              >
                <span>View your invited classmates activity & transfer funds</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* =========================================================================
              STATE 2: GUEST VISITOR (CLEAR HOW-IT-WORKS 3-STEP GRID)
             ========================================================================= */
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center font-black text-base border border-emerald-100">
                  1
                </div>
                <h3 className="font-bold text-ink text-base">Get Your Invite Code</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Sign up in 30 seconds. Your account instantly receives a unique student referral code (e.g. <strong className="font-mono text-[#0B5D3B]">TIBEB-XXXX</strong>).
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-gold flex items-center justify-center font-black text-base border border-amber-200">
                  2
                </div>
                <h3 className="font-bold text-ink text-base">Share with Classmates</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Drop your code or link in your university Telegram batch group or send it to dorm-mates studying for midterms and finals.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-base border border-blue-200">
                  3
                </div>
                <h3 className="font-bold text-ink text-base">Earn 5 ETB per Test</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  When your invited friend deposits and unlocks their first exam, <strong>5 ETB</strong> is credited instantly to your separate Referral Wallet.
                </p>
              </div>
            </div>

            {/* Reward Rules & Sign Up CTA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-sm font-black text-ink">Zero Wallet Lock-in</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                    Withdrawable
                  </span>
                </div>
                <p className="text-xs text-gray-500 max-w-lg">
                  Referral balances stay in your dedicated Referral Wallet. You can transfer them to your study wallet or withdraw them directly to your Telebirr account!
                </p>
              </div>

              <Link
                href="/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Get Your Referral Code</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* Social Proof Quick Tip */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400">
            💡 <em>Tip: 4 invited classmates who unlock an exam = 20 ETB, which covers your next university exam test completely free!</em>
          </p>
        </div>

      </div>
    </section>
  );
}
