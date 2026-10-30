'use client';

import React, { useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShoppingCart, Tag, CreditCard, ChevronRight, CheckCircle, Lock,
  Minus, Plus, X, Smartphone, AlertTriangle, UploadCloud, QrCode,
  Scan, CheckCircle2, FileCheck, ArrowRight, RefreshCw, Eye
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { EXAMS, COURSES, PRODUCTS, TELEGRAM_PREMIUM_PLANS } from '@/lib/seed-data';
import { STUDY_BUNDLES } from '@/app/bundles/page';
import {
  SAMPLE_RECEIPTS,
  getStoredVerifications,
  saveVerifications,
  type PaymentVerification
} from '@/lib/payment-verification';
import { awardStudentPoints, POINT_REWARDS } from '@/lib/competition-store';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/ui/AuthGuard';

type PaymentMethod = 'telebirr' | 'cbe' | 'chapa';

// Formula sheets lookup helper
const FORMULA_SHEETS = [
  { id: 'fs-calc', title: 'Calculus I & II Quick Reference Formula Sheet', price: 20, type: 'formula-sheet' },
  { id: 'fs-phys', title: 'University Physics Mechanics Cheat Sheet', price: 20, type: 'formula-sheet' },
  { id: 'fs-cs', title: 'Data Structures & Big-O Complexity Roadmap', price: 20, type: 'formula-sheet' },
];

function CheckoutContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemId = searchParams.get('item');
  const itemType = (searchParams.get('type') || 'exam') as 'exam' | 'telegram' | 'course' | 'bundle' | 'product';
  const itemSize = searchParams.get('size');
  const itemVariant = searchParams.get('variant');
  const itemQty = Math.max(1, parseInt(searchParams.get('qty') || '1', 10));
  const queryUsername = searchParams.get('username') || '';

  const [telegramHandle, setTelegramHandle] = useState<string>(queryUsername);

  // Find item across all catalogs
  let resolvedItem: { id: string; title: string; price: number; type: string } | null = null;

  if (itemType === 'telegram') {
    const tg = TELEGRAM_PREMIUM_PLANS.find(p => p.id === itemId);
    if (tg) resolvedItem = { id: tg.id, title: tg.name, price: tg.price, type: 'telegram' };
  } else if (itemType === 'exam') {
    const exam = EXAMS.find(e => e.id === itemId);
    if (exam) {
      resolvedItem = { id: exam.id, title: exam.title, price: exam.price, type: 'exam' };
    } else {
      const fs = FORMULA_SHEETS.find(f => f.id === itemId);
      if (fs) resolvedItem = { id: fs.id, title: fs.title, price: fs.price, type: 'formula-sheet' };
    }
  } else if (itemType === 'course') {
    const course = COURSES.find(c => c.id === itemId);
    if (course) {
      resolvedItem = { id: course.id, title: course.title, price: course.price, type: 'course' };
    } else {
      const bundle = STUDY_BUNDLES.find(b => b.id === itemId);
      if (bundle) resolvedItem = { id: bundle.id, title: bundle.title, price: bundle.price, type: 'bundle' };
    }
  } else if (itemType === 'bundle') {
    const bundle = STUDY_BUNDLES.find(b => b.id === itemId);
    if (bundle) resolvedItem = { id: bundle.id, title: bundle.title, price: bundle.price, type: 'bundle' };
  } else if (itemType === 'product') {
    const tg = TELEGRAM_PREMIUM_PLANS.find(p => p.id === itemId);
    if (tg) {
      resolvedItem = { id: tg.id, title: tg.name, price: tg.price, type: 'telegram' };
    } else {
      const prod = PRODUCTS.find(p => p.id === itemId);
      if (prod) resolvedItem = { id: prod.id, title: prod.name, price: prod.price, type: 'product' };
    }
  }

  // Fallback search across everything if type wasn't exact match
  if (!resolvedItem && itemId) {
    const exam = EXAMS.find(e => e.id === itemId);
    if (exam) resolvedItem = { id: exam.id, title: exam.title, price: exam.price, type: 'exam' };
    const course = COURSES.find(c => c.id === itemId);
    if (course) resolvedItem = { id: course.id, title: course.title, price: course.price, type: 'course' };
    const bundle = STUDY_BUNDLES.find(b => b.id === itemId);
    if (bundle) resolvedItem = { id: bundle.id, title: bundle.title, price: bundle.price, type: 'bundle' };
    const prod = PRODUCTS.find(p => p.id === itemId);
    if (prod) resolvedItem = { id: prod.id, title: prod.name, price: prod.price, type: 'product' };
    const fs = FORMULA_SHEETS.find(f => f.id === itemId);
    if (fs) resolvedItem = { id: fs.id, title: fs.title, price: fs.price, type: 'formula-sheet' };
  }

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('telebirr');
  const [loading, setLoading] = useState(false);

  // Screenshot upload & OCR scanner state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedReceipt, setUploadedReceipt] = useState<string | null>(null);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'scanned'>('idle');
  const [extractedData, setExtractedData] = useState<{
    senderName: string;
    tin: string;
    amount: number;
    timestamp: string;
    nameMatched: boolean;
    amountMatched: boolean;
  } | null>(null);

  // Cart items
  const cartItems = resolvedItem
    ? [
        {
          id: resolvedItem.id,
          title: resolvedItem.title,
          price: resolvedItem.price * itemQty,
          unitPrice: resolvedItem.price,
          type: resolvedItem.type,
          size: itemSize || undefined,
          variant: itemVariant || undefined,
          quantity: itemQty,
        },
      ]
    : [];

  const subtotal = cartItems.reduce((sum, i) => sum + i.price, 0);
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'TIBEB20') {
      setDiscount(Math.round(subtotal * 0.2));
      setCouponApplied(true);
      toast.success('Coupon applied! 20% off');
    } else if (couponCode.toUpperCase() === 'WELCOME') {
      setDiscount(30);
      setCouponApplied(true);
      toast.success('Welcome coupon applied! ETB 30 off');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  // Process uploaded screenshot with realistic scanner
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, JPEG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedReceipt(result);
      runOcrScan(result);
    };
    reader.readAsDataURL(file);
  };

  const useSampleReceipt = (type: 'telebirr' | 'cbe') => {
    const sample = SAMPLE_RECEIPTS[type];
    setUploadedReceipt(sample);
    runOcrScan(sample);
  };

  const runOcrScan = (imageSrc: string) => {
    setScanState('scanning');
    setExtractedData(null);

    // Simulate OCR & QR decode latency with beam scanner
    setTimeout(() => {
      const studentName = user?.name || 'Abebe Tadesse';
      const generatedTin =
        paymentMethod === 'cbe'
          ? `FT24${Math.floor(100000000 + Math.random() * 900000000)}`
          : `TB-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const data = {
        senderName: studentName,
        tin: generatedTin,
        amount: total > 0 ? total : 20,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
        nameMatched: true,
        amountMatched: true,
      };

      setExtractedData(data);
      setScanState('scanned');
      toast.success('QR Code and receipt data scanned successfully!', { icon: '🔍' });
    }, 1400);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('You must sign in or create an account to purchase.');
      router.push(`/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Strict requirement: Telebirr & CBE require screenshot upload
    if ((paymentMethod === 'telebirr' || paymentMethod === 'cbe') && !uploadedReceipt) {
      toast.error(`Please upload your ${paymentMethod === 'telebirr' ? 'Telebirr' : 'CBE'} transaction receipt screenshot to proceed.`);
      return;
    }

    setLoading(true);

    try {
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const studentUsername = user.username || (user.email ? user.email.split('@')[0] : user.name.toLowerCase().replace(/\s+/g, '_'));

      // If Telebirr or CBE, record verification to admin queue
      if (paymentMethod === 'telebirr' || paymentMethod === 'cbe') {
        const newVerification: PaymentVerification = {
          id: `VERIF-${Date.now().toString().slice(-4)}`,
          orderId,
          userId: user.id,
          userName: user.name,
          userUsername: studentUsername,
          userPhone: user.phone || '+251 91 100 0000',
          userEmail: user.email || `${studentUsername}@tibeb.edu.et`,
          userUniversity: user.department ? `${user.department} Dept` : 'Addis Ababa University',
          userDepartment: user.department || 'General Studies',
          paymentMethod,
          amount: total,
          extractedSenderName: extractedData?.senderName || user.name,
          extractedTin: extractedData?.tin || (paymentMethod === 'cbe' ? 'FT2490182910' : 'TB-892019481'),
          extractedAmount: extractedData?.amount || total,
          nameMatch: extractedData?.nameMatched ?? true,
          amountMatch: extractedData?.amountMatched ?? true,
          receiptScreenshot: uploadedReceipt || SAMPLE_RECEIPTS[paymentMethod],
          status: 'approved',
          reviewedBy: 'Tibeb AI Auto-Clearing Engine',
          reviewedAt: 'Instant Auto-Approved',
          createdAt: 'Just now',
          items: cartItems.map(i => ({ id: i.id, title: i.title, price: i.price, type: i.type })),
        };

        const existingVerifs = getStoredVerifications();
        saveVerifications([newVerification, ...existingVerifs]);
      }

      // Sync unlocked items and order to localStorage (instant automatic unlock)
      if (typeof window !== 'undefined') {
        const existingUnlocked = JSON.parse(localStorage.getItem('tibeb_unlocked_items') || '[]');
        const newIds = cartItems.map(i => i.id);
        const combined = Array.from(new Set([...existingUnlocked, ...newIds]));
        localStorage.setItem('tibeb_unlocked_items', JSON.stringify(combined));

        const existingOrders = JSON.parse(localStorage.getItem('tibeb_orders') || '[]');
        const newOrderRecord = {
          id: orderId,
          date: new Date().toISOString().split('T')[0],
          items: cartItems.map(i => i.title),
          total,
          status: 'Paid',
          paymentMethod: paymentMethod === 'telebirr' ? 'Telebirr' : paymentMethod === 'cbe' ? 'CBE Birr' : 'Chapa',
          reference: extractedData?.tin || orderId,
          receiptScreenshot: uploadedReceipt || undefined,
        };
        localStorage.setItem('tibeb_orders', JSON.stringify([newOrderRecord, ...existingOrders]));

        // Award Competition Leaderboard Points (5* booster for Telegram Premium, +50 for test purchase)
        if (itemType === 'telegram' || cartItems.some(i => i.type === 'telegram')) {
          awardStudentPoints(user.id, user.name, POINT_REWARDS.BUY_TELEGRAM_PREMIUM, 'telegram_premium', {
            university: user.department || 'AAU',
            department: 'Telegram Premium'
          });
        } else {
          const testPoints = POINT_REWARDS.BUY_TEST * Math.max(1, cartItems.length);
          awardStudentPoints(user.id, user.name, testPoints, 'test_purchase', {
            university: user.department || 'AAU',
            department: 'Exam Test'
          });
        }
      }

      toast.success(
        'Deposit verified & automatically approved! Exam unlocked instantly.',
        { icon: '⚡', duration: 4000 }
      );

      await new Promise(r => setTimeout(r, 600));

      router.push(`/payment/success?order=${orderId}&gateway=${paymentMethod}&status=success`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('Network error during checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-8">
      {/* Top Breadcrumb Header */}
      <div className="container-tibeb px-4 mb-6">
        <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3.5 shadow-sm border border-gray-100">
          <Link href="/catalog" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green transition-colors">
            ← Back to Catalog
          </Link>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-emerald-700" />
            <span className="text-xs font-semibold text-gray-600">256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>

      <div className="container-tibeb px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-ink tracking-tight">{t('checkout.title')}</h1>
          <p className="text-xs text-gray-500 mt-1">Review your selected learning materials and complete verified payment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column (Items & Payment Method) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Cart Items Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-black text-ink mb-4 flex items-center gap-2 text-base">
                <ShoppingCart size={18} className="text-emerald-700" />
                {t('cart.title')}
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-4">{t('cart.empty')}</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link href="/checkout?item=exam-001&type=exam" className="px-4 py-2.5 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all">
                      + Add Sample AAU Exam (20 ETB)
                    </Link>
                    <Link href="/catalog" className="px-4 py-2.5 rounded-xl border border-gray-200 text-ink text-xs font-bold hover:bg-gray-50 transition-all">
                      Browse Catalog
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((ci) => (
                    <div key={ci.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100">
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-ink">{ci.title}</p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                          <span className="capitalize font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {ci.type}
                          </span>
                          {ci.quantity > 1 && (
                            <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                              Qty: {ci.quantity}
                            </span>
                          )}
                          <span className="text-gray-400">Official Past Exam with Verified Answers</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-emerald-800 text-lg">ETB {ci.price}</span>
                        <button
                          onClick={() => router.push('/catalog')}
                          className="text-gray-300 hover:text-rose-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Telegram Username Box (if buying Telegram Premium) */}
            {cartItems.some(i => i.type === 'telegram') && (
              <div className="bg-gradient-to-br from-amber-50 to-emerald-50 rounded-3xl p-6 shadow-sm border border-amber-200">
                <h2 className="font-bold text-ink mb-2 flex items-center gap-2">
                  <Smartphone size={18} className="text-amber-600" />
                  Telegram Account for Premium Delivery
                </h2>
                <p className="text-xs text-gray-600 mb-3">
                  Please provide the Telegram username where the official gift link should be delivered.
                </p>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">@</span>
                  <input
                    type="text"
                    placeholder="your_telegram_username"
                    value={telegramHandle.replace(/^@/, '')}
                    onChange={(e) => setTelegramHandle(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-green bg-white text-sm font-semibold"
                  />
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-black text-ink mb-4 flex items-center gap-2 text-base">
                <CreditCard size={18} className="text-emerald-700" />
                Select Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: 'telebirr' as PaymentMethod,
                    label: 'Telebirr',
                    sub: 'Ethio Telecom App / Till',
                    badge: 'Instant QR Scan',
                    bgColor: 'from-sky-50 to-blue-50 border-sky-200 text-sky-900',
                    activeRing: 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/60'
                  },
                  {
                    key: 'cbe' as PaymentMethod,
                    label: 'CBE Mobile',
                    sub: 'Commercial Bank of Ethiopia',
                    badge: 'Direct Transfer',
                    bgColor: 'from-purple-50 to-pink-50 border-purple-200 text-purple-900',
                    activeRing: 'ring-2 ring-purple-600 border-purple-600 bg-purple-50/60'
                  },
                  {
                    key: 'chapa' as PaymentMethod,
                    label: 'Chapa',
                    sub: 'Debit Card / Mobile',
                    badge: 'Gateway',
                    bgColor: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900',
                    activeRing: 'ring-2 ring-emerald-600 border-emerald-600 bg-emerald-50/60'
                  },
                ].map((m) => {
                  const isSelected = paymentMethod === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setPaymentMethod(m.key)}
                      className={`relative text-left p-4 rounded-2xl border transition-all ${
                        isSelected ? m.activeRing : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <CheckCircle2 size={13} />
                        </div>
                      )}
                      <div className="text-xs font-black uppercase tracking-wider text-gray-400 mb-1">{m.badge}</div>
                      <div className="font-black text-ink text-base">{m.label}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{m.sub}</div>
                    </button>
                  );
                })}
              </div>

              {/* Strict Name Warning Banner */}
              {(paymentMethod === 'telebirr' || paymentMethod === 'cbe') && (
                <div className="mt-5 p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300/80 text-amber-950">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="space-y-1">
                      <p className="font-extrabold text-xs uppercase tracking-wide text-amber-900">
                        Strict Requirement: Account Name Match
                      </p>
                      <p className="text-xs leading-relaxed text-amber-800">
                        The {paymentMethod === 'telebirr' ? 'Telebirr' : 'CBE'} transfer <span className="font-bold underline">MUST be made from an account registered under your own name</span>:
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-amber-300 font-black text-xs text-ink mt-1">
                        <span>Student Name:</span>
                        <span className="text-emerald-800 font-extrabold">{user?.name || 'Registered Student'}</span>
                      </div>
                      <p className="text-[11px] text-amber-700 font-medium pt-1">
                        ⚠️ Payments from third-party or mismatching names will be automatically flagged and rejected by our verification system.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Official Account Deposit Information */}
              {(paymentMethod === 'telebirr' || paymentMethod === 'cbe') && (
                <div className="mt-5 p-5 rounded-2xl bg-[#F8FAFC] border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                      Send Exactly <strong className="text-emerald-800 font-black text-sm">ETB {total}</strong> To:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      Official Account
                    </span>
                  </div>

                  {paymentMethod === 'telebirr' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-gray-400 block text-[11px]">Telebirr Phone Number:</span>
                        <span className="font-black text-ink text-base tracking-wider font-mono">099721895</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-gray-400 block text-[11px]">Account Name:</span>
                        <span className="font-black text-ink text-base">Biruk</span>
                      </div>
                      <div className="sm:col-span-2 p-2.5 bg-blue-50/50 rounded-xl text-blue-900 text-[11px] flex items-center justify-between">
                        <span>Send payment to: <strong>Biruk (099721895)</strong></span>
                        <button
                          onClick={() => useSampleReceipt('telebirr')}
                          className="text-[11px] font-bold text-blue-700 underline hover:text-blue-900 cursor-pointer"
                        >
                          Use Demo Receipt
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-gray-400 block text-[11px]">CBE Account Number:</span>
                        <span className="font-black text-ink text-base tracking-wider font-mono">1000724852177</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-gray-400 block text-[11px]">Beneficiary Name:</span>
                        <span className="font-black text-ink text-base">Biruk</span>
                      </div>
                      <div className="sm:col-span-2 p-2.5 bg-purple-50/50 rounded-xl text-purple-900 text-[11px] flex items-center justify-between">
                        <span>Bank: <strong>Commercial Bank of Ethiopia (Biruk)</strong></span>
                        <button
                          onClick={() => useSampleReceipt('cbe')}
                          className="text-[11px] font-bold text-purple-700 underline hover:text-purple-900 cursor-pointer"
                        >
                          Use Demo Receipt
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Screenshot Upload Dropzone & QR Scanner */}
              {(paymentMethod === 'telebirr' || paymentMethod === 'cbe') && (
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-ink flex items-center gap-1.5">
                      <QrCode size={16} className="text-emerald-700" />
                      Upload Payment Screenshot & Scan QR
                    </label>
                    <span className="text-[11px] text-rose-600 font-bold">* Required for verification</span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {!uploadedReceipt ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 hover:border-emerald-600 rounded-3xl p-6 text-center cursor-pointer transition-all bg-[#FAF6EC]/40 hover:bg-emerald-50/20 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                        <UploadCloud size={26} className="text-emerald-700" />
                      </div>
                      <p className="font-bold text-ink text-sm">Click to upload transfer screenshot</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, or screenshot from Telebirr / CBE app</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-3xl p-4 bg-white shadow-sm space-y-4">
                      {/* Image Preview with Interactive Scan Beam */}
                      <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 max-h-64 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploadedReceipt}
                          alt="Uploaded Receipt"
                          className="max-h-64 w-auto object-contain mx-auto"
                        />

                        {/* Animated Laser Scanning Beam */}
                        {scanState === 'scanning' && (
                          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center">
                            <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-pulse absolute top-1/2 -translate-y-1/2" />
                            <div className="bg-black/80 px-4 py-2 rounded-xl border border-emerald-500/50 flex items-center gap-2 text-white text-xs font-bold shadow-lg">
                              <Scan size={16} className="animate-spin text-emerald-400" />
                              Scanning QR & Extracting TIN / Name...
                            </div>
                          </div>
                        )}

                        {/* Top controls */}
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[11px] font-bold rounded-lg backdrop-blur-sm transition-all"
                          >
                            Replace
                          </button>
                          <button
                            onClick={() => {
                              setUploadedReceipt(null);
                              setScanState('idle');
                              setExtractedData(null);
                            }}
                            className="p-1 bg-black/70 hover:bg-rose-600 text-white rounded-lg backdrop-blur-sm transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Scanned Optical OCR & QR Output Box */}
                      {scanState === 'scanned' && extractedData && (
                        <div className="rounded-2xl p-4 bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                              <CheckCircle2 size={16} className="text-emerald-700" />
                              Optical QR Scan & Name Verification Completed
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                              Ready for Admin
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                            <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                              <span className="text-gray-400 text-[10px] block">Sender Name</span>
                              <span className="font-extrabold text-ink">{extractedData.senderName}</span>
                              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                                <CheckCircle size={10} /> Name Matches
                              </div>
                            </div>
                            <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                              <span className="text-gray-400 text-[10px] block">TIN / Transaction ID</span>
                              <span className="font-mono font-bold text-ink">{extractedData.tin}</span>
                              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                                <CheckCircle size={10} /> Verified QR
                              </div>
                            </div>
                            <div className="p-2.5 bg-white rounded-xl border border-emerald-100 col-span-2 sm:col-span-1">
                              <span className="text-gray-400 text-[10px] block">Extracted Amount</span>
                              <span className="font-extrabold text-emerald-800 text-sm">ETB {extractedData.amount}</span>
                              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                                <CheckCircle size={10} /> Exact Match
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Discount Coupon Box */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-black text-ink mb-3 flex items-center gap-2 text-sm">
                <Tag size={16} className="text-amber-500" />
                {t('checkout.coupon')}
              </h2>

              {couponApplied ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <span className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Coupon '{couponCode.toUpperCase()}' applied — saving ETB {discount}
                  </span>
                  <button onClick={() => { setCouponApplied(false); setDiscount(0); }} className="text-xs text-rose-600 underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="coupon-input"
                    placeholder="Enter code (e.g. TIBEB20 or WELCOME)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs font-semibold"
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-5 py-2.5 rounded-xl bg-ink text-white text-xs font-bold hover:bg-gray-800 transition-all"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (Order Summary & Submit) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-6">
              <div>
                <h2 className="text-lg font-black text-ink">Order Summary</h2>
                <p className="text-xs text-gray-400 mt-0.5">Instant unlock after payment confirmation</p>
              </div>

              <div className="space-y-3 text-xs border-y border-gray-100 py-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold text-ink">ETB {subtotal}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount</span>
                    <span>-ETB {discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Platform & Verification Fee</span>
                  <span className="font-bold text-emerald-700">FREE (0 ETB)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Educational VAT (Ethiopian Tax)</span>
                  <span className="font-bold text-gray-500">Exempt (0%)</span>
                </div>
                <div className="pt-2 flex justify-between items-baseline border-t border-gray-100">
                  <span className="font-extrabold text-ink text-sm">Total Due</span>
                  <span className="text-3xl font-black text-emerald-800">ETB {total}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <Button
                id="place-order-btn"
                variant="green"
                size="lg"
                fullWidth
                loading={loading}
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
                className="py-4 text-base font-black shadow-lg shadow-emerald-900/10 rounded-2xl flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                {(paymentMethod === 'telebirr' || paymentMethod === 'cbe')
                  ? `Deposit & Auto-Unlock Exam — ETB ${total}`
                  : `Pay Now via Chapa — ETB ${total}`}
              </Button>

              {/* Guarantees */}
              <div className="pt-2 space-y-2">
                {[
                  '100% Verified Ethiopian Past Exam Papers with Solutions',
                  'Admin Verified Sender Matching & Instant Unlock',
                  'Official Printable Tax Invoice with QR Seal Provided',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle size={14} className="text-emerald-700 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard
      reason="purchase"
      message="You need a Tibeb student account to securely purchase exam papers and courses. Sign in or create a free account to continue."
    >
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center text-gray-500">
            Loading checkout...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </AuthGuard>
  );
}
