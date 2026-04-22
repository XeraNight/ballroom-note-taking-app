'use client';

import { useDance } from '@/context/DanceContext';
import { HeroRoutineCard } from '@/components/dashboard/DashboardComponents';

export default function DashboardPage() {
  const { danceType } = useDance();
  const isStandard = danceType === 'standard';

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-black tracking-tighter text-on-surface uppercase font-headline italic outline-none">
            {isStandard ? 'Standard' : 'Latin'} 
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <HeroRoutineCard 
          title={isStandard ? "Waltz Fundamentals" : "Explosive Samba"}
          subtitle={isStandard ? 'Focusing on Progressive Link and Natural Turn precision.' : 'Explosive hip actions and timing synchronization.'}
          tag="Active Workspace"
          time={isStandard ? "Waltz" : "Samba"}
          image={isStandard 
             ? "/images/standard_hero.jpg"
             : "/images/latin_hero.jpg"
          }
          gradient={isStandard ? 'from-[#0e0e0e]' : 'from-[#131313]'}
          color={danceType}
        />
      </div>
    </div>
  );
}
