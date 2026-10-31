'use client';

import { supabase } from './supabase';

export interface TelegramPremiumPlan {
  id: string;
  months: number;
  label: string;
  price: number;
  popular?: boolean;
  savings?: string;
}

export interface PaymentMethodsConfig {
  telebirr: boolean;
  chapa: boolean;
  cbe: boolean;
}

export interface TibebSettings {
  competitions_enabled: boolean;
  business_telegram: string;
  business_whatsapp: string;
  business_email: string;
  social_telegram: string;
  social_instagram: string;
  social_tiktok: string;
  payment_methods: PaymentMethodsConfig;
  test_mode: boolean;
  exam_price_etb: number;
  bundle_discount_percent: number;
  telegram_premium_plans: TelegramPremiumPlan[];
  refund_policy_summary: string;
  refund_policy_full: string;
}

export const DEFAULT_SETTINGS: TibebSettings = {
  competitions_enabled: false, // OFF by default per user specification
  business_telegram: 'https://t.me/tibeb_support',
  business_whatsapp: '+251911234567',
  business_email: 'support@tibeb.et',
  social_telegram: 'https://t.me/tibeb_official',
  social_instagram: '',
  social_tiktok: '',
  payment_methods: {
    telebirr: true,
    chapa: true,
    cbe: true,
  },
  test_mode: false,
  exam_price_etb: 20,
  bundle_discount_percent: 20,
  telegram_premium_plans: [
    { id: 'tg-1m', months: 1, label: '1 Month', price: 490 },
    { id: 'tg-3m', months: 3, label: '3 Months', price: 1390, popular: true, savings: 'Save 5%' },
    { id: 'tg-6m', months: 6, label: '6 Months', price: 2550, savings: 'Save 13%' },
    { id: 'tg-12m', months: 12, label: '12 Months', price: 4600, savings: 'Save 22%' },
  ],
  refund_policy_summary: 'Full refund within 24 hours if test solutions have missing questions or severe formatting errors, or if Telegram Premium is not delivered within 2 hours.',
  refund_policy_full: `1. Exam Tests: If an unlocked exam contains missing pages, unreadable questions, or incorrect answer keys, submit a report within 24 hours for a full refund back to your Telebirr/Chapa account or Tibeb wallet.\n2. Telegram Premium: If your subscription is not activated within 2 hours of payment confirmation, our support will immediately verify and either deliver manually or refund 100% of your payment.\n3. Transparent Guarantee: We never hold your funds hostage. All requests are processed within 1 business day.`,
};

const SETTINGS_KEY = 'tibeb_system_settings';

export function getLocalSettings(): TibebSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveLocalSettings(settings: Partial<TibebSettings>): TibebSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const current = getLocalSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('tibeb_settings_updated', { detail: updated }));
  } catch {}
  return updated;
}

export async function fetchRemoteSettings(): Promise<TibebSettings> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'system_config')
      .maybeSingle();

    if (!error && data && data.value) {
      const merged = { ...DEFAULT_SETTINGS, ...data.value };
      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('tibeb_settings_updated', { detail: merged }));
      }
      return merged;
    }
  } catch {}
  return getLocalSettings();
}

export async function updateRemoteSettings(settings: Partial<TibebSettings>): Promise<TibebSettings> {
  const current = getLocalSettings();
  const updated = { ...current, ...settings };
  saveLocalSettings(updated);

  try {
    await supabase.from('settings').upsert({
      key: 'system_config',
      value: updated,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error saving settings to Supabase:', err);
  }
  return updated;
}

