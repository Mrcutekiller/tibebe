'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Gift, Copy, Check, Share2, ArrowRight,
  Wallet, DollarSign, CheckCircle2, Clock, ShieldCheck,
  AlertCircle, Sparkles, Send, RefreshCw, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getStudentReferralCode,
  getReferralShareUrl,
  getReferralWalletBalance,
  fetchLiveReferralBalance,
  getReferralsList,
  transferReferralToMainWallet,
  ReferralRecord
} from '@/lib/referral-store';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function ReferralsPage() {
  const { user, walletBalance } = useAuth();
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    toast.success('Referral code copied! Share with your classmates.');
    setTimeout(() => setCopiedCode(false), 2500);
  };
  const [referralBalance, setReferralBalance] = useState<number>(0);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);

  const referralCode = getStudentReferralCode(user);
  const shareUrl = getReferralShareUrl(referralCode);

  const loadReferralData = async () => {
    if (!user) return;
    const list = getReferralsList(user.id);
    setReferrals(list);
    const bal = await fetchLiveReferralBalance(user.id);
    setReferralBalance(bal);
  };

  useEffect(() => {
    loadReferralData();

    const handleSync = () => {
      loadReferralData();
    };

    window.addEventListener('tibeb_referral_wallet_updated', handleSync);
    window.addEventListener('tibeb_wallet_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('tibeb_referral_wallet_updated', handleSync);
      window.removeEventListener('tibeb_wallet_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [user]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `📚 Join me on Tibeb to practice verified university exam papers, solutions, and win 1,000 ETB in monthly competitions!\n\nSign up with my link:\n${shareUrl}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid transfer amount.');
      return;
    }
    if (amt > referralBalance) {
      toast.error(`Transfer amount exceeds your Referral Wallet balance (${referralBalance} ETB available).`);
      return;
    }

    setIsTransferring(true);
    const res = await transferReferralToMainWallet(user.id, amt);
    setIsTransferring(false);

    if (res.success) {
      toast.success(`Successfully transferred ${amt} ETB to your Real Wallet!`);
      setShowTransferModal(false);
      setTransferAmount('');
      loadReferralData();
    } else {
      toast.error(res.error || 'Transfer failed');
    }
  };

  const completedCount = referrals.filter(r => r.status === 'completed').length;
  const pendingCount = referrals.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0B5D3B] flex items-center gap-1.5">
            <Gift size={15} /> Student Referral Program
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-ink mt-0.5">
            Invite a Classmate, Get 5 ETB
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Share your personal referral link with university classmates. When they deposit and purchase their first exam test, you instantly receive <strong>5 ETB in your Referral Wallet</strong>!
          </p>
        </div>

        <button
          onClick={loadReferralData}
          className="p-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-ink transition-all self-start sm:self-auto cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Two Separate Wallets Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wallet 1: Referral Wallet */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#12202B] via-[#0B5D3B] to-[#12202B] text-white shadow-md relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-black">
                <Gift size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">
                  Referral Earnings Wallet
                </span>
                <span className="text-xs font-semibold text-white/70">
                  Separated from your spending wallet
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-white/10 text-emerald-200 border border-white/20">
              5 ETB / Friend
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-black text-white">{referralBalance}</span>
            <span className="text-lg font-bold text-gold ml-2">ETB</span>
            <p className="text-[11px] text-white/60 mt-1">
              Earned from {completedCount} classmates who completed their 1st exam test unlock.
            </p>
          </div>

          {/* Action Buttons for Referral Wallet */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                if (referralBalance <= 0) {
                  toast.error('Your Referral Wallet is 0 ETB. Invite friends to earn rewards!');
                  return;
                }
                setTransferAmount(referralBalance.toString());
                setShowTransferModal(true);
              }}
              className="py-2.5 px-3 rounded-xl bg-gold hover:bg-amber-400 text-[#12202B] text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ArrowRight size={14} /> Add to Real Wallet
            </button>
            <Link
              href="/payment?tab=withdraw&source=referral"
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-white/20 text-center"
            >
              <Wallet size={14} /> Withdraw Payout
            </Link>
          </div>
        </div>

        {/* Wallet 2: Real / Main Wallet */}
        <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center font-black">
                <Wallet size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                  Main / Real Wallet
                </span>
                <span className="text-xs font-semibold text-gray-600">
                  Used for buying exam tests & quizzes
                </span>
              </div>
            </div>
            <Link
              href="/dashboard/catalog"
              className="text-[11px] font-bold text-[#0B5D3B] hover:underline flex items-center gap-1"
            >
              Browse Exams <ArrowRight size={12} />
            </Link>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-black text-ink">{walletBalance}</span>
            <span className="text-lg font-bold text-gray-400 ml-2">ETB</span>
            <p className="text-[11px] text-gray-500 mt-1">
              Available to unlock verified exam papers and solutions across universities.
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400">Total Friends Invited:</span>
            <span className="font-bold text-ink">
              {referrals.length} Classmates ({completedCount} Rewarded, {pendingCount} Pending)
            </span>
          </div>
        </div>
      </div>

      {/* PROMINENT REFERRAL CODE HERO CARD */}
      <div className="bg-gradient-to-r from-amber-50 via-emerald-50/50 to-amber-50 rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-amber-300 space-y-4">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5">
            <Gift size={13} /> Your Official Referral Code
          </span>
          <h2 className="text-lg sm:text-xl font-black text-ink">
            Give this Code to Classmates
          </h2>
          <p className="text-xs text-gray-600 max-w-lg mx-auto">
            When friends sign up by email or Google and fill in their name, age/year, they are asked for a referral code. Tell them to enter yours!
          </p>
        </div>

        {/* Giant Code Display & Copy Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <div className="bg-white px-6 py-3.5 rounded-2xl border-2 border-dashed border-amber-400 shadow-sm flex items-center gap-4">
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#0B5D3B] tracking-wider select-all">
              {referralCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="py-3.5 px-6 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            {copiedCode ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
            <span>{copiedCode ? 'Code Copied!' : 'Copy Referral Code'}</span>
          </button>
        </div>
      </div>

      {/* DIRECT SHAREABLE LINK (AUTO-FILLS CODE FOR FRIENDS) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-black text-ink">Or Share Direct Link (Auto-Fills Code)</h3>
            <p className="text-xs text-gray-500">
              When classmates open this link, the sign up page automatically opens and pre-fills your referral code for them!
            </p>
          </div>
          <span className="text-xs font-bold text-gray-400">1-Click Auto Fill</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="flex-1 relative">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full pl-4 pr-10 py-3 rounded-2xl border border-gray-200 bg-gray-50 font-mono text-xs text-gray-700 select-all focus:outline-none"
            />
          </div>

          <button
            onClick={handleCopyLink}
            className="py-3 px-5 rounded-2xl border-2 border-gray-200 hover:border-[#0B5D3B] hover:bg-gray-50 text-ink font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleShareTelegram}
            className="py-3 px-5 rounded-2xl bg-[#229ED9] hover:bg-[#1E8BC0] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Send size={15} />
            <span>Share to Telegram</span>
          </button>
        </div>

        {/* How It Works Explainer */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-amber-200/60 space-y-1">
            <span className="w-6 h-6 rounded-full bg-[#0B5D3B] text-white text-[11px] font-black flex items-center justify-center mb-1">
              1
            </span>
            <h4 className="font-black text-xs text-ink">Share Your Link</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Send your link to friends across your department or university batches.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-amber-200/60 space-y-1">
            <span className="w-6 h-6 rounded-full bg-[#0B5D3B] text-white text-[11px] font-black flex items-center justify-center mb-1">
              2
            </span>
            <h4 className="font-black text-xs text-ink">Friend Deposits & Unlocks</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Your invited classmate registers and buys their first exam paper or quiz test.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-amber-200/60 space-y-1">
            <span className="w-6 h-6 rounded-full bg-[#0B5D3B] text-white text-[11px] font-black flex items-center justify-center mb-1">
              3
            </span>
            <h4 className="font-black text-xs text-ink">Get 5 ETB in Wallet</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              5 ETB lands directly into your Referral Wallet. Withdraw via Telebirr/CBE or add to real wallet!
            </p>
          </div>
        </div>
      </div>

      {/* Referrals Activity List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-black text-ink flex items-center gap-2">
              <Users size={18} className="text-[#0B5D3B]" />
              Invited Classmates
            </h3>
            <p className="text-xs text-gray-500">
              Track your referrals and reward status in real time.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-400">
            {referrals.length} Total
          </span>
        </div>

        {referrals.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0B5D3B] mx-auto flex items-center justify-center">
              <Users size={26} />
            </div>
            <h4 className="font-black text-sm text-ink">No Classmates Invited Yet</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Share your link above with your friends. Once they register, deposit and unlock their first exam test, your 5 ETB reward will appear here!
            </p>
            <button
              onClick={handleShareTelegram}
              className="px-4 py-2 rounded-xl bg-[#229ED9] text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={13} /> Share with Classmates on Telegram
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {referrals.map((r) => (
              <div key={r.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0B5D3B] font-black text-sm flex items-center justify-center shrink-0">
                    {r.referredUserName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-ink">{r.referredUserName}</h5>
                    <p className="text-[11px] text-gray-400">
                      {r.referredUserUniversity} • {r.referredUserDepartment}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      Joined: {new Date(r.registeredAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  {r.status === 'completed' ? (
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 size={12} /> +5 ETB Earned
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Test Unlocked
                      </span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Clock size={12} /> Pending (Needs 1st Test)
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Will reward 5 ETB after purchase
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transfer to Real Wallet Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-black text-ink text-sm flex items-center gap-2">
                <ArrowRight size={16} className="text-[#0B5D3B]" />
                Transfer to Real Wallet
              </h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-gray-400 hover:text-ink text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Move funds from your Referral Wallet into your Real Wallet to unlock exam papers, solutions, and course quizzes.
            </p>

            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Transfer Amount (ETB)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={referralBalance}
                    step="any"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-black text-sm focus:outline-none focus:border-[#0B5D3B]"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    ETB
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Available in Referral Wallet: <strong>{referralBalance} ETB</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-black shadow-md disabled:opacity-50"
                >
                  {isTransferring ? 'Transferring...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

