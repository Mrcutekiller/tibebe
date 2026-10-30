'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Wallet, ArrowLeft, CheckCircle2, XCircle, UploadCloud,
  Copy, Check, ShieldCheck, Sparkles, RefreshCw, QrCode,
  AlertTriangle, ArrowRight, ExternalLink, FileCheck, Layers,
  ChevronRight, Smartphone, Building, BookOpen
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  PaymentVerification,
  SAMPLE_RECEIPTS,
  OFFICIAL_PAYMENT_ACCOUNTS,
  getStoredVerifications,
  saveVerifications,
  validateReceiptImage,
  type CbeQrVerificationData
} from '@/lib/payment-verification';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

type PaymentGateway = 'telebirr' | 'cbe';
type Step = 1 | 2 | 3;
type AnalysisStatus = 'idle' | 'analyzing' | 'approved' | 'rejected' | 'manual_review';

interface ExtractedData {
  senderName: string;
  tin: string;
  amount: number;
  date: string;
  nameMatch: boolean;
  amountMatch: boolean;
  rejectionReason?: string;
  cbeQrData?: CbeQrVerificationData;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, walletBalance, topUpWallet } = useAuth();

  const queryAmount = parseInt(searchParams.get('amount') || '100', 10);
  const initialMethod = (searchParams.get('method') as PaymentGateway) || 'telebirr';

  // Step state: 1: Choose Gateway -> 2: Account Details & Amount -> 3: Upload & Verify
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [gateway, setGateway] = useState<PaymentGateway>(initialMethod);
  const [amount, setAmount] = useState<number>(queryAmount > 0 ? queryAmount : 100);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Upload and Analysis States
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const studentName = user?.name || 'Tibeb Student';
  const studentPhone = user?.phone || '099721895';
  const studentEmail = user?.email || 'tibebexams@gmail.com';

  // Copy helper
  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success(`Copied "${text}"!`, { icon: '📋', duration: 2000 });
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Superfast OCR, CBE QR Auto-Scan & Strict Receipt Verification Engine
  const runSuperfastAnalysis = async (
    imageSrc: string,
    fileName: string = '',
    forceTestMode?: 'fake' | 'wrong_name' | 'past_bill' | 'fake_qr' | 'missing_qr'
  ) => {
    setReceiptImage(imageSrc);
    setAnalysisStatus('analyzing');
    setExtractedData(null);

    // Realistic scanning delay
    await new Promise((r) => setTimeout(r, 450));

    let testFileName = fileName;
    if (forceTestMode === 'fake') testFileName = 'random_photo_other_thing.jpg';
    if (forceTestMode === 'wrong_name') testFileName = 'receipt_for_alemu_other_name.jpg';
    if (forceTestMode === 'past_bill') testFileName = 'expired_past_bill_2023.jpg';
    if (forceTestMode === 'fake_qr') testFileName = 'cbe_slip_fake-qr_external.jpg';
    if (forceTestMode === 'missing_qr') testFileName = 'cbe_no_qr_code_fake.jpg';

    const validation = await validateReceiptImage(imageSrc, testFileName, gateway, amount);

    // If validation fails (fake bill, wrong name, non-receipt, past bill, or fake QR) -> REJECT!
    if (!validation.isValid) {
      const data: ExtractedData = {
        senderName: validation.extractedSender || 'Unverified Account',
        tin: validation.extractedTin || 'INVALID',
        amount: validation.extractedAmount || amount,
        date: 'Outdated / Invalid',
        nameMatch: validation.nameMatch,
        amountMatch: validation.amountMatch,
        rejectionReason:
          validation.rejectionReason ||
          'Receipt rejected: Does not match an authentic Telebirr/CBE payment to Biruk (099721895 / 1000724852177).',
        cbeQrData: validation.cbeQrData,
      };
      setExtractedData(data);
      setAnalysisStatus('rejected');
      toast.error(data.rejectionReason || 'Receipt rejected.', { icon: '❌', duration: 5500 });
      return;
    }

    // Valid authentic receipt: deposit does NOT need admin approval -> auto-credit immediately!
    const creditAmount = validation.extractedAmount && validation.extractedAmount > 0 ? validation.extractedAmount : amount;
    const finalTin = validation.extractedTin || (gateway === 'cbe' ? 'FT262847PNT0' : 'DDA3RGJEL1');
    const finalSender = validation.extractedSender || studentName;

    // Track used TIN to prevent future re-use
    try {
      const usedTins: string[] = JSON.parse(localStorage.getItem('tibeb_used_tins') || '[]');
      if (!usedTins.includes(finalTin)) {
        usedTins.push(finalTin);
        localStorage.setItem('tibeb_used_tins', JSON.stringify(usedTins));
      }
    } catch {}

    const data: ExtractedData = {
      senderName: finalSender,
      tin: finalTin,
      amount: creditAmount,
      date: 'Just now',
      nameMatch: true,
      amountMatch: true,
      cbeQrData: validation.cbeQrData,
    };
    setExtractedData(data);
    setAnalysisStatus('approved');

    // 1. Credit wallet instantly (NO approval required!)
    topUpWallet(creditAmount);

    // 2. Record verification for Admin
    const orderId = `DEP-${Date.now().toString().slice(-6)}`;
    const newVerif: PaymentVerification = {
      id: `VERIF-${Date.now().toString().slice(-4)}`,
      orderId,
      userId: user?.id || 'usr-guest',
      userName: finalSender,
      userUsername: user?.username || finalSender.toLowerCase().replace(/\s+/g, '_'),
      userPhone: studentPhone,
      userEmail: studentEmail,
      userUniversity: user?.department ? `${user.department} Dept` : 'Addis Ababa University',
      userDepartment: user?.department || 'General Studies',
      paymentMethod: gateway,
      amount: creditAmount,
      extractedSenderName: finalSender,
      extractedTin: finalTin,
      extractedAmount: creditAmount,
      nameMatch: true,
      amountMatch: true,
      receiptScreenshot: imageSrc,
      status: 'approved',
      reviewedBy: 'Instant Auto-Deposit Engine',
      reviewedAt: 'Instant (No Admin Approval Required)',
      createdAt: 'Just now',
      items: [
        {
          id: 'wallet-topup',
          title: `Student Wallet Deposit (${creditAmount} ETB)`,
          price: creditAmount,
          type: 'deposit',
        },
      ],
    };

    const existingVerifs = getStoredVerifications();
    saveVerifications([newVerif, ...existingVerifs]);

    // 3. Record order/receipt in tibeb_orders
    try {
      const orders = JSON.parse(localStorage.getItem('tibeb_orders') || '[]');
      orders.unshift({
        id: orderId,
        date: 'Today, Just now',
        itemTitle: `Wallet Deposit +${creditAmount} ETB`,
        itemType: 'Wallet Deposit',
        price: creditAmount,
        paymentMethod: gateway === 'telebirr' ? 'Telebirr' : 'CBE Birr',
        status: 'Completed',
        customerName: finalSender,
        reference: finalTin,
        receiptScreenshot: imageSrc,
      });
      localStorage.setItem('tibeb_orders', JSON.stringify(orders));
    } catch {}

    toast.success(`🎉 Instant Auto-Deposit Verified! +${creditAmount} ETB credited to your wallet!`, {
      icon: '⚡',
      duration: 5000,
    });
  };

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image receipt screenshot (PNG, JPG, JPEG)');
      return;
    }

    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      runSuperfastAnalysis(result, fileName);
    };
    reader.readAsDataURL(file);
  };

  // Manual Review Submission
  const handleSubmitForAdminReview = () => {
    if (!receiptImage || !extractedData) return;

    const orderId = `DEP-${Date.now().toString().slice(-6)}`;
    const newVerif: PaymentVerification = {
      id: `VERIF-${Date.now().toString().slice(-4)}`,
      orderId,
      userId: user?.id || 'usr-guest',
      userName: studentName,
      userUsername: user?.username || studentName.toLowerCase().replace(/\s+/g, '_'),
      userPhone: studentPhone,
      userEmail: studentEmail,
      userUniversity: user?.department ? `${user.department} Dept` : 'Addis Ababa University',
      userDepartment: user?.department || 'General Studies',
      paymentMethod: gateway,
      amount,
      extractedSenderName: extractedData.senderName,
      extractedTin: extractedData.tin,
      extractedAmount: extractedData.amount,
      nameMatch: extractedData.nameMatch,
      amountMatch: extractedData.amountMatch,
      receiptScreenshot: receiptImage,
      status: 'pending',
      createdAt: 'Just now',
      items: [{ id: 'wallet-topup', title: `Pending Deposit (${amount} ETB)`, price: amount, type: 'deposit' }]
    };

    const existingVerifs = getStoredVerifications();
    saveVerifications([newVerif, ...existingVerifs]);

    setAnalysisStatus('manual_review');
    toast.success('Submitted to Admin for manual clearance!', { icon: '🛡️', duration: 4000 });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-black text-emerald-900 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-stone-200 hover:border-emerald-700 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 bg-emerald-900/10 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-800/20">
            <ShieldCheck size={16} className="text-emerald-700" />
            <span>Official Tibeb Clearing</span>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 flex items-center justify-between text-xs font-bold">
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all', currentStep === 1 ? 'bg-[#0B5D3B] text-white shadow-sm' : 'text-gray-400')}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Choose Gateway</span>
          </div>
          <ChevronRight size={14} className="text-gray-300" />
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all', currentStep === 2 ? 'bg-[#0B5D3B] text-white shadow-sm' : 'text-gray-400')}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>Account & Amount</span>
          </div>
          <ChevronRight size={14} className="text-gray-300" />
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all', currentStep === 3 ? 'bg-[#0B5D3B] text-white shadow-sm' : 'text-gray-400')}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            <span>Upload & Verify</span>
          </div>
        </div>

        {/* =========================================================================
            STEP 1: CHOOSE PAYMENT METHOD
           ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Step 1 of 3
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-ink mt-2">
                Choose Payment Method
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Select your preferred mobile money or banking platform to proceed.
              </p>
            </div>

            {/* Gateway Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setGateway('telebirr')}
                className={cn(
                  'p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 hover:shadow-md',
                  gateway === 'telebirr'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-4 ring-emerald-500/10'
                    : 'border-stone-200 hover:border-stone-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-md">
                    TB
                  </div>
                  {gateway === 'telebirr' && (
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check size={14} className="stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-black text-base text-ink">Telebirr</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Ethio Telecom Mobile Money</p>
                  <p className="text-[11px] text-emerald-800 font-bold mt-2">⚡ 400ms High-Speed AI Auto-Clearance</p>
                </div>
              </div>

              <div
                onClick={() => setGateway('cbe')}
                className={cn(
                  'p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 hover:shadow-md',
                  gateway === 'cbe'
                    ? 'border-purple-600 bg-purple-50/60 ring-4 ring-purple-500/10'
                    : 'border-stone-200 hover:border-stone-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white font-black text-base flex items-center justify-center shadow-md">
                    CBE
                  </div>
                  {gateway === 'cbe' && (
                    <span className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center">
                      <Check size={14} className="stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-black text-base text-ink">CBE Mobile Banking</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Commercial Bank of Ethiopia</p>
                  <p className="text-[11px] text-purple-900 font-bold mt-2">🏦 Official Commercial Bank Account</p>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-4 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <span>Next: View Account & Enter Amount</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: ACCOUNT DETAILS & ENTER HOW MUCH TO DEPOSIT
           ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Step 2 of 3
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-ink mt-2">
                Account Details & Deposit Amount
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Enter your desired deposit amount, transfer to the official account, and confirm.
              </p>
            </div>

            {/* Official Account Box (Biruk) */}
            {gateway === 'telebirr' ? (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 via-[#083D28] to-emerald-950 text-white space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      TB
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
                        Official Telebirr Account
                      </span>
                      <span className="text-base font-black text-white">{OFFICIAL_PAYMENT_ACCOUNTS.accountName}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-gold text-ink">
                    Verified
                  </span>
                </div>

                {/* Account Details Card */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-200 uppercase font-bold block">Telebirr Phone Number</span>
                    <span className="font-mono text-xl font-black tracking-wider text-white">
                      {OFFICIAL_PAYMENT_ACCOUNTS.telebirrPhone}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(OFFICIAL_PAYMENT_ACCOUNTS.telebirrPhone, 'tb')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedField === 'tb' ? <Check size={14} className="text-gold" /> : <Copy size={14} />}
                    <span>{copiedField === 'tb' ? 'Copied' : 'Copy Number'}</span>
                  </button>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex items-center justify-between text-xs">
                  <span className="text-emerald-200">Account Holder Name:</span>
                  <span className="font-black text-white">{OFFICIAL_PAYMENT_ACCOUNTS.accountName}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 text-white space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-700 text-white font-black text-xs flex items-center justify-center">
                      CBE
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-purple-300 font-bold block">
                        Commercial Bank of Ethiopia (CBE)
                      </span>
                      <span className="text-base font-black text-white">{OFFICIAL_PAYMENT_ACCOUNTS.accountName}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-300 text-purple-950">
                    Verified
                  </span>
                </div>

                {/* Account Details Card */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-purple-200 uppercase font-bold block">CBE Account Number</span>
                    <span className="font-mono text-xl font-black tracking-wider text-white">
                      {OFFICIAL_PAYMENT_ACCOUNTS.cbeAccount}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(OFFICIAL_PAYMENT_ACCOUNTS.cbeAccount, 'cbe')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedField === 'cbe' ? <Check size={14} className="text-gold" /> : <Copy size={14} />}
                    <span>{copiedField === 'cbe' ? 'Copied' : 'Copy Account'}</span>
                  </button>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex items-center justify-between text-xs">
                  <span className="text-purple-200">Beneficiary Name:</span>
                  <span className="font-black text-white">{OFFICIAL_PAYMENT_ACCOUNTS.accountName}</span>
                </div>
              </div>
            )}

            {/* How Much to Deposit Section */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                How Much Do You Want to Deposit?
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="10"
                  step="5"
                  value={amount || ''}
                  onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  placeholder="e.g. 100"
                  className="w-full text-2xl font-black text-ink px-4 py-3.5 rounded-2xl border-2 border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 bg-emerald-50/20 pr-16"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-500">
                  ETB
                </span>
              </div>

              {/* Quick Select Preset Pills */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {[50, 100, 200, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={cn(
                      'py-2 rounded-xl text-xs font-black transition-all border cursor-pointer',
                      amount === amt
                        ? 'bg-[#0B5D3B] text-white border-[#0B5D3B] shadow-sm scale-105'
                        : 'bg-stone-50 text-gray-700 border-stone-200 hover:bg-stone-100'
                    )}
                  >
                    +{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer Instructions Checklist */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1.5 leading-relaxed">
              <div className="font-black text-amber-950 flex items-center gap-1.5">
                <AlertTriangle size={15} />
                <span>Next Step: Complete Transfer Before Continuing</span>
              </div>
              <p>
                1. Open your {gateway === 'telebirr' ? 'Telebirr' : 'CBE Mobile'} app.<br />
                2. Send <strong>{amount} ETB</strong> to <strong>{OFFICIAL_PAYMENT_ACCOUNTS.accountName}</strong> ({gateway === 'telebirr' ? OFFICIAL_PAYMENT_ACCOUNTS.telebirrPhone : OFFICIAL_PAYMENT_ACCOUNTS.cbeAccount}).<br />
                3. Save or take a screenshot of your payment confirmation slip.<br />
                4. Click below to upload the screenshot for instant verification!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-3.5 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!amount || amount <= 0) {
                    toast.error('Please enter a valid deposit amount (e.g. 50 ETB or more).');
                    return;
                  }
                  setCurrentStep(3);
                }}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <span>I Sent the Money → Upload Receipt Screenshot</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: UPLOAD RECEIPT IMAGE & VERIFY
           ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Step 3 of 3
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-ink mt-2">
                  Upload Receipt & Verify
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Expected Deposit: <strong className="text-emerald-700 font-bold">{amount} ETB</strong> to <strong className="text-ink">{OFFICIAL_PAYMENT_ACCOUNTS.accountName}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs font-bold text-gray-500 hover:text-ink underline cursor-pointer"
              >
                Change Details
              </button>
            </div>

            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all relative overflow-hidden',
                analysisStatus === 'analyzing'
                  ? 'border-emerald-500 bg-emerald-50/40'
                  : analysisStatus === 'approved'
                  ? 'border-emerald-600 bg-emerald-50/60'
                  : analysisStatus === 'rejected'
                  ? 'border-red-400 bg-red-50/40'
                  : 'border-stone-300 hover:border-emerald-600 hover:bg-stone-50'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Laser Scan Beam Animation */}
              {analysisStatus === 'analyzing' && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-lg shadow-emerald-500/50" />
              )}

              {receiptImage ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-36 h-48 rounded-xl overflow-hidden border-2 border-stone-200 shadow-md bg-white p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={receiptImage} alt="Receipt preview" className="w-full h-full object-contain rounded-lg" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800">
                    {analysisStatus === 'analyzing' ? '⚡ Scanning transaction number and amount...' : 'Click to upload a different receipt'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-sm">
                    <UploadCloud size={28} />
                  </div>
                  <p className="font-black text-sm text-ink mt-2">
                    Click to browse or drop your payment screenshot here
                  </p>
                  <p className="text-[11px] text-gray-400">Supports PNG, JPG, JPEG from Telebirr or CBE Mobile</p>
                </div>
              )}
            </div>

            {/* Instant 1-Click Verification Tests */}
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200/80 space-y-2.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 block">
                ⚡ Test Authentic vs. Fake Receipts (Auto QR Scan & Fraud Detection):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => runSuperfastAnalysis(SAMPLE_RECEIPTS.cbe, 'cbe-real.jpg')}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-purple-700 hover:bg-purple-800 text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode size={13} />
                  <span>✅ Test Authentic CBE QR (Auto-Scan)</span>
                </button>

                <button
                  type="button"
                  onClick={() => runSuperfastAnalysis(SAMPLE_RECEIPTS.telebirr, 'telebirr-real.jpg')}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>✅ Test Authentic Telebirr</span>
                </button>

                <button
                  type="button"
                  onClick={() => runSuperfastAnalysis(SAMPLE_RECEIPTS.cbe, '', 'fake_qr')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>❌ Test Fake CBE QR (Wrong Site)</span>
                </button>

                <button
                  type="button"
                  onClick={() => runSuperfastAnalysis(SAMPLE_RECEIPTS.cbe, '', 'past_bill')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>❌ Test Expired CBE QR (Past Date)</span>
                </button>

                <button
                  type="button"
                  onClick={() => runSuperfastAnalysis(SAMPLE_RECEIPTS.cbe, '', 'missing_qr')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-200 hover:bg-red-100 hover:text-red-700 text-gray-700 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>❌ Test Missing QR Code</span>
                </button>
              </div>
            </div>

            {/* =========================================================================
                SUCCESS APPROVED BANNER & THE 2 ACTION BUTTONS (As Requested)
               ========================================================================= */}
            {analysisStatus === 'approved' && extractedData && (
              <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-600 shadow-md space-y-5 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-emerald-950">
                      Payment Successfully Verified & Approved!
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      <strong>+{extractedData.amount} ETB</strong> has been credited to your Student Wallet.
                    </p>
                  </div>
                </div>

                {/* CBE QR Code Verified Badge */}
                {extractedData.cbeQrData && (
                  <div className="p-3.5 bg-purple-50/90 border border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <QrCode size={16} />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase text-purple-900 block flex items-center gap-1.5">
                          <span>Official CBE Bank QR Code Auto-Scanned</span>
                          <span className="text-[9px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-black">Same Date Verified ✓</span>
                        </span>
                        <span className="text-[10px] text-purple-700 leading-tight block">
                          Transaction #{extractedData.cbeQrData.transactionId} • Verified on Commercial Bank of Ethiopia (apps.cbe.com.et) • To: Biruk (1000724852177)
                        </span>
                      </div>
                    </div>
                    <a
                      href={extractedData.cbeQrData.scannedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-[10px] font-black shadow-xs flex items-center justify-center gap-1 self-start sm:self-auto whitespace-nowrap cursor-pointer"
                    >
                      <span>Open CBE Record</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}

                {/* Verified Specs Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-gray-500 block">Sender Account</span>
                    <span className="font-bold text-ink truncate block">{extractedData.senderName}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-gray-500 block">Transaction TIN</span>
                    <span className="font-bold text-emerald-700 font-mono truncate block">{extractedData.tin}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-gray-500 block">Amount Cleared</span>
                    <span className="font-black text-ink">{extractedData.amount} ETB</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-gray-500 block">Verification Status</span>
                    <span className="font-black text-emerald-700">APPROVED ✓</span>
                  </div>
                </div>

                {/* THE 2 ACTION BUTTONS AS REQUESTED */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Button 1: Return to Dashboard */}
                  <Link
                    href="/dashboard"
                    className="py-3.5 px-4 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Go to Dashboard (View Balance)</span>
                    <ArrowRight size={15} />
                  </Link>

                  {/* Button 2: Unlock Past Exams */}
                  <Link
                    href="/catalog"
                    className="py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 border-2 border-[#0B5D3B] text-[#0B5D3B] font-black text-xs uppercase tracking-wider text-center shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                  >
                    <BookOpen size={15} />
                    <span>Explore Past Exams (20 ETB)</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Rejection Display */}
            {analysisStatus === 'rejected' && extractedData && (
              <div className="p-6 rounded-3xl bg-red-50 border-2 border-red-500 shadow-md space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center">
                    <XCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-red-950">
                      Verification Rejected
                    </h3>
                    <p className="text-xs text-red-800">
                      {extractedData.rejectionReason}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider text-center shadow-md transition-all cursor-pointer"
                  >
                    Upload Correct Screenshot
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitForAdminReview}
                    className="py-3 px-6 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-gray-700 font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer"
                  >
                    Submit to Admin for Manual Review
                  </button>
                </div>
              </div>
            )}

            {/* Manual Review Submitted Banner */}
            {analysisStatus === 'manual_review' && (
              <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-500 shadow-md space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-amber-950">
                      Submitted to Admin Portal
                    </h3>
                    <p className="text-xs text-amber-800">
                      An administrator has received your receipt. They will approve it in the Admin Console.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    className="inline-block py-2.5 px-5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition-colors"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500 font-bold">Loading payment gateway...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
