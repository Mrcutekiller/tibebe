// src/lib/withdrawal-store.ts
// Student Wallet Withdrawal System with Admin Transfer Screenshot Approval & Balance Safeguards

import { addNotification } from './notification-store';

export interface WithdrawalRequest {
  id: string; // e.g. WDR-2026-9481
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  paymentMethod: 'telebirr' | 'cbe';
  accountNumber: string; // Phone number for Telebirr, or CBE account number
  accountName: string; // Full name on receiver's bank/telebirr account
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  payoutScreenshot?: string; // Admin's uploaded proof of bank/telebirr transfer
  rejectionReason?: string;
  reviewedBy?: string;
  createdAt: string;
  processedAt?: string;
}

export const MIN_DEPOSIT_AMOUNT = 20; // 20 ETB minimum deposit
export const MIN_WITHDRAWAL_AMOUNT = 20; // 20 ETB minimum withdrawal

const STORAGE_KEY = 'tibeb_system_withdrawals';

export function getStoredWithdrawals(): WithdrawalRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWithdrawals(list: WithdrawalRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('tibeb_withdrawals_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save withdrawals:', err);
  }
}

// Student creates withdrawal request
export function requestWithdrawal(data: {
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  paymentMethod: 'telebirr' | 'cbe';
  accountNumber: string;
  accountName: string;
  amount: number;
  currentBalance: number;
}): { success: boolean; error?: string; withdrawal?: WithdrawalRequest } {
  if (data.amount < MIN_WITHDRAWAL_AMOUNT) {
    return { success: false, error: `Minimum withdrawal amount is ${MIN_WITHDRAWAL_AMOUNT} ETB.` };
  }
  if (data.amount > data.currentBalance) {
    return { success: false, error: `Insufficient wallet balance. You have ${data.currentBalance} ETB available.` };
  }
  if (!data.accountNumber.trim()) {
    return { success: false, error: `Please enter your ${data.paymentMethod === 'telebirr' ? 'Telebirr phone number' : 'CBE account number'}.` };
  }
  if (!data.accountName.trim()) {
    return { success: false, error: 'Please enter the registered account holder full name.' };
  }

  const list = getStoredWithdrawals();
  const newReq: WithdrawalRequest = {
    id: `WDR-${Date.now().toString().slice(-6)}`,
    userId: data.userId,
    userName: data.userName,
    userPhone: data.userPhone,
    userEmail: data.userEmail,
    paymentMethod: data.paymentMethod,
    accountNumber: data.accountNumber.trim(),
    accountName: data.accountName.trim(),
    amount: data.amount,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  list.unshift(newReq);
  saveWithdrawals(list);

  // Deduct from wallet balance immediately (held pending payout)
  if (typeof window !== 'undefined') {
    try {
      const curBal = parseFloat(localStorage.getItem('tibeb_wallet_balance') || '0');
      const nextBal = Math.max(0, curBal - data.amount);
      localStorage.setItem('tibeb_wallet_balance', nextBal.toString());

      // Update registered users list
      const usersRaw = localStorage.getItem('tibeb_registered_users');
      if (usersRaw) {
        const users = JSON.parse(usersRaw);
        const updatedUsers = users.map((u: any) => {
          if (u.id === data.userId || u.email?.toLowerCase() === data.userEmail.toLowerCase()) {
            return { ...u, walletBalance: nextBal };
          }
          return u;
        });
        localStorage.setItem('tibeb_registered_users', JSON.stringify(updatedUsers));
      }

      // Update active user session
      const activeUserRaw = localStorage.getItem('tibeb_user');
      if (activeUserRaw) {
        const activeUser = JSON.parse(activeUserRaw);
        if (activeUser.id === data.userId || activeUser.email?.toLowerCase() === data.userEmail.toLowerCase()) {
          activeUser.walletBalance = nextBal;
          localStorage.setItem('tibeb_user', JSON.stringify(activeUser));
        }
      }

      // Log transaction
      const txs = JSON.parse(localStorage.getItem('tibeb_transactions') || '[]');
      txs.unshift({
        id: 'tx-wdr-' + Date.now(),
        type: 'withdrawal',
        amount: -data.amount,
        date: new Date().toISOString(),
        description: `Withdrawal Request (-${data.amount} ETB to ${data.paymentMethod.toUpperCase()} ${data.accountNumber})`,
        status: 'pending',
      });
      localStorage.setItem('tibeb_transactions', JSON.stringify(txs));

      window.dispatchEvent(new Event('tibeb_wallet_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error deducting balance for withdrawal:', e);
    }
  }

  // Add notification
  addNotification({
    userId: data.userId,
    title: 'Withdrawal Request Submitted',
    message: `Your request to withdraw ${data.amount} ETB to ${data.paymentMethod.toUpperCase()} (${data.accountNumber}) has been submitted. Admin will process and attach payout screenshot.`,
    type: 'withdrawal',
    link: '/payment?tab=withdraw',
  });

  return { success: true, withdrawal: newReq };
}

// Admin approves withdrawal and attaches payout transfer screenshot
export function approveWithdrawal(
  withdrawalId: string,
  payoutScreenshot: string,
  adminEmail: string = 'tibebexams@gmail.com'
): boolean {
  const list = getStoredWithdrawals();
  const target = list.find(w => w.id === withdrawalId);
  if (!target) return false;

  target.status = 'approved';
  target.payoutScreenshot = payoutScreenshot;
  target.reviewedBy = adminEmail;
  target.processedAt = new Date().toISOString();

  saveWithdrawals(list);

  // Send student notification with screenshot proof
  addNotification({
    userId: target.userId,
    title: '💸 Withdrawal Approved & Sent!',
    message: `ETB ${target.amount} was sent to your ${target.paymentMethod.toUpperCase()} account (${target.accountNumber} - ${target.accountName}). Click to view official payout transfer receipt.`,
    type: 'withdrawal',
    link: '/dashboard/notifications',
    imageUrl: payoutScreenshot,
  });

  // Update transaction status
  if (typeof window !== 'undefined') {
    try {
      const txs = JSON.parse(localStorage.getItem('tibeb_transactions') || '[]');
      const updatedTxs = txs.map((t: any) => {
        if (t.id.includes(target.id) || (t.type === 'withdrawal' && t.status === 'pending')) {
          return { ...t, status: 'completed' };
        }
        return t;
      });
      localStorage.setItem('tibeb_transactions', JSON.stringify(updatedTxs));
    } catch {}
  }

  return true;
}

// Admin rejects withdrawal and refunds student wallet
export function rejectWithdrawal(
  withdrawalId: string,
  reason: string,
  adminEmail: string = 'tibebexams@gmail.com'
): boolean {
  const list = getStoredWithdrawals();
  const target = list.find(w => w.id === withdrawalId);
  if (!target) return false;

  target.status = 'rejected';
  target.rejectionReason = reason;
  target.reviewedBy = adminEmail;
  target.processedAt = new Date().toISOString();

  saveWithdrawals(list);

  // Refund the student's wallet balance
  if (typeof window !== 'undefined') {
    try {
      const refundAmount = target.amount;

      // 1. Update registered users
      const usersRaw = localStorage.getItem('tibeb_registered_users');
      if (usersRaw) {
        const users = JSON.parse(usersRaw);
        const updatedUsers = users.map((u: any) => {
          if (u.id === target.userId || u.email?.toLowerCase() === target.userEmail.toLowerCase()) {
            return { ...u, walletBalance: (u.walletBalance || 0) + refundAmount };
          }
          return u;
        });
        localStorage.setItem('tibeb_registered_users', JSON.stringify(updatedUsers));
      }

      // 2. Update active user session
      const curBal = parseFloat(localStorage.getItem('tibeb_wallet_balance') || '0');
      const nextBal = curBal + refundAmount;
      localStorage.setItem('tibeb_wallet_balance', nextBal.toString());

      const activeUserRaw = localStorage.getItem('tibeb_user');
      if (activeUserRaw) {
        const activeUser = JSON.parse(activeUserRaw);
        if (activeUser.id === target.userId || activeUser.email?.toLowerCase() === target.userEmail.toLowerCase()) {
          activeUser.walletBalance = nextBal;
          localStorage.setItem('tibeb_user', JSON.stringify(activeUser));
        }
      }

      // 3. Log transaction reversal
      const txs = JSON.parse(localStorage.getItem('tibeb_transactions') || '[]');
      txs.unshift({
        id: 'tx-ref-' + Date.now(),
        type: 'deposit',
        amount: refundAmount,
        date: new Date().toISOString(),
        description: `Withdrawal Refund (+${refundAmount} ETB): ${reason}`,
        status: 'completed',
      });
      localStorage.setItem('tibeb_transactions', JSON.stringify(txs));

      window.dispatchEvent(new Event('tibeb_wallet_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error refunding withdrawal:', e);
    }
  }

  // Add notification to student
  addNotification({
    userId: target.userId,
    title: '❌ Withdrawal Request Rejected & Refunded',
    message: `Your withdrawal of ${target.amount} ETB was rejected: "${reason}". The full amount of ${target.amount} ETB has been returned to your Tibeb Wallet.`,
    type: 'withdrawal',
    link: '/payment?tab=withdraw',
  });

  return true;
}

