'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Button from '@/components/ui/Button';
import { PhoneInput } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!phone || phone.length < 9) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-card">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group focus:outline-none" aria-label="Tibeb Home">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
              <img
                src="/logo-transparent.png"
                alt="Tibeb Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain drop-shadow-sm"
                style={{ width: '100%', height: '100%', maxWidth: '40px', maxHeight: '40px', objectFit: 'contain' }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-ink tracking-tight font-poppins">Tibeb</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gold/20 text-gold-dark uppercase tracking-wider">Exam Bank</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-gray-400">Higher Ed Platform</span>
            </div>
          </Link>

          {!sent ? (
            <>
              <h1 className="text-2xl font-black text-ink mb-1">{t('auth.reset.title')}</h1>
              <p className="text-sm text-gray-400 mb-8">
                Enter your phone number and we'll send you a reset link via SMS.
              </p>

              <div className="space-y-4">
                <PhoneInput
                  label={t('auth.login.phone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                />

                <Button
                  id="reset-btn"
                  variant="green"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={handleReset}
                >
                  {t('auth.reset.submit')}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'var(--color-green-muted)' }}
              >
                <CheckCircle size={32} className="text-green" />
              </div>
              <h2 className="text-xl font-bold text-ink mb-2">Check your phone</h2>
              <p className="text-sm text-gray-400">
                We sent a reset link to <span className="font-semibold text-ink">+251 {phone}</span>
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link href="/login" className="flex items-center gap-1 text-sm text-green hover:underline font-medium">
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
