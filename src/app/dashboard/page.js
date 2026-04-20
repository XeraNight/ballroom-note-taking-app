'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { lineupService } from '@/lib/lineup-service';
import { useDance } from '@/context/DanceContext';
import { CategoryPointsWidget, ActivityFeed, HeroRoutineCard } from '@/components/dashboard/DashboardComponents';
import clsx from 'clsx';

export default function DashboardPage() {
  const router = useRouter();
  const { danceType } = useDance();
  const isStandard = danceType === 'standard';

  useEffect(() => {
    // SECURITY GUARD: Check if JWT exists
    const token = localStorage.getItem('ballroom_jwt');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const { data: lineups, refetch } = useQuery({
    queryKey: ['lineups'],
    queryFn: () => lineupService.getLineups(),
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      // In a real academic pro app, we would call /api/me on our custom backend
      return { displayName: 'Dancer' }; 
    },
  });

  const filteredLineups = lineups?.data?.filter(l => l.dance_type === danceType) || [];

  const themeColorClass = isStandard ? "text-primary" : "text-red-500";
  const themeGradientClass = isStandard ? "standard-gradient" : "latin-gradient";

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-black tracking-tighter text-on-surface uppercase font-headline italic outline-none">
            {isStandard ? 'Standard' : 'Latin'} 
          </h1>
        </div>
        
        {/* Stats removed per request */}
      </header>

      <div className="grid grid-cols-12 gap-8">
        <HeroRoutineCard 
          title={isStandard ? "Waltz Fundamentals" : "Explosive Samba"}
          subtitle={isStandard ? 'Focusing on Progressive Link and Natural Turn precision.' : 'Explosive hip actions and timing synchronization.'}
          tag="Active Studio"
          time={isStandard ? "Waltz" : "Samba"}
          image={isStandard 
             ? "/images/standard_hero.jpg"
             : "/images/latin_hero.jpg"
          }
          gradient={isStandard ? 'from-[#0e0e0e]' : 'from-[#131313]'}
          color={danceType}
        />
      </div>

      {/* Active Routines section removed per request */}
    </div>
  );
}
