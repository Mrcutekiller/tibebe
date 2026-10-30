'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, Globe, Send, Share2 } from 'lucide-react';

interface FooterLink {
  href: string;
  labelKey?: string;
  label?: string;
}

const footerLinks: {
  content: FooterLink[];
  company: FooterLink[];
  legal: FooterLink[];
} = {
  content: [
    { href: '/catalog', label: 'Exam Tests (20 ETB)' },
    { href: '/telegram-premium', label: 'Telegram Premium ⚡' },
    { href: '/universities', labelKey: 'nav.universities' },
  ],
  company: [
    { href: '/about', labelKey: 'nav.about' },
    { href: '/how-it-works', labelKey: 'nav.howItWorks' },
    { href: '/contact', labelKey: 'nav.contact' },
    { href: '/faq', labelKey: 'footer.faq' },
    { href: '/blog', label: 'Blog' },
  ],
  legal: [
    { href: '/terms', labelKey: 'footer.terms' },
    { href: '/privacy', labelKey: 'footer.privacy' },
    { href: '/refund', labelKey: 'footer.refund' },
    { href: '/verify', labelKey: 'certificate.verify' },
  ],
};

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin') || pathname?.startsWith('/payment')) {
    return null;
  }

  return (
    <footer className="bg-ink text-white">
      {/* Main footer */}
      <div className="container-tibeb py-16 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => {
                if (typeof window !== 'undefined' && window.location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-3 group focus:outline-none select-none"
              aria-label="Tibeb Home"
            >
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-transparent.png"
                  alt="Tibeb"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain drop-shadow-md"
                  style={{ width: '100%', height: '100%', maxWidth: '40px', maxHeight: '40px', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 leading-tight">
                  <span className="text-white font-black text-2xl tracking-tight">Tibeb</span>
                  <span className="text-gold font-bold text-xs px-2 py-0.5 rounded bg-gold/10 border border-gold/20 uppercase tracking-wider">Exam Bank</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold block mt-0.5">
                  Higher Ed Platform • Ethiopia
                </span>
              </div>
            </Link>

            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              {t('footer.tagline')} Past exam papers, courses, and study tools designed for Ethiopian university students.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              <a href="mailto:tibebexams@gmail.com" className="flex items-center gap-2 text-sm text-white/80 hover:text-gold transition-colors font-medium">
                <Mail size={14} className="text-gold" />
                tibebexams@gmail.com
              </a>
              <a href="tel:099721895" className="flex items-center gap-2 text-sm text-white/80 hover:text-gold transition-colors font-medium">
                <Phone size={14} className="text-gold" />
                +251 99 721 895 (Biruk)
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-1">
              {[
                { icon: Send, href: '#', label: 'Telegram' },
                { icon: Globe, href: '#', label: 'Portal' },
                { icon: Share2, href: '#', label: 'Share' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-gold hover:text-ink transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Content links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Content</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.content.map(({ href, labelKey, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {labelKey ? t(labelKey) : label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map(({ href, labelKey, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {labelKey ? t(labelKey) : label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">{t('footer.legal')}</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.legal.map(({ href, labelKey, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {labelKey ? t(labelKey) : label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* App Badges placeholder */}
            <div className="mt-6 flex flex-col gap-2">
              <div className="px-3 py-2 rounded-lg border border-white/20 text-xs text-white/50 flex items-center gap-2 cursor-not-allowed">
                <span>📱</span> PWA — Install in browser
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-tibeb px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">{t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">Payments secured by</span>
            <span className="text-xs font-bold text-white/50">Chapa</span>
            <span className="text-xs text-white/30">•</span>
            <span className="text-xs font-bold text-white/50">Telebirr</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
