'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Sparkles, FileText, Library, ShoppingBag,
  Award, Zap, Settings, HelpCircle, LogOut, Wallet, Plus,
  Menu, X, Shield, Globe, ArrowRight, ChevronRight, UserCheck, Trophy, Smartphone
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import AuthGuard from '@/components/ui/AuthGuard';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'My Account & Profile', icon: UserCheck },
  { href: '/dashboard/competition', label: 'Competition & Prizes', icon: Trophy, badge: '🏆 1K' },
  { href: '/download', label: 'Download Mobile App', icon: Smartphone, badge: 'APK' },
  { href: '/dashboard/smart-notes', label: 'Smart Notes & Flash', icon: Sparkles, badge: 'AI' },
  { href: '/dashboard/catalog', label: 'Exam Tests', icon: FileText },
  { href: '/dashboard/library', label: 'My Library', icon: Library },
  { href: '/dashboard/orders', label: 'Orders & Bills', icon: ShoppingBag },
  { href: '/dashboard/certificates', label: 'Certificates', icon: Award },
  { href: '/dashboard/telegram-premium', label: 'Telegram Premium', icon: Zap, badge: '⚡' },
  { href: '/dashboard/help', label: 'Help & FAQ', icon: HelpCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, walletBalance, signOut } = useAuth();
  const { locale, toggleLocale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [depositMethod, setDepositMethod] = useState<'telebirr' | 'cbe'>('telebirr');

  const displayName = user?.name || 'Tibeb Student';
  const displayDepartment = user?.department || 'Addis Ababa University';

  const handleStartDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || depositAmount <= 0) {
      toast.error('Please enter a valid deposit amount (e.g. 50 ETB or more).');
      return;
    }
    setShowDepositModal(false);
    router.push(`/payment?amount=${depositAmount}&method=${depositMethod}&type=deposit`);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F6F8FA] flex flex-col lg:flex-row">
        
        {/* =========================================================================
            MOBILE TOP HEADER (Visible only on < lg screens)
           ========================================================================= */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#083D28] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu size={22} />
            </button>

            <Link href="/dashboard" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-transparent.png" alt="Tibeb" className="w-7 h-7 object-contain" />
              <span className="font-black text-lg text-white">Tibeb</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDepositModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/20 text-gold border border-gold/40 text-xs font-bold hover:bg-gold/30 transition-all cursor-pointer"
            >
              <Wallet size={13} />
              <span>{walletBalance} ETB</span>
              <Plus size={12} className="bg-gold text-ink rounded-full" />
            </button>

            <Link
              href="/dashboard/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold to-amber-400 text-ink font-black text-xs flex items-center justify-center shadow-sm overflow-hidden"
              title="My Account & Profile"
            >
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </Link>
          </div>
        </header>

        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* =========================================================================
            PERSISTENT SIDEBAR (NEVER DISAPPEARS WHEN CHANGING PAGES)
           ========================================================================= */}
        <aside
          className={cn(
            'fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B5D3B] text-white flex flex-col shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:static lg:z-30 lg:shadow-none flex-shrink-0',
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Brand header */}
          <div className="p-5 border-b border-emerald-800/60 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center p-1.5 border border-white/15 shadow-sm group-hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-transparent.png" alt="Tibeb Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-white">Tibeb</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-gold text-ink">
                    Bank
                  </span>
                </div>
                <span className="text-[10px] text-emerald-200/80 font-medium">Student Portal</span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800"
            >
              <X size={20} />
            </button>
          </div>

          {/* Student Profile & Account Snippet */}
          <div className="px-5 py-4 border-b border-emerald-800/40 bg-emerald-900/30">
            <Link
              href="/dashboard/profile"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 p-2 -m-2 rounded-2xl hover:bg-emerald-800/50 transition-all group cursor-pointer"
              title="View & Edit Student Account Profile"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold to-amber-400 text-ink font-black flex items-center justify-center text-sm shadow-md group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
                {user?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <ChevronRight size={13} className="text-emerald-300 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-emerald-300/80 truncate">{displayDepartment}</p>
                <span className="text-[9px] font-extrabold text-gold uppercase tracking-wider block mt-0.5">
                  Account & Profile →
                </span>
              </div>
            </Link>

            {/* Wallet Balance Card with Deposit Action */}
            <div className="mt-3.5 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-bold block">Wallet Balance</span>
                <span className="text-base font-black text-gold tracking-tight">{walletBalance} <span className="text-xs font-bold text-white">ETB</span></span>
              </div>
              <button
                onClick={() => {
                  setShowDepositModal(true);
                  setMobileSidebarOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gold hover:bg-amber-400 text-ink text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                <Plus size={13} className="stroke-[3]" />
                <span>Deposit</span>
              </button>
            </div>
          </div>

          {/* Nav items list */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-300/60 mb-2">
              Learning Space
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href)) ||
                  (item.href === '/dashboard/smart-notes' && (pathname === '/smart-notes' || pathname.startsWith('/smart-notes'))) ||
                  (item.href === '/dashboard/catalog' && (pathname === '/catalog' || pathname.startsWith('/catalog'))) ||
                  (item.href === '/dashboard/telegram-premium' && (pathname === '/telegram-premium' || pathname.startsWith('/telegram-premium')));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group',
                    isActive
                      ? 'bg-white text-[#0B5D3B] shadow-md font-black translate-x-1'
                      : 'text-emerald-100/90 hover:bg-emerald-800/60 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-[#0B5D3B]' : 'text-emerald-300 group-hover:text-white'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-black px-1.5 py-0.5 rounded-full',
                        isActive ? 'bg-[#0B5D3B] text-white' : 'bg-gold/30 text-gold border border-gold/40'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Admin Portal shortcut if authorized */}
            {user?.role === 'admin' && (
              <div className="pt-3">
                <Link
                  href="/admin"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black bg-amber-400 text-ink shadow-md hover:bg-amber-300 transition-all"
                >
                  <Shield size={18} className="text-amber-900" />
                  <span>Admin Console</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Footer Actions */}
          <div className="p-3 border-t border-emerald-800/60">
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-emerald-900/60 hover:bg-red-900/60 text-emerald-200 hover:text-red-200 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT MAIN DASHBOARD CONTENT AREA
           ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </div>

        {/* =========================================================================
            GLOBAL DEPOSIT MODAL (Custom Amount Supported)
           ========================================================================= */}
        {showDepositModal && (
          <div
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setShowDepositModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center font-bold">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-ink text-base">Top Up Student Wallet</h3>
                    <p className="text-[11px] text-gray-500">Current Balance: <strong className="text-emerald-700">{walletBalance} ETB</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-ink hover:bg-stone-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleStartDeposit} className="mt-4 space-y-4">
                {/* Custom Amount Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Deposit Amount (ETB) — Type any amount you want:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      step="5"
                      value={depositAmount || ''}
                      onChange={(e) => setDepositAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      placeholder="e.g. 150"
                      className="w-full text-xl font-black text-ink px-4 py-3 rounded-2xl border-2 border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 bg-emerald-50/20 pl-4 pr-16"
                      autoFocus
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500">
                      ETB
                    </span>
                  </div>
                </div>

                {/* Quick Preset Amount Pills */}
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Quick Select
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[50, 100, 200, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={cn(
                          'py-2 rounded-xl text-xs font-black transition-all border',
                          depositAmount === amt
                            ? 'bg-[#0B5D3B] text-white border-[#0B5D3B] shadow-sm scale-105'
                            : 'bg-stone-50 text-gray-700 border-stone-200 hover:bg-stone-100'
                        )}
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Payment Gateway */}
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Payment Gateway
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDepositMethod('telebirr')}
                      className={cn(
                        'p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer',
                        depositMethod === 'telebirr'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 hover:border-stone-300'
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        TB
                      </div>
                      <div>
                        <div className="font-bold text-xs text-ink">Telebirr</div>
                        <div className="text-[10px] text-gray-500">Instant AI Clearing</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDepositMethod('cbe')}
                      className={cn(
                        'p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer',
                        depositMethod === 'cbe'
                          ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20'
                          : 'border-stone-200 hover:border-stone-300'
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-700 text-white font-black text-xs flex items-center justify-center">
                        CBE
                      </div>
                      <div>
                        <div className="font-bold text-xs text-ink">CBE Mobile</div>
                        <div className="text-[10px] text-gray-500">Commercial Bank</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Deposit {depositAmount} ETB → Proceed to Payment</span>
                    <ArrowRight size={16} />
                  </button>
                  <p className="text-[11px] text-center text-gray-400 mt-2">
                    Takes you to the payment page to transfer & upload your receipt for instant verification.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AuthGuard>
  );
}

