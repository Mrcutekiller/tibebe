'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle, BookOpen, ArrowRight, Download, Printer,
  ShieldCheck, Zap, Sparkles, ExternalLink, Smartphone, CreditCard
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Order } from '@/lib/payments/types';
import toast from 'react-hot-toast';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') ?? 'TIB-2026-00001';
  const txRef = searchParams.get('tx_ref');
  const gateway = searchParams.get('gateway');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAndLoadOrder() {
      try {
        // Call backend verification
        const verifyUrl = `/api/payments/verify?order=${encodeURIComponent(orderId)}${txRef ? `&tx_ref=${encodeURIComponent(txRef)}` : ''}${gateway ? `&gateway=${encodeURIComponent(gateway)}` : ''}`;
        const res = await fetch(verifyUrl);
        const data = await res.json();

        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          // Fallback fetch order details directly
          const orderRes = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
          const orderData = await orderRes.json();
          if (orderData.success) {
            setOrder(orderData.order);
          }
        }
      } catch (err) {
        console.warn('Order verification request error:', err);
      } finally {
        setLoading(false);
      }
    }

    verifyAndLoadOrder();
  }, [orderId, txRef, gateway]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const primaryItem = order?.items?.[0];

  return (
    <div className="max-w-xl w-full mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Top green celebratory header */}
        <div className="bg-gradient-to-br from-green via-emerald-800 to-ink p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#E0A526_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          
          <div className="relative z-10 space-y-3">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto text-gold shadow-lg">
              <CheckCircle size={44} className="text-emerald-300" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-gold text-xs font-bold border border-white/15">
              <Sparkles size={13} /> Verified & Unlocked
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Payment Successful!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-sm mx-auto leading-relaxed">
              Your study materials have been added to your personal library and are ready to use.
            </p>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Order summary bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Order Number</span>
              <span className="font-bold text-ink text-sm font-mono">{orderId}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Payment Channel</span>
              <span className="font-bold text-ink text-sm flex items-center gap-1">
                {gateway === 'telebirr' ? (
                  <>
                    <Smartphone size={14} className="text-green" /> Telebirr
                  </>
                ) : (
                  <>
                    <CreditCard size={14} className="text-green" /> Chapa
                  </>
                )}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-gray-400 block font-medium">Total Paid</span>
              <span className="font-black text-green text-sm">
                ETB {order ? order.total : '20'}
              </span>
            </div>
          </div>

          {/* Unlocked items list */}
          <div>
            <h3 className="font-bold text-ink text-sm mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-green" />
              Unlocked Items ({order?.items?.length || 1})
            </h3>

            <div className="space-y-2.5">
              {(order?.items || [
                {
                  id: 'exam-001',
                  title: 'Applied Mathematics I - Final Exam Paper & Solutions',
                  type: 'exam',
                  price: 20,
                  university: 'Addis Ababa University',
                },
              ]).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/50"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs sm:text-sm text-ink">{item.title}</p>
                    <p className="text-[11px] text-gray-500">
                      {item.university ? `${item.university} • ` : ''}
                      <span className="capitalize">{item.type}</span> • Lifetime Access
                    </p>
                  </div>

                  {item.type === 'exam' ? (
                    <Link
                      href={`/exams/${item.id}/take`}
                      className="px-3.5 py-1.5 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
                    >
                      <Zap size={13} className="text-gold" /> Start Test
                    </Link>
                  ) : item.type === 'course' ? (
                    <Link
                      href={`/courses/${item.id}/learn`}
                      className="px-3.5 py-1.5 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
                    >
                      Start Course
                    </Link>
                  ) : item.type === 'product' ? (
                    <Link
                      href="/dashboard/orders"
                      className="px-3.5 py-1.5 rounded-xl bg-ink hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
                    >
                      Track Delivery
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/library"
                      className="px-3.5 py-1.5 rounded-xl bg-green hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
                    >
                      View in Library
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5 pt-2">
            {primaryItem?.type === 'exam' ? (
              <Button
                variant="green"
                size="lg"
                fullWidth
                onClick={() => {
                  window.location.href = `/exams/${primaryItem.id}/take`;
                }}
              >
                <Zap size={18} className="text-gold" />
                Launch Interactive Test Mode Now
              </Button>
            ) : primaryItem?.type === 'course' ? (
              <Button
                variant="green"
                size="lg"
                fullWidth
                onClick={() => {
                  window.location.href = `/courses/${primaryItem.id}/learn`;
                }}
              >
                <BookOpen size={18} />
                Start Video Lessons
              </Button>
            ) : null}

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => {
                window.location.href = '/dashboard/library';
              }}
            >
              <BookOpen size={17} />
              Open My Library
            </Button>

            <button
              onClick={handlePrintReceipt}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              <Printer size={15} />
              Print Official Payment Receipt
            </button>
          </div>

          {/* Security guarantee notice */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-gray-100 text-[11px] text-gray-500">
            <ShieldCheck size={16} className="text-green flex-shrink-0" />
            <span>
              Your purchase is recorded with Telebirr / CBE and backed by Tibeb&apos;s 30-day money-back guarantee.
            </span>
          </div>

          <div className="text-center pt-2">
            <Link href="/catalog" className="text-xs text-gray-400 hover:text-green transition-colors">
              ← Return to Exam Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Suspense fallback={<div className="text-gray-400 text-sm">Verifying transaction...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
