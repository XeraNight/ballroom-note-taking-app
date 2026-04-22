'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDance } from '@/context/DanceContext';
import { lineupService } from '@/lib/lineup-service';
import { DANCES } from '@/lib/dance-data';
import { clsx } from 'clsx';
import { useQuery } from '@tanstack/react-query';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { danceType, setType } = useDance();

  const { data: lineups, refetch } = useQuery({
    queryKey: ['lineups'],
    queryFn: () => lineupService.listLineups(),
  });

  const isStandard = danceType === 'standard';
  const themeColor = isStandard ? 'text-[#D4AF37]' : 'text-red-500';
  const themeBg = isStandard ? 'bg-[#D4AF37]/10' : 'bg-red-500/10';
  
  const currentDances = DANCES[danceType] || [];

  const handleDanceClick = async (danceName) => {
    const lineupList = Array.isArray(lineups?.data) ? lineups.data : [];
    const existing = lineupList.find(l => 
      l.dance_name.toLowerCase() === danceName.toLowerCase() && 
      l.dance_type === danceType
    );

    if (existing) {
      router.push(`/lineups/${existing.id}`);
    } else {
      const { data, error } = await lineupService.createLineup(`${danceName} Routine`, danceType, danceName);
      if (data && !error) {
        refetch();
        router.push(`/lineups/${data.id}`);
      }
    }
  };

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col w-64 rounded-[2.5rem] h-[85vh] shadow-2xl border border-white/5 bg-white/[0.01] backdrop-blur-[40px] overflow-hidden">
      <div className="flex flex-col h-full py-10 px-4">
        
                <div className="flex flex-col items-center gap-4 w-full px-4 mb-6">
          <div className="flex gap-4 p-1.5 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-md">
            <button 
              onClick={() => setType('standard')}
              className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                isStandard ? "bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]" : "text-white/20 hover:text-white/40"
              )}
            >
              <span className="material-symbols-outlined text-lg italic" style={{ fontVariationSettings: "'FILL' 1" }}>waves</span>
            </button>
            <button 
              onClick={() => setType('latin')}
              className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                !isStandard ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]" : "text-white/20 hover:text-white/40"
              )}
            >
              <span className="material-symbols-outlined text-lg italic" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </button>
          </div>
        </div>

                <nav className="w-full px-2 mb-4">
           <Link 
            href="/dashboard" 
            className={clsx(
              "flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group/item",
              pathname === '/dashboard' ? themeBg + " " + themeColor : "text-white/20 hover:bg-white/5 hover:text-white"
            )}
           >
              <div className="flex items-center gap-4">
                <span className={clsx(
                  "material-symbols-outlined shrink-0 text-lg transition-colors",
                  pathname === '/dashboard' ? themeColor : "group-hover/item:text-white"
                )}>grid_view</span>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Library</span>
              </div>
            </Link>
        </nav>

                <div className="flex-1 flex flex-col min-h-0">
           <div className="flex items-center justify-between px-6 mb-4">
             <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em] italic">Dance Vault</span>
             <div className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", isStandard ? "bg-[#D4AF37]/40" : "bg-red-500/40")}></div>
           </div>
           
           <nav className="flex-1 flex flex-col justify-around py-0">
              {currentDances.map((dance) => {
                const routine = lineups?.data?.find(l => 
                  l.dance_name.toLowerCase() === dance.name.toLowerCase() && 
                  l.dance_type === danceType
                );
                
                return (
                  <button 
                    key={dance.name}
                    onClick={() => handleDanceClick(dance.name)}
                    className="w-full group/dance px-2"
                  >
                    <div className="flex items-center justify-between px-5 py-2.5 rounded-xl transition-all duration-500 hover:bg-white/[0.03] text-white/20 hover:text-white border border-transparent hover:border-white/5 relative overflow-hidden">
                      <div className="flex items-center gap-4 relative z-10">
                        <span className={clsx(
                          "material-symbols-outlined shrink-0 text-base transition-colors duration-500",
                          "group-hover/dance:" + themeColor
                        )}>{dance.icon}</span>
                        <span className="text-[10px] font-black tracking-[0.1em] uppercase">{dance.name}</span>
                      </div>
                      
                                            <div className={clsx(
                        "absolute inset-0 opacity-0 group-hover/dance:opacity-5 transition-opacity duration-700",
                        isStandard ? "bg-[#D4AF37]" : "bg-red-500"
                      )}></div>
                    </div>
                  </button>
                );
              })}
           </nav>
        </div>

                <div className="w-full px-2 mt-4 border-t border-white/5 pt-6 text-center">
          <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em] italic">Obsidian Stage</p>
          <p className="text-[7px] font-bold text-white/5 uppercase mt-1">Public Edition v1.0</p>
        </div>
      </div>
    </aside>
  );
}
