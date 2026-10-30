'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import MiniSupportChat from '@/components/support/MiniSupportChat';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // "on the landing page add the navigation only there ok"
  // ONLY render Navbar on the landing page ('/')
  const isLanding = pathname === '/';
  const showNavbar = isLanding;

  // Footer: hide on dashboard, admin, and payment pages
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');
  const isPayment = pathname?.startsWith('/payment');
  const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/reset-password';
  const hideFooter = isDashboard || isAdmin || isPayment || isAuthRoute;

  return (
    <>
      {showNavbar && <Navbar />}
      <main className={showNavbar ? 'min-h-screen pt-16' : 'min-h-screen'}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      <CartDrawer />
      <MiniSupportChat />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '14px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '13px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          },
          success: {
            style: {
              background: '#0B5D3B',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#C8372D',
              color: 'white',
            },
          },
        }}
      />
    </>
  );
}
