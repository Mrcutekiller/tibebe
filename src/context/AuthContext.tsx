'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { awardStudentPoints, POINT_REWARDS } from '@/lib/competition-store';

export interface User {
  id: string;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other' | string;
  avatar_url?: string;
  university_id?: string;
  university_name?: string;
  department?: string;
  year?: number | string;
  role: 'student' | 'admin';
  student_id?: string;
  bio?: string;
}

export interface StoredUserAccount extends User {
  password?: string;
}

// System Authorized Admin Credentials
export const ADMIN_CREDENTIALS = [
  {
    email: 'tibebexams@gmail.com',
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Te26sc26$',
    name: 'Tibeb Master Admin',
  },
  {
    email: 'admin@tibeb.edu.et',
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Admin@2025#',
    name: 'Tibeb Chief Admin',
  },
  {
    email: 'admin@tibeb.com',
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123',
    name: 'Tibeb Operations Admin',
  },
];

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  walletBalance: number;
  topUpWallet: (amount: number) => void;
  payWithWallet: (amount: number, itemIds: string[]) => boolean;
  signOut: () => Promise<void>;
  setUser: (u: User | null) => void;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
  loginWithPhone: (phone: string, password?: string) => Promise<AuthResult>;
  loginAdmin: (email: string, password: string) => Promise<AuthResult>;
  registerUser: (data: {
    name: string;
    email?: string;
    phone?: string;
    gender?: string;
    avatar_url?: string;
    password?: string;
    university_id?: string;
    department?: string;
    year?: number | string;
  }) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    // 1. Read user from localStorage
    const stored = localStorage.getItem('tibeb_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('tibeb_user');
      }
    }

    // 2. Read wallet balance (clean slate starts from 0 ETB)
    const storedBalance = localStorage.getItem('tibeb_wallet_balance');
    if (storedBalance !== null) {
      setWalletBalance(parseFloat(storedBalance) || 0);
    } else {
      localStorage.setItem('tibeb_wallet_balance', '0');
    }

    const handleWalletSync = () => {
      const storedBal = localStorage.getItem('tibeb_wallet_balance');
      if (storedBal !== null) {
        setWalletBalance(parseFloat(storedBal) || 0);
      }
      const storedU = localStorage.getItem('tibeb_user');
      if (storedU) {
        try {
          setUser(JSON.parse(storedU));
        } catch {}
      }
    };

    window.addEventListener('tibeb_wallet_updated', handleWalletSync);
    window.addEventListener('storage', handleWalletSync);

    // 3. Listen to Supabase Auth state changes (including Google OAuth callback)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const su = session.user;
        const meta = su.user_metadata || {};

        // Merge with existing user profile if present
        let currentProfile: Partial<User> = {};
        const local = localStorage.getItem('tibeb_user');
        if (local) {
          try {
            currentProfile = JSON.parse(local);
          } catch {}
        }

        const resolvedUser: User = {
          id: su.id,
          name: meta.full_name || meta.name || currentProfile.name || su.email?.split('@')[0] || 'Tibeb Student',
          email: su.email || currentProfile.email || '',
          phone: meta.phone || currentProfile.phone || '',
          gender: meta.gender || currentProfile.gender || 'Male',
          avatar_url: meta.avatar_url || meta.picture || currentProfile.avatar_url || '',
          university_id: meta.university_id || currentProfile.university_id || 'aau',
          department: meta.department || currentProfile.department || 'Computer Science',
          year: meta.year || currentProfile.year || 2,
          role: (su.email === 'tibebexams@gmail.com' ? 'admin' : (currentProfile.role || 'student')),
        };

        localStorage.setItem('tibeb_user', JSON.stringify(resolvedUser));
        setUser(resolvedUser);
      }
      setLoading(false);
    });

    setLoading(false);

    return () => {
      authListener?.subscription?.unsubscribe();
      window.removeEventListener('tibeb_wallet_updated', handleWalletSync);
      window.removeEventListener('storage', handleWalletSync);
    };
  }, []);

  const getStoredAccounts = (): StoredUserAccount[] => {
    try {
      const stored = localStorage.getItem('tibeb_registered_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveStoredAccounts = (accounts: StoredUserAccount[]) => {
    localStorage.setItem('tibeb_registered_users', JSON.stringify(accounts));
  };

  const signInWithGoogle = async (): Promise<{ error: string | null }> => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const redirectUrl = `${origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Could not initiate Google authentication' };
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    const merged: User = {
      ...user,
      ...updates,
    };

    localStorage.setItem('tibeb_user', JSON.stringify(merged));
    setUser(merged);

    // Update in registered accounts array
    const accounts = getStoredAccounts();
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === merged.id || (acc.email && acc.email.toLowerCase() === merged.email?.toLowerCase())) {
        return { ...acc, ...updates };
      }
      return acc;
    });
    saveStoredAccounts(updatedAccounts);

    // Update Supabase auth user metadata if logged in
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: merged.name,
          phone: merged.phone,
          gender: merged.gender,
          avatar_url: merged.avatar_url,
          university_id: merged.university_id,
          department: merged.department,
          year: merged.year,
        },
      });
    } catch (e) {
      console.warn('Supabase auth metadata update notice:', e);
    }

    return true;
  };

  const loginAdmin = async (email: string, pass: string): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    const matchedAdmin = ADMIN_CREDENTIALS.find(
      (a) => a.email.toLowerCase() === cleanEmail && a.password === cleanPass
    );

    if (matchedAdmin) {
      const adminUser: User = {
        id: 'admin-' + Math.random().toString(36).substring(2, 8),
        name: matchedAdmin.name,
        email: matchedAdmin.email,
        phone: '+251 91 100 0001',
        gender: 'Male',
        role: 'admin',
      };
      localStorage.setItem('tibeb_user', JSON.stringify(adminUser));
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    return {
      success: false,
      error: 'Invalid admin credentials. Only verified administrators can access the admin portal.',
    };
  };

  const loginWithEmail = async (email: string, pass: string): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Check if trying to login with Admin credentials
    const matchedAdmin = ADMIN_CREDENTIALS.find(
      (a) => a.email.toLowerCase() === cleanEmail && a.password === cleanPass
    );
    if (matchedAdmin) {
      return loginAdmin(cleanEmail, cleanPass);
    }

    // 2. Try Supabase Auth first
    try {
      const { data: suData, error: suError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (!suError && suData.user) {
        const meta = suData.user.user_metadata || {};
        const suUser: User = {
          id: suData.user.id,
          name: meta.full_name || meta.name || cleanEmail.split('@')[0],
          email: suData.user.email,
          phone: meta.phone,
          gender: meta.gender || 'Male',
          avatar_url: meta.avatar_url,
          university_id: meta.university_id || 'aau',
          department: meta.department || 'Computer Science',
          year: meta.year || 2,
          role: cleanEmail === 'tibebexams@gmail.com' ? 'admin' : 'student',
        };
        localStorage.setItem('tibeb_user', JSON.stringify(suUser));
        setUser(suUser);
        return { success: true, user: suUser };
      }
    } catch {}

    // 3. Fallback: Check local registered accounts
    const accounts = getStoredAccounts();
    const found = accounts.find(
      (a) => a.email?.toLowerCase() === cleanEmail && (!a.password || a.password === cleanPass)
    );

    if (found) {
      const activeUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        gender: found.gender || 'Male',
        avatar_url: found.avatar_url,
        university_id: found.university_id,
        department: found.department,
        year: found.year,
        role: found.role || 'student',
      };
      localStorage.setItem('tibeb_user', JSON.stringify(activeUser));
      setUser(activeUser);
      return { success: true, user: activeUser };
    }

    // 4. Instant student login if using valid format
    if (cleanEmail === 'student@aau.edu.et' || cleanEmail === 'biruk.t@aau.edu.et' || (cleanEmail.includes('@') && cleanPass.length >= 6)) {
      const demoStudent: User = {
        id: 'user-' + Date.now(),
        name: cleanEmail.split('@')[0].replace('.', ' '),
        email: cleanEmail,
        phone: '+251 91 123 4567',
        gender: 'Male',
        university_id: 'aau',
        department: 'Computer Science',
        year: 2,
        role: 'student',
      };
      localStorage.setItem('tibeb_user', JSON.stringify(demoStudent));
      setUser(demoStudent);
      return { success: true, user: demoStudent };
    }

    return {
      success: false,
      error: 'Account not found with this email. Please check your spelling or register.',
    };
  };

  const loginWithPhone = async (phone: string, pass?: string): Promise<AuthResult> => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      return { success: false, error: 'Please enter a valid phone number (at least 9 digits).' };
    }

    const formattedPhone = cleanPhone.startsWith('251')
      ? '+' + cleanPhone
      : '+251' + (cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone);

    const accounts = getStoredAccounts();
    const found = accounts.find((a) => a.phone && a.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-9)));

    if (found) {
      const activeUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        gender: found.gender || 'Male',
        avatar_url: found.avatar_url,
        university_id: found.university_id,
        department: found.department,
        year: found.year,
        role: found.role || 'student',
      };
      localStorage.setItem('tibeb_user', JSON.stringify(activeUser));
      setUser(activeUser);
      return { success: true, user: activeUser };
    }

    const studentUser: User = {
      id: 'user-' + Date.now(),
      name: 'Tibeb Student',
      phone: formattedPhone,
      email: `student.${cleanPhone.slice(-4)}@tibeb.et`,
      gender: 'Male',
      university_id: 'aau',
      department: 'Engineering',
      year: 2,
      role: 'student',
    };
    localStorage.setItem('tibeb_user', JSON.stringify(studentUser));
    setUser(studentUser);
    return { success: true, user: studentUser };
  };

  const registerUser = async (data: {
    name: string;
    email?: string;
    phone?: string;
    gender?: string;
    avatar_url?: string;
    password?: string;
    university_id?: string;
    department?: string;
    year?: number | string;
  }): Promise<AuthResult> => {
    const accounts = getStoredAccounts();

    // Check duplicate email
    if (data.email) {
      const cleanEmail = data.email.trim().toLowerCase();
      if (accounts.some((a) => a.email?.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email already exists. Please log in.' };
      }
    }

    // Try Supabase sign up if email and password provided
    let supabaseUserId = 'user-' + Date.now();
    if (data.email && data.password) {
      try {
        const { data: suSignup, error: suError } = await supabase.auth.signUp({
          email: data.email.trim().toLowerCase(),
          password: data.password.trim(),
          options: {
            data: {
              full_name: data.name.trim(),
              phone: data.phone?.trim(),
              gender: data.gender || 'Male',
              avatar_url: data.avatar_url,
              university_id: data.university_id || 'aau',
              department: data.department || 'General Studies',
              year: data.year || 1,
            },
          },
        });
        if (suSignup.user) {
          supabaseUserId = suSignup.user.id;
        }
      } catch (e) {
        console.warn('Supabase online registration notice:', e);
      }
    }

    const newUser: StoredUserAccount = {
      id: supabaseUserId,
      name: data.name.trim(),
      email: data.email?.trim().toLowerCase(),
      phone: data.phone?.trim(),
      gender: data.gender || 'Male',
      avatar_url: data.avatar_url,
      password: data.password?.trim(),
      university_id: data.university_id || 'aau',
      department: data.department || 'General Studies',
      year: data.year || 1,
      role: 'student',
    };

    accounts.push(newUser);
    saveStoredAccounts(accounts);

    // Set as active user
    const { password, ...safeUser } = newUser;
    localStorage.setItem('tibeb_user', JSON.stringify(safeUser));
    setUser(safeUser);

    return { success: true, user: safeUser };
  };

  const topUpWallet = (amount: number) => {
    setWalletBalance((prev) => {
      const next = prev + amount;
      localStorage.setItem('tibeb_wallet_balance', next.toString());

      try {
        const txs = JSON.parse(localStorage.getItem('tibeb_transactions') || '[]');
        txs.unshift({
          id: 'tx-' + Date.now(),
          type: 'deposit',
          amount,
          date: new Date().toISOString(),
          description: `Telebirr / CBE Top-Up +${amount} ETB`,
          status: 'completed',
        });
        localStorage.setItem('tibeb_transactions', JSON.stringify(txs));
      } catch {}

      return next;
    });
  };

  const payWithWallet = (amount: number, itemIds: string[]): boolean => {
    if (walletBalance < amount) return false;

    const next = walletBalance - amount;
    setWalletBalance(next);
    localStorage.setItem('tibeb_wallet_balance', next.toString());

    try {
      const unlocked = JSON.parse(localStorage.getItem('tibeb_unlocked_items') || '[]');
      const updated = Array.from(new Set([...unlocked, ...itemIds]));
      localStorage.setItem('tibeb_unlocked_items', JSON.stringify(updated));

      const txs = JSON.parse(localStorage.getItem('tibeb_transactions') || '[]');
      txs.unshift({
        id: 'tx-' + Date.now(),
        type: 'purchase',
        amount,
        date: new Date().toISOString(),
        description: `Instant Wallet Unlock (${itemIds.length} item${itemIds.length > 1 ? 's' : ''})`,
        status: 'completed',
        items: itemIds,
      });
      localStorage.setItem('tibeb_transactions', JSON.stringify(txs));

      // Award competition points for buying tests (+50 pts each)
      if (user) {
        const points = POINT_REWARDS.BUY_TEST * Math.max(1, itemIds.length);
        awardStudentPoints(user.id, user.name, points, 'test_purchase', {
          university: user.university_id?.toUpperCase() || 'AAU',
          department: user.department || 'Student'
        });
      }
    } catch {}

    return true;
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem('tibeb_user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        walletBalance,
        topUpWallet,
        payWithWallet,
        signOut,
        setUser,
        signInWithGoogle,
        updateUserProfile,
        loginWithEmail,
        loginWithPhone,
        loginAdmin,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
