'use client';

import { supabase } from './supabase';
import { addNotification } from './notification-store';

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUserName: string;
  referredUserUniversity?: string;
  referredUserDepartment?: string;
  status: 'pending' | 'completed';
  rewardAmount: number; // 5 ETB
  registeredAt: string;
  completedAt?: string;
}

const REFERRAL_WALLET_KEY = 'tibeb_referral_wallet_balance';
const REFERRALS_LIST_KEY = 'tibeb_referrals_list';
const REFERRED_BY_KEY = 'tibeb_referred_by_code';

// Generate or retrieve student's unique referral code
export function getStudentReferralCode(user?: { id?: string; name?: string; phone?: string } | null): string {
  if (!user) return 'TIBEB';
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`tibeb_my_ref_code_${user.id}`);
    if (saved) return saved;
  }
  // Generate deterministic clean code like TIBEB-84F2
  const seed = (user.id || user.phone || user.name || 'USER').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  const code = `TIBEB-${seed || 'WIN'}`;
  if (typeof window !== 'undefined' && user.id) {
    localStorage.setItem(`tibeb_my_ref_code_${user.id}`, code);
  }
  return code;
}

// Generate full shareable referral link
export function getReferralShareUrl(referralCode: string): string {
  if (typeof window === 'undefined') return `https://tibebexams.com/signup?ref=${referralCode}`;
  return `${window.location.origin}/signup?ref=${referralCode}`;
}

// Get Referral Wallet Balance (separate from main wallet)
export function getReferralWalletBalance(userId?: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(REFERRAL_WALLET_KEY);
    return raw !== null ? parseFloat(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

// Fetch live Referral Wallet Balance from Supabase
export async function fetchLiveReferralBalance(userId?: string): Promise<number> {
  if (!userId) return getReferralWalletBalance();
  try {
    const { data, error } = await supabase
      .from('users')
      .select('referral_wallet_balance')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data && data.referral_wallet_balance !== undefined && data.referral_wallet_balance !== null) {
      const bal = Number(data.referral_wallet_balance) || 0;
      if (typeof window !== 'undefined') {
        localStorage.setItem(REFERRAL_WALLET_KEY, bal.toString());
      }
      return bal;
    }
  } catch {}
  return getReferralWalletBalance(userId);
}

// Get all invited friends and their status (Pending vs Completed)
export function getReferralsList(userId?: string): ReferralRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REFERRALS_LIST_KEY);
    const list: ReferralRecord[] = raw ? JSON.parse(raw) : [];
    if (!userId) return list;
    return list.filter((r) => r.referrerId === userId);
  } catch {
    return [];
  }
}

// Record that a new student signed up using an inviter's referral code
export function recordReferralSignup(
  referrerCode: string,
  newUser: { id: string; name: string; university?: string; department?: string }
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // 1. Store referred_by flag for the new user
    localStorage.setItem(REFERRED_BY_KEY, referrerCode.trim().toUpperCase());

    // 2. Lookup registered users to find referrer ID
    const rawUsers = localStorage.getItem('tibeb_registered_users');
    let referrerId = 'referrer-' + referrerCode;
    let referrerName = 'Classmate';

    if (rawUsers) {
      const users: any[] = JSON.parse(rawUsers);
      const matched = users.find((u) => {
        const uCode = getStudentReferralCode(u);
        return uCode === referrerCode.trim().toUpperCase() || u.id === referrerCode;
      });
      if (matched) {
        referrerId = matched.id;
        referrerName = matched.name;
      }
    }

    // 3. Add to referrals list in 'pending' status
    const rawList = localStorage.getItem(REFERRALS_LIST_KEY);
    const list: ReferralRecord[] = rawList ? JSON.parse(rawList) : [];

    // Avoid duplicate records
    const alreadyExists = list.some((r) => r.referredUserId === newUser.id);
    if (!alreadyExists) {
      const newRecord: ReferralRecord = {
        id: `ref-${Date.now()}-${newUser.id.slice(-4)}`,
        referrerId,
        referredUserId: newUser.id,
        referredUserName: newUser.name,
        referredUserUniversity: newUser.university || 'AAU',
        referredUserDepartment: newUser.department || 'Freshman Studies',
        status: 'pending', // Pending until friend deposits & buys 1st test
        rewardAmount: 5,
        registeredAt: new Date().toISOString(),
      };
      list.unshift(newRecord);
      localStorage.setItem(REFERRALS_LIST_KEY, JSON.stringify(list));

      // Notify the referrer that a friend joined
      addNotification({
        userId: referrerId,
        title: `👋 ${newUser.name} Joined via Your Referral!`,
        message: `${newUser.name} registered using your referral code. Once they deposit and purchase their first exam test, 5 ETB will be deposited into your Referral Wallet!`,
        type: 'system',
        link: '/dashboard/referrals',
      });
    }

    return true;
  } catch (err) {
    console.error('Error recording referral signup:', err);
    return false;
  }
}

