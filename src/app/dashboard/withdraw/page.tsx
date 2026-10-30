'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardWithdrawRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/payment?tab=withdraw');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#0B5D3B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-gray-500">Opening Student Withdrawal Portal (Min 20 ETB)...</p>
      </div>
    </div>
  );
}

