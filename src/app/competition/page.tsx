'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompetitionRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/competition');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#0B5D3B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-gray-500">Loading Student Competition & Leaderboard...</p>
      </div>
    </div>
  );
}

