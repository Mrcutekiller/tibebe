'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText, Download, CheckCircle, Clock, ChevronRight,
  Printer, ArrowLeft, ShieldCheck, ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/ui/AuthGuard';

import TibebBillModal, { BillOrder } from '@/components/billing/TibebBillModal';

interface Order extends BillOrder {}

function OrdersContent() {
  const { user } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null);

  const defaultOrders: Order[] = [
    {
      id: 'INV-2026-88124',
      date: 'Today, 2:15 PM',
      itemTitle: 'AAU Applied Mathematics I (MATH 1011) Final Exam + Solutions',
      itemType: 'Exam',
      price: 20,
      paymentMethod: 'Telebirr',
      status: 'Completed',
      customerName: user?.name || 'Abebe Kebede',
      university: 'Addis Ababa University (AAU)',
      department: 'Faculty of Technology & Computer Science',
      studentId: 'AAU/ET-84920',
      txHash: 'TLB-8910482103'
    },
    {
      id: 'INV-2026-75190',
      date: 'Yesterday, 10:40 AM',
      itemTitle: 'Telegram Premium 6 Months Instant Activation',
      itemType: 'Telegram',
      price: 3990,
      paymentMethod: 'Telebirr',
      status: 'Completed',
      customerName: user?.name || 'Abebe Kebede',
      university: 'Addis Ababa University (AAU)',
      department: 'Engineering Department',
      studentId: 'AAU/ET-84920',
      txHash: 'TLB-7462910384'
    },
    {
      id: 'INV-2026-62104',
      date: '3 days ago',
      itemTitle: 'General Physics Mechanics (PHYS 1011) Mid Exam Papers',
      itemType: 'Exam',
      price: 20,
      paymentMethod: 'Student Wallet',
      status: 'Completed',
      customerName: user?.name || 'Abebe Kebede',
      university: 'Addis Ababa University (AAU)',
      department: 'Applied Physics',
      studentId: 'AAU/ET-84920',
      txHash: 'WLT-5928104829'
    }
  ];

  const [orders, setOrders] = useState<Order[]>(defaultOrders);

  React.useEffect(() => {
    // 1. Load from localStorage for immediate responsiveness
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('tibeb_orders') || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
          const formatted: Order[] = stored.map((o: any) => ({
            id: o.id,
            date: o.date || 'Today',
            itemTitle: Array.isArray(o.items) ? o.items.join(', ') : (o.itemTitle || 'Academic Material'),
            itemType: (o.itemType || 'Exam') as any,
            price: o.total || o.price || 20,
            paymentMethod: (o.paymentMethod || 'Telebirr') as any,
            status: 'Completed' as const,
          }));

          setOrders(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newOrders = formatted.filter(f => !existingIds.has(f.id));
            return [...newOrders, ...prev];
          });
        }
      } catch (err) {
        console.error('Error parsing stored orders:', err);
      }
    }

    // 2. Fetch from backend API
    if (user?.id) {
      fetch(`/api/orders/user?userId=${encodeURIComponent(user.id)}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && Array.isArray(data.orders)) {
            const apiOrders: Order[] = data.orders.map((o: any) => ({
              id: o.id,
              date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              itemTitle: o.items.map((i: any) => i.title).join(', '),
              itemType: (o.items[0]?.type === 'course' ? 'Course' : 'Exam') as any,
              price: o.total,
              paymentMethod: (o.paymentGateway === 'telebirr' ? 'Telebirr' : 'Chapa') as any,
              status: 'Completed' as const,
            }));

            setOrders(prev => {
              const existingIds = new Set(prev.map(p => p.id));
              const newOrders = apiOrders.filter(ao => !existingIds.has(ao.id));
              return [...newOrders, ...prev];
            });
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="container-tibeb max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-green transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <span className="text-xs text-gray-400 font-medium">Tibeb Verified Payments</span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
            <div>
              <h1 className="text-2xl font-black text-ink mb-1">Order History & Receipts</h1>
              <p className="text-xs text-gray-400">View and print official receipts for your 20 ETB exams and courses.</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> All Transactions Encrypted
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-green/30 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-ink">{order.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-400">• {order.date}</span>
                  </div>
                  <h4 className="font-bold text-ink text-sm mb-1">{order.itemTitle}</h4>
                  <p className="text-xs text-gray-500">
                    Paid via <strong>{order.paymentMethod}</strong> • {order.itemType}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                  <span className="text-base font-black text-green">{order.price} ETB</span>
                  <button
                    onClick={() => setSelectedReceipt(order)}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-ink text-xs font-bold hover:bg-emerald-50 hover:border-green/40 hover:text-green flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Download size={13} className="text-green" />
                    <span>View & Download Bill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Original Official Bill Modal */}
        <TibebBillModal
          order={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}
