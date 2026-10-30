'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  Menu, X, BookOpen, GraduationCap, ShoppingBag,
  Bell, Search, ChevronDown, User, LogOut, Settings,
  LayoutDashboard, Library, Globe, Package, Zap, Shield, ShoppingCart, Sparkles,
  Smartphone, Trophy, Home, Info, CheckCircle2, Download, FileText, Wallet, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
}

const navLinks: NavItem[] = [
  { href: '#home', label: 'Home', icon: Home },
  { href: '#about', label: 'About Us', icon: Info },
  { href: '#why-choose-us', label: 'Why Choose Us', icon: CheckCircle2 },
  { href: '#download', label: 'Install App', icon: Download },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t, locale, toggleLocale } = useLanguage();
  const { user, walletBalance, signOut } = useAuth();
  const { cart, setIsCartOpen } = useCart();

  const isLanding = pathname === '/';

  // Navigation ONLY appears on the landing page ('/')
  if (pathname !== '/') {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setUserMenuOpen(false);
      setMobileOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navBg = isLanding && !scrolled
    ? 'bg-transparent text-white'
    : 'bg-[#083d28]/95 backdrop-blur-md shadow-md border-b border-emerald-900/40 text-white';
  const textColor = 'text-white';

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 h-16 transition-all duration-300',
          navBg
        )}
        id="main-navbar"
      >
        {/* Logo Brand Lockup */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 group focus:outline-none select-none"
          aria-label="Tibeb Home"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-transparent.png"
              alt="Tibeb Logo"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm"
              style={{ width: '100%', height: '100%', maxWidth: '40px', maxHeight: '40px', objectFit: 'contain' }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className={cn('font-black text-lg sm:text-xl tracking-tight font-poppins transition-colors', textColor)}>
                Tibeb
              </span>
              <span className={cn(
                'text-[10px] font-black px-1.5 py-0.5 rounded-md tracking-wider uppercase transition-all border',
                isLanding && !scrolled
                  ? 'bg-white/20 text-white border-white/20 backdrop-blur-sm'
                  : 'bg-gold/20 text-gold-dark border-gold/30'
              )}>
                Exam Bank
              </span>
            </div>
            <span className={cn(
              'text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold transition-colors leading-none mt-0.5',
              isLanding && !scrolled ? 'text-white/60' : 'text-gray-400'
            )}>
              Higher Ed Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label, badge }) => (
            <Link
              key={href}
              href={href}
              onClick={(e) => {
                if (href.startsWith('#')) {
                  e.preventDefault();
                  if (pathname !== '/') {
                    window.location.href = `/${href}`;
                    return;
                  }
                  const target = document.querySelector(href);
                  if (target) {
                    const topOffset = 70;
                    const pos = target.getBoundingClientRect().top + window.pageYOffset - topOffset;
                    window.scrollTo({ top: pos, behavior: 'smooth' });
                    setMobileOpen(false);
                  }
                }
              }}
              className="text-sm font-bold transition-colors flex items-center gap-1.5 text-white/85 hover:text-white cursor-pointer"
            >
              {label}
              {badge && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/40">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Browse Tests Nav Button */}
          <Link
            href="/catalog"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E0A526] hover:bg-amber-400 text-ink shadow-sm transition-all cursor-pointer"
          >
            <BookOpen size={13} />
            <span>Browse Tests</span>
          </Link>

          {/* Search */}
          <Link
            href="/catalog"
            className="btn-icon hidden sm:flex text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Search"
          >
            <Search size={18} />
          </Link>

          {/* Student Wallet Pill */}
          {user && (
            <button
              id="nav-wallet-btn"
              onClick={() => setIsCartOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm cursor-pointer bg-gold/20 text-gold border-gold/40 hover:bg-gold/30"
              title="Tibeb Student Wallet - 1-Click Fast Unlock"
            >
              <Zap size={13} className="text-gold fill-gold" />
              <span>{walletBalance} ETB</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            id="nav-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="btn-icon relative flex items-center justify-center cursor-pointer text-white/90 hover:text-white hover:bg-white/10"
            aria-label="Open study cart"
          >
            <ShoppingCart size={19} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-ink text-[10px] font-black flex items-center justify-center shadow-md animate-in zoom-in">
                {cart.length}
              </span>
            )}
          </button>

          {user ? (
            <>
              {/* Notifications */}
              <Link
                href="/dashboard/notifications"
                className="btn-icon relative hidden sm:flex text-white/80 hover:text-white hover:bg-white/10"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-tibeb rounded-full" />
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 hover:border-gold/50 bg-white/10 text-white transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gold text-ink flex items-center justify-center text-xs font-black">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:block text-white">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-white/60" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 scale-in">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-ink">
                      <LayoutDashboard size={16} className="text-green" />
                      {t('nav.dashboard')}
                    </Link>
                    <Link href="/dashboard/library" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-ink">
                      <Library size={16} className="text-green" />
                      {t('nav.library')}
                    </Link>
                    <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-ink">
                      <ShoppingBag size={16} className="text-green" />
                      Orders & Receipts
                    </Link>
                    {user?.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 text-sm font-bold text-amber-900 border-l-2 border-amber-500">
                        <Shield size={16} className="text-gold" />
                        Admin Portal
                      </Link>
                    )}
                    <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-ink">
                      <Settings size={16} className="text-gray-400" />
                      {t('nav.profile')}
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={signOut}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-red-tibeb w-full cursor-pointer"
                    >
                      <LogOut size={16} />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-semibold px-3 py-2 hidden sm:block transition-colors text-white/90 hover:text-white"
              >
                {t('nav.login')}
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full bg-white text-[#0B5D3B] hover:bg-emerald-50 text-xs font-bold transition-all shadow-sm inline-flex items-center justify-center cursor-pointer"
              >
                {t('nav.signup')}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-btn"
            className={cn(
              'btn-icon md:hidden',
              isLanding && !scrolled ? 'text-white' : 'text-ink'
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 bottom-0 w-[86vw] max-w-sm bg-white shadow-2xl flex flex-col z-[81] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 p-1.5 shadow-xs">
                  <img
                    src="/logo-transparent.png"
                    alt="Tibeb"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-lg text-ink leading-tight">Tibeb</span>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-gold text-ink">
                      Bank
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Higher Ed Platform</span>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-1.5">
                {navLinks.map(({ href, label, badge, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={(e) => {
                      if (href.startsWith('#')) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                        }
                        setMobileOpen(false);
                      }
                    }}
                    className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-bold text-ink hover:bg-emerald-50/70 hover:text-[#0B5D3B] transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      {Icon && <Icon size={20} className="text-[#0B5D3B] group-hover:scale-110 transition-transform" />}
                      <span>{label}</span>
                    </div>
                    {badge && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-[#0B5D3B]">
                        {badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile footer with safe bottom padding */}
            <div className="p-4 pb-8 sm:pb-6 border-t border-gray-100 bg-white flex-shrink-0 space-y-3">
              {!user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-sm text-center shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Sign Up Free</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3 px-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-gray-50 text-ink font-bold text-sm text-center transition-all cursor-pointer"
                  >
                    Sign In to Account
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-gold to-amber-400 text-ink font-black text-xs flex items-center justify-center flex-shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          (user.name || 'S').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-ink truncate">{user.name || 'Student'}</p>
                        <p className="text-[10px] text-gray-500 font-semibold">{walletBalance} ETB Balance</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-[#0B5D3B] text-white text-[11px] font-bold cursor-pointer"
                    >
                      Portal →
                    </Link>
                  </div>

                  <button
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl hover:bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}