// Triggered when any student unlocks or buys an exam test!
// If this is their 1st purchase and they were referred, awards 5 ETB to the referrer's Referral Wallet!
export async function triggerReferralPurchaseReward(buyerUserId: string): Promise<{
  rewardGranted: boolean;
  referrerId?: string;
  amount?: number;
}> {
  if (typeof window === 'undefined') return { rewardGranted: false };

  try {
    const rawList = localStorage.getItem(REFERRALS_LIST_KEY);
    if (!rawList) return { rewardGranted: false };

    const list: ReferralRecord[] = JSON.parse(rawList);
    const matchIndex = list.findIndex(
      (r) => r.referredUserId === buyerUserId && r.status === 'pending'
    );

    if (matchIndex === -1) {
      return { rewardGranted: false };
    }

    const referral = list[matchIndex];
    referral.status = 'completed';
    referral.completedAt = new Date().toISOString();
    list[matchIndex] = referral;
    localStorage.setItem(REFERRALS_LIST_KEY, JSON.stringify(list));

    const referrerId = referral.referrerId;
    const rewardAmount = referral.rewardAmount || 5;

    // 1. Credit Referrer's Referral Wallet (localStorage)
    const curRefBal = parseFloat(localStorage.getItem(REFERRAL_WALLET_KEY) || '0');
    const nextRefBal = curRefBal + rewardAmount;
    localStorage.setItem(REFERRAL_WALLET_KEY, nextRefBal.toString());

    // 2. Credit in registered users list
    const rawUsers = localStorage.getItem('tibeb_registered_users');
    if (rawUsers) {
      const users: any[] = JSON.parse(rawUsers);
      const idx = users.findIndex((u) => u.id === referrerId);
      if (idx >= 0) {
        users[idx].referral_wallet_balance = (Number(users[idx].referral_wallet_balance) || 0) + rewardAmount;
        localStorage.setItem('tibeb_registered_users', JSON.stringify(users));
      }
    }

    // 3. Credit in Supabase users table
    try {
      const { data: supaUser } = await supabase
        .from('users')
        .select('id, referral_wallet_balance')
        .eq('id', referrerId)
        .maybeSingle();

      if (supaUser) {
        const currentBal = Number(supaUser.referral_wallet_balance || 0);
        await supabase
          .from('users')
          .update({ referral_wallet_balance: currentBal + rewardAmount })
          .eq('id', referrerId);
      }
    } catch (e) {
      console.warn('Supabase referral credit warning:', e);
    }

    // 4. Send high-priority notification to referrer
    addNotification({
      userId: referrerId,
      title: `🎉 5 ETB Referral Reward Added to Wallet!`,
      message: `Your invited classmate ${referral.referredUserName} completed their first exam unlock! 5 ETB has been deposited into your Referral Wallet. You can withdraw it or transfer to your real wallet!`,
      type: 'deposit',
      link: '/dashboard/referrals',
    });

    window.dispatchEvent(new Event('tibeb_referral_wallet_updated'));
    window.dispatchEvent(new Event('storage'));

    return { rewardGranted: true, referrerId, amount: rewardAmount };
  } catch (err) {
    console.error('Error triggering referral purchase reward:', err);
    return { rewardGranted: false };
  }
}

// Transfer money from Referral Wallet to Real/Main Wallet
export async function transferReferralToMainWallet(
  userId: string,
  amount: number
): Promise<{ success: boolean; error?: string; newMainBalance?: number; newRefBalance?: number }> {
  if (typeof window === 'undefined') return { success: false, error: 'Client only' };
  if (amount <= 0) return { success: false, error: 'Transfer amount must be greater than 0.' };

  const currentRefBal = getReferralWalletBalance(userId);
  if (currentRefBal < amount) {
    return { success: false, error: `Insufficient Referral Wallet balance (${currentRefBal} ETB available).` };
  }

  try {
    // 1. Deduct from Referral Wallet
    const nextRefBal = currentRefBal - amount;
    localStorage.setItem(REFERRAL_WALLET_KEY, nextRefBal.toString());

    // 2. Add to Main Wallet
    const currentMainBal = parseFloat(localStorage.getItem('tibeb_wallet_balance') || '0');
    const nextMainBal = currentMainBal + amount;
    localStorage.setItem('tibeb_wallet_balance', nextMainBal.toString());

    // 3. Update active user session
    const uRaw = localStorage.getItem('tibeb_user');
    if (uRaw) {
      const u = JSON.parse(uRaw);
      u.walletBalance = nextMainBal;
      u.wallet_balance = nextMainBal;
      u.referral_wallet_balance = nextRefBal;
      localStorage.setItem('tibeb_user', JSON.stringify(u));
    }

    // 4. Record transaction in main wallet history
    const txs = JSON.parse(localStorage.getItem('tibeb_transactions') || '[]');
    txs.unshift({
      id: `tx-ref-transfer-${Date.now()}`,
      type: 'deposit',
      amount,
      date: new Date().toISOString(),
      description: `🔄 Transferred +${amount} ETB from Referral Wallet to Real Wallet`,
      status: 'completed',
    });
    localStorage.setItem('tibeb_transactions', JSON.stringify(txs));

    // 5. Update in Supabase
    try {
      const { data: supaUser } = await supabase
        .from('users')
        .select('id, wallet_balance, referral_wallet_balance')
        .eq('id', userId)
        .maybeSingle();

      if (supaUser) {
        await supabase
          .from('users')
          .update({
            wallet_balance: (Number(supaUser.wallet_balance) || 0) + amount,
            referral_wallet_balance: Math.max(0, (Number(supaUser.referral_wallet_balance) || 0) - amount),
          })
          .eq('id', userId);
      }
    } catch (e) {
      console.warn('Supabase transfer warning:', e);
    }

    window.dispatchEvent(new Event('tibeb_wallet_updated'));
    window.dispatchEvent(new Event('tibeb_referral_wallet_updated'));
    window.dispatchEvent(new Event('storage'));

    return { success: true, newMainBalance: nextMainBal, newRefBalance: nextRefBal };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Transfer failed' };
  }
}

