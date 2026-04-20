'use client';

import { useDance } from '@/context/DanceContext';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';

export default function SelectDancePage() {
  const { setType } = useDance();
  const router = useRouter();

  const handleSelect = (type) => {
    setType(type);
    router.push('/dashboard');
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-surface">
      {/* Background with Ambient Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-12 space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic font-headline">Choose Your Discipline</h1>
          <p className="text-white/40 font-black uppercase tracking-[0.4em] text-[11px]">Select your active studio environment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Standard Selection */}
          <button 
            onClick={() => handleSelect('standard')}
            className="group relative h-[450px] rounded-[3rem] overflow-hidden glass-panel border border-white/5 hover:border-[#D4AF37]/40 transition-all duration-700 hover:scale-[1.02] shadow-2xl"
          >
            <div className="absolute inset-0 z-0 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-700 scale-105 group-hover:scale-100">
               <img src="/images/standard_hero.jpg" className="w-full h-full object-cover" alt="Standard Dance" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
            
            <div className="relative z-20 h-full flex flex-col items-center justify-center p-12 text-center gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tight">Standard</h2>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Waltz • Tango • Foxtrot</p>
              </div>
            </div>
          </button>

          {/* Latin Selection */}
          <button 
            onClick={() => handleSelect('latin')}
            className="group relative h-[450px] rounded-[3rem] overflow-hidden glass-panel border border-white/5 hover:border-red-600/40 transition-all duration-700 hover:scale-[1.02] shadow-2xl"
          >
            <div className="absolute inset-0 z-0 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-700 scale-105 group-hover:scale-100">
               <img src="/images/latin_hero.jpg" className="w-full h-full object-cover" alt="Latin Dance" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
            
            <div className="relative z-20 h-full flex flex-col items-center justify-center p-12 text-center gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tight">Latin</h2>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Cha Cha • Rumba • Samba</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
