'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  X, ShoppingBag, Trash2, Zap, ArrowRight, CheckCircle,
  Plus, CreditCard, ShieldCheck, Sparkles, BookOpen, Tag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { validateCoupon, recordCouponUsage } from '@/lib/coupon-store';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { user, walletBalance, payWithWallet, topUpWallet } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(100);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; label: string } | null>(null);

  if (!isCartOpen) return null;

  const finalTotal = Math.max(0, cartTotal - (appliedCoupon ? appliedCoupon.discount : 0));

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    const res = validateCoupon(couponCode, cartTotal, user?.id);
    if (res.valid && res.coupon) {
      setAppliedCoupon({
        code: res.coupon.code,
        discount: res.discountAmount,
        label: res.coupon.discountType === 'percentage'
          ? `${res.coupon.discountValue}% OFF`
          : `${res.coupon.discountValue} ETB OFF`
      });
      toast.success(`Coupon "${res.coupon.code}" applied!`);
    } else {
      setAppliedCoupon(null);
      toast.error(res.error || 'Invalid or expired coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const handleWalletCheckout = async () => {
    if (cart.length === 0) return;
    if (walletBalance < finalTotal) {
      toast.error('Insufficient wallet balance. Top up your wallet or pay with Telebirr.');
      return;
    }

    setIsProcessing(true);
    try {
      const itemIds = cart.map(i => i.id);
      const success = payWithWallet(finalTotal, itemIds);

      if (success) {
        if (appliedCoupon && user) {
          recordCouponUsage(appliedCoupon.code, user.id);
        }
        toast.success(`🎉 Unlocked ${cart.length} item${cart.length > 1 ? 's' : ''} instantly from your wallet!`, {
          duration: 4000,
        });
        clearCart();
        setIsCartOpen(false);
        router.push('/dashboard/library');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const handleTopUp = () => {
    topUpWallet(topUpAmount);
    toast.success(`+${topUpAmount} ETB deposited to your Tibeb Wallet via Telebirr!`);
    setShowTopUpModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-green-muted text-green flex items-center justify-center font-bold">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-ink">Study Cart</h2>
                <p className="text-xs text-gray-500">{cart.length} item{cart.length === 1 ? '' : 's'} selected</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-ink hover:bg-gray-100 transition-colors"
            >
              <X size={19} />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-green-muted/60 text-green flex items-center justify-center">
                  <BookOpen size={30} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink mb-1">Your cart is empty</h3>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    Select 20 ETB past exams from AAU, Unity, or ASTU to revise questions and step-by-step solutions.
                  </p>
                </div>
                <button
                  onClick={() => { setIsCartOpen(false); router.push('/catalog'); }}
                  className="btn btn-green btn-sm"
                >
                  Explore 20 ETB Exams
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-gray-400 pb-1">
                  <span>Selected Exam Papers & Materials</span>
                  <button
                    onClick={clearCart}
                    className="text-red-tibeb hover:underline font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-between gap-3 hover:border-gray-200 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          {item.university && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-ink text-white">
                              {item.university}
                            </span>
                          )}
                          {item.code && (
                            <span className="text-[10px] font-semibold text-gray-500">
                              {item.code}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-ink truncate leading-tight">
                          {item.title}
                        </h4>
                        <span className="text-[11px] font-black text-green mt-0.5 block">
                          {item.price === 0 ? 'Free' : `${item.price} ETB`}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-tibeb hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout Options */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-white space-y-4">
              {/* Student Wallet Status Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center font-bold">
                    <Zap size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block leading-none">
                      Tibeb Student Wallet
                    </span>
                    <span className="text-sm font-black text-ink">
                      {walletBalance} ETB <span className="text-[11px] font-normal text-gray-500">available</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowTopUpModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-gold text-ink font-bold text-[11px] hover:bg-gold-dark transition-colors flex items-center gap-1"
                >
                  <Plus size={12} /> Top Up
                </button>
              </div>

              {/* Coupon Code Input */}
              <div className="pt-1">
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-emerald-700" />
                      <span className="font-mono font-bold text-xs text-emerald-800 uppercase">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                        -{appliedCoupon.discount} ETB ({appliedCoupon.label})
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter promo coupon code"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs uppercase font-mono font-bold text-ink focus:outline-none focus:ring-1 focus:ring-green tracking-wider placeholder:normal-case placeholder:font-sans"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 rounded-xl bg-ink hover:bg-gray-800 text-white font-extrabold text-xs transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Total Summary */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Total Amount ({cart.length} items)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-ink">{finalTotal} ETB</span>
                    {appliedCoupon && appliedCoupon.discount > 0 && (
                      <span className="text-xs text-gray-400 line-through font-bold">{cartTotal} ETB</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                    ✓ Instant Lifetime Access
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* 1-Click Wallet Checkout (FASTEST) */}
                <button
                  onClick={handleWalletCheckout}
                  disabled={isProcessing || walletBalance < finalTotal}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                    walletBalance >= finalTotal
                      ? 'bg-green hover:bg-green-dark text-white cursor-pointer shadow-green/30'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Zap size={15} className={walletBalance >= finalTotal ? 'text-gold fill-gold' : ''} />
                  {isProcessing
                    ? 'Unlocking...'
                    : walletBalance >= finalTotal
                    ? `1-Click Wallet Pay (${finalTotal} ETB)`
                    : `Wallet Balance Low (Need ${finalTotal - walletBalance} ETB)`}
                </button>

                {/* Direct Live Telebirr / Chapa Pay */}
                <button
                  onClick={handleDirectCheckout}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-ink text-ink hover:bg-ink hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <CreditCard size={15} />
                  Pay with Telebirr / Chapa
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-1">
                <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green" /> Telebirr & CBE Verified</span>
                <span>•</span>
                <span>AAU · Unity · ASTU</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top-up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-5 animate-in zoom-in-95 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center font-bold">
                  <Zap size={16} />
                </div>
                <h3 className="font-bold text-ink text-base">Top Up Student Wallet</h3>
              </div>
              <button onClick={() => setShowTopUpModal(false)} className="text-gray-400 hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Deposit birr once via Telebirr or CBE Birr. Unlocks 20 ETB exams with zero SMS wait times!
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 200].map(amt => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-3 rounded-2xl text-xs font-black border transition-all ${
                    topUpAmount === amt
                      ? 'border-green bg-green text-white shadow-sm'
                      : 'border-gray-200 bg-slate-50 text-ink hover:border-green'
                  }`}
                >
                  +{amt} ETB
                </button>
              ))}
            </div>

            <button
              onClick={handleTopUp}
              className="w-full py-3.5 rounded-2xl bg-green hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              Deposit {topUpAmount} ETB via Telebirr
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
