'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X, Headphones, ExternalLink } from 'lucide-react';
import { getLocalSettings, type TibebSettings } from '@/lib/settings-store';

export default function FloatingSupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<TibebSettings>(getLocalSettings());

  useEffect(() => {
    const update = () => setSettings(getLocalSettings());
    window.addEventListener('tibeb_settings_updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('tibeb_settings_updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const tgLink = settings.business_telegram || 'https://t.me/tibeb_support';
  const waNumber = settings.business_whatsapp || '+251911234567';
  const waLink = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Support Menu */}
      {isOpen && (
        <div className="mb-3 w-72 rounded-3xl bg-white p-5 shadow-2xl border border-stone-200/90 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B5D3B] flex items-center justify-center font-bold text-xs">
                <Headphones size={15} />
              </div>
              <div>
                <h4 className="text-xs font-black text-ink">Tibeb Support</h4>
                <p className="text-[10px] text-gray-500">Live student assistance</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-stone-100 text-gray-400 hover:text-ink flex items-center justify-center text-xs cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2">
            <a
              href={tgLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/80 transition-all text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <Send size={15} className="text-sky-600" />
                Telegram Support
              </span>
              <ExternalLink size={12} className="text-sky-500" />
            </a>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 transition-all text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <MessageCircle size={15} className="text-emerald-600" />
                WhatsApp Help
              </span>
              <ExternalLink size={12} className="text-emerald-500" />
            </a>
          </div>

          <p className="text-[10px] text-gray-400 text-center mt-3">
            Available daily 8:00 AM – 11:00 PM EAT
          </p>
        </div>
      )}

      {/* Floating Pill / Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#0B5D3B] hover:bg-emerald-800 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 border-2 border-white/20"
        aria-label="Contact Tibeb Support"
      >
        {isOpen ? (
          <X size={18} />
        ) : (
          <>
            <MessageCircle size={18} className="text-gold" />
            <span className="text-xs font-black tracking-wide">Support</span>
          </>
        )}
      </button>
    </div>
  );
}
