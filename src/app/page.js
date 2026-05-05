'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-8">
      <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin"></div>
      <div className="text-[#D4AF37] font-black tracking-[0.5em] text-[10px] animate-pulse uppercase">Entering EllegNote</div>
    </div>
  );
}
