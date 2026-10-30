'use client';

import React, { useRef } from 'react';
import {
  Download, Printer, CheckCircle, ShieldCheck,
  FileText, QrCode, Sparkles, X, Share2, Copy, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface BillOrder {
  id: string;
  date: string;
  itemTitle: string;
  itemType: 'Exam' | 'Course' | 'Bundle' | 'Telegram';
  price: number;
  paymentMethod: 'Telebirr' | 'Chapa' | 'CBE Birr' | 'Student Wallet';
  status: 'Completed' | 'Paid';
  customerName?: string;
  university?: string;
  department?: string;
  studentId?: string;
  courseCode?: string;
  academicYear?: string;
  txHash?: string;
}

interface TibebBillModalProps {
  order: BillOrder | null;
  onClose: () => void;
}

export default function TibebBillModal({ order, onClose }: TibebBillModalProps) {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const invoiceNum = order.id.startsWith('INV-') ? order.id : `INV-${order.id.replace(/[^0-9A-Z]/g, '').slice(-8) || '2026-8812'}`;
  const txRef = order.txHash || `TXN-TLB-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const studentName = order.customerName || 'Abebe Kebede';
  const university = order.university || 'Addis Ababa University (AAU)';
  const department = order.department || 'Faculty of Technology & Sciences';
  const studentId = order.studentId || 'ETS-2026/8941';

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/verify?invoice=${encodeURIComponent(invoiceNum)}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Official verification link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in print:p-0 print:bg-white">
      {/* Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-950/20 overflow-hidden my-auto print:shadow-none print:border-none print:max-w-none print:rounded-none">
        
        {/* Floating Top Actions Bar (Hidden on print) */}
        <div className="print:hidden bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
              Official Tibeb Electronic Tax Bill
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-green hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer size={13} />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Copy verification link"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-all cursor-pointer ml-1"
              title="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Printable Bill Paper */}
        <div ref={printRef} className="p-6 sm:p-10 bg-[#FCFAF5] text-[#12202B] relative selection:bg-gold/30">
          
          {/* Subtle Guilloche / Gold decorative top border */}
          <div className="h-2 w-full bg-gradient-to-r from-[#0B5D3B] via-[#E0A526] to-[#0B5D3B] rounded-full mb-6" />

          {/* Header Lockup */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-emerald-900/15">
            {/* Logo & Brand Info */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0B5D3B] border-2 border-[#E0A526]/50 flex items-center justify-center p-2.5 shadow-md flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-transparent.png"
                  alt="Tibeb Logo"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-[#0B5D3B]">TIBEB</h1>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#E0A526]/20 text-[#966b0a] border border-[#E0A526]/40">
                    Official Invoice
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Ethiopian Educational Resources & Digital Certification Bank
                </p>
                <p className="text-[11px] text-gray-400">
                  TIN: 0092481024 • Addis Ababa, Ethiopia • Support: @TibebSupport
                </p>
              </div>
            </div>

            {/* Invoice Meta Box */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-sm sm:text-right min-w-[200px]">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                Invoice Reference
              </span>
              <span className="font-mono text-base font-black text-ink block tracking-tight">
                {invoiceNum}
              </span>
              <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] space-y-0.5">
                <p className="text-gray-500">Date: <strong className="text-ink">{order.date}</strong></p>
                <p className="text-gray-500">Method: <strong className="text-emerald-700">{order.paymentMethod}</strong></p>
              </div>
            </div>
          </div>

          {/* Student & Billed-To Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-sm text-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                Billed To (Verified Student)
              </span>
              <h3 className="font-bold text-sm text-ink">{studentName}</h3>
              <p className="text-gray-600 font-medium mt-0.5">{university}</p>
              <p className="text-gray-500">{department}</p>
              <p className="text-[11px] font-mono text-gray-400 mt-1">Student ID: {studentId}</p>
            </div>

            <div className="sm:text-right flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                  Payment Verification
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <CheckCircle size={13} className="text-emerald-600" />
                  <span>PAID & SETTLED</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-gray-500 font-mono">
                TxID: <span className="font-bold text-ink">{txRef}</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-sm overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B5D3B] text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-3 text-center">Type</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Amount (ETB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-ink text-sm leading-snug">{order.itemTitle}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Full step-by-step verified solutions & permanent digital access
                    </p>
                  </td>
                  <td className="py-3.5 px-3 text-center font-semibold text-emerald-800">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px]">
                      {order.itemType}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-gray-600">
                    1
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-ink text-sm">
                    {order.price}.00 ETB
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Calculations & Total */}
            <div className="bg-gray-50/80 p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <div className="text-[11px] text-gray-500 max-w-xs text-center sm:text-left">
                Payment processed in Ethiopian Birr via official payment partner. Zero additional processing fees.
              </div>

              <div className="w-full sm:w-64 space-y-1.5 text-right">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal:</span>
                  <span className="font-medium text-ink">{order.price}.00 ETB</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Educational VAT (0% Exempt):</span>
                  <span className="font-medium text-ink">0.00 ETB</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-black text-base text-[#0B5D3B]">
                  <span>Total Paid:</span>
                  <span className="text-lg">{order.price}.00 ETB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Verification Watermark & QR Footprint */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center p-1 shadow-sm">
                <QrCode size={36} className="text-[#0B5D3B]" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 block flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Tibeb Verified Academic Ledger
                </span>
                <p className="text-[11px] text-gray-600">
                  Scan QR code or visit <strong className="text-ink">tibeb.edu.et/verify</strong> with Invoice ID to confirm authenticity.
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="inline-block px-3 py-1 rounded-lg border-2 border-dashed border-[#0B5D3B] text-[#0B5D3B] font-mono text-[10px] font-bold uppercase tracking-wider">
                ORIGINAL ELECTRONIC BILL
              </div>
            </div>
          </div>

          {/* Footer Legal Note */}
          <div className="mt-6 text-center text-[10px] text-gray-400">
            Thank you for learning with Tibeb. For billing support, contact support@tibeb.edu.et or Telegram @TibebSupport.
          </div>
        </div>

        {/* Bottom Actions Bar (Hidden on print) */}
        <div className="print:hidden p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-500 font-medium">
            Saved securely in your account order history.
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#083d28] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Download size={14} />
              <span>Download / Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-ink font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

