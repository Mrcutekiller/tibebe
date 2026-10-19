'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar_url?: string;
  university_id?: string;
  department?: string;
  year?: number;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this would check Supabase session
    // For now, we read from localStorage (mock)
    const stored = localStorage.getItem('tibeb_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const signOut = async () => {
    localStorage.removeItem('tibeb_user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
