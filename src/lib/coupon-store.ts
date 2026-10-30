// src/lib/coupon-store.ts
// Real-time Persistent Coupon Management System
// Allows Admin to create coupons for limited users & time, and students to apply coupons on checkout

export interface Coupon {
  id: string;
  code: string; // UPPERCASE unique code, e.g. "WELCOME50", "TIBEB10"
  discountType: 'percentage' | 'fixed'; // 'percentage' (% off) or 'fixed' (ETB off)
  discountValue: number; // e.g. 50 (50% or 50 ETB)
  maxUses: number; // Limited users: e.g. 20 users maximum. 0 = unlimited
  usedCount: number; // Number of times redeemed
  usedByUsers: string[]; // List of user IDs or emails who have redeemed
  expiresAt: string; // ISO timestamp string (e.g. '2026-11-30T23:59:59.000Z')
  isActive: boolean;
  createdAt: string;
  minOrderAmount?: number;
  description?: string;
}

const COUPONS_STORAGE_KEY = 'tibeb_system_coupons';

// Starts clean with empty coupons on a fresh website
export const INITIAL_COUPONS: Coupon[] = [];

export function getStoredCoupons(): Coupon[] {
  if (typeof window === 'undefined') return INITIAL_COUPONS;
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (!raw) return INITIAL_COUPONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_COUPONS;
  } catch {
    return INITIAL_COUPONS;
  }
}

export function saveCoupons(coupons: Coupon[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new Event('tibeb_coupons_updated'));
  } catch (err) {
    console.error('Failed to save coupons:', err);
  }
}

export function createCoupon(data: {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  expiresAt: string;
  description?: string;
  minOrderAmount?: number;
}): Coupon {
  const coupons = getStoredCoupons();
  const cleanCode = data.code.trim().toUpperCase();

  // Check if coupon with this code already exists
  const existingIndex = coupons.findIndex(c => c.code === cleanCode);

  const newCoupon: Coupon = {
    id: `cpn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    code: cleanCode,
    discountType: data.discountType,
    discountValue: Number(data.discountValue),
    maxUses: Number(data.maxUses) || 0,
    usedCount: 0,
    usedByUsers: [],
    expiresAt: data.expiresAt,
    isActive: true,
    createdAt: new Date().toISOString(),
    minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : 0,
    description: data.description || '',
  };

  if (existingIndex >= 0) {
    coupons[existingIndex] = newCoupon;
  } else {
    coupons.unshift(newCoupon);
  }

  saveCoupons(coupons);
  return newCoupon;
}

export function deleteCoupon(couponId: string): void {
  const coupons = getStoredCoupons().filter(c => c.id !== couponId);
  saveCoupons(coupons);
}

export function toggleCouponStatus(couponId: string): void {
  const coupons = getStoredCoupons().map(c => {
    if (c.id === couponId) {
      return { ...c, isActive: !c.isActive };
    }
    return c;
  });
  saveCoupons(coupons);
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  newTotal: number;
  error?: string;
}

export function validateCoupon(
  code: string,
  subtotal: number,
  userId?: string
): CouponValidationResult {
  if (!code || !code.trim()) {
    return { valid: false, discountAmount: 0, newTotal: subtotal, error: 'Please enter a coupon code.' };
  }

  const cleanCode = code.trim().toUpperCase();
  const coupons = getStoredCoupons();
  const coupon = coupons.find(c => c.code === cleanCode);

  if (!coupon) {
    return { valid: false, discountAmount: 0, newTotal: subtotal, error: `Coupon "${cleanCode}" not found.` };
  }

  if (!coupon.isActive) {
    return { valid: false, discountAmount: 0, newTotal: subtotal, error: 'This coupon has been disabled by the administrator.' };
  }

  // Check Expiration Time
  if (coupon.expiresAt) {
    const expiryTime = new Date(coupon.expiresAt).getTime();
    if (Date.now() > expiryTime) {
      return { valid: false, discountAmount: 0, newTotal: subtotal, error: 'This coupon has expired.' };
    }
  }

  // Check Max User Uses Limit
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discountAmount: 0, newTotal: subtotal, error: `This coupon has reached its maximum user limit (${coupon.maxUses} users).` };
  }

  // Check if User already redeemed it (if userId provided)
  if (userId && coupon.usedByUsers && coupon.usedByUsers.includes(userId)) {
    return { valid: false, discountAmount: 0, newTotal: subtotal, error: 'You have already redeemed this coupon code.' };
  }

  // Check Minimum Order Amount
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discountAmount: 0,
      newTotal: subtotal,
      error: `Minimum order amount for this coupon is ${coupon.minOrderAmount} ETB (current order is ${subtotal} ETB).`
    };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
  } else {
    discount = Math.min(subtotal, coupon.discountValue);
  }

  const newTotal = Math.max(0, subtotal - discount);

  return {
    valid: true,
    coupon,
    discountAmount: discount,
    newTotal
  };
}

// Record usage when order is completed
export function recordCouponUsage(code: string, userId?: string): boolean {
  if (!code) return false;
  const cleanCode = code.trim().toUpperCase();
  const coupons = getStoredCoupons();
  const coupon = coupons.find(c => c.code === cleanCode);

  if (!coupon) return false;

  coupon.usedCount += 1;
  if (userId) {
    if (!coupon.usedByUsers) coupon.usedByUsers = [];
    if (!coupon.usedByUsers.includes(userId)) {
      coupon.usedByUsers.push(userId);
    }
  }

  saveCoupons(coupons);
  return true;
}
