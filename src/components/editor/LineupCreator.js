'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';
import { DANCE_FIGURES } from '@/lib/figures';
import { lineupService } from '@/lib/lineup-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function LineupCreator({ initialType = 'standard', onSuccess }) {
  const [type, setType] = useState(initialType);
  const [dance, setDance] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState(initialType ? 'details' : 'choice'); // Skip choice if type is pre-defined
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ name, type, dance }) => lineupService.createLineup(name, type, dance),
    onSuccess: (response) => {
      const { data, error } = response;
      if (data && !error) {
        queryClient.invalidateQueries({ queryKey: ['lineups'] });
        router.push(`/lineups/${data.id}`);
      }
    }
  });

  const dances = type === 'standard' ? Object.keys(DANCE_FIGURES.standard) : Object.keys(DANCE_FIGURES.latin);

  const handleCreate = () => {
    if (!dance || !name) return;
    mutation.mutate({ name, type, dance });
  };

  const isLoading = mutation.isPending;

  if (step === 'choice') {
    return (
      <div className="w-full flex flex-col items-center">
        <header class="w-full mb-16 text-center md:text-left">
          <h1 class="text-5xl md:text-7xl font-black obsidian-gradient tracking-tighter mb-4 leading-none">
            Choose your Path
          </h1>
          <p class="text-white/60 text-lg md:text-xl max-w-2xl font-medium tracking-tight">
            Select your discipline. Each journey is carved with precision and defined by the rhythm of your soul.
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Standard Ballroom Card */}
          <div 
            onClick={() => { setType('standard'); setStep('details'); }}
            class="group relative overflow-hidden rounded-[48px] h-[600px] glass-card standard-glow transition-all duration-500 hover:scale-[1.02] cursor-pointer"
          >
            <div class="absolute inset-0 z-0">
              <img 
                alt="Standard Ballroom" 
                class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsxrDqEFlqS7xFVZvObzMxeLkPHcwChlGR4xt92lKUhSCMfLSQS9yyQnbYqefZnIBBeSirvjy2ZMiSsJfuAArmb7VsJ9BIauoH_a93LKIMLprvSQjA_q2J1BtYQpoRQ4vdJLv2hGC4dlaP-wY9cMXoUtajU86_lRKnZFNHSNJo7rlIwattoabwdQs8KzR5kU0sc6_oydxqNLMvrjlb9qF0I80cItQRtPrgsOYROF9AFNFRJDHu0J1IWSgJOl2n_8jCY0YM82o00vg" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>
            </div>
            <div class="relative z-10 h-full p-12 flex flex-col justify-end">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-1.5 h-8 bg-secondary rounded-full"></div>
                <span class="text-xs font-bold tracking-[0.2em] text-secondary uppercase">The Gallery</span>
              </div>
              <h2 class="text-5xl font-black text-white mb-4 tracking-tighter">Standard</h2>
              <p class="text-white/60 text-base mb-8 max-w-xs leading-relaxed">
                Precision, elegance, and continuous flow. Master the Waltz, Tango, and the ethereal Viennese Waltz.
              </p>
              <div class="flex flex-wrap gap-2 mb-10">
                <span class="px-4 py-2 rounded-full bg-white/5 text-xs font-semibold text-secondary">Waltz</span>
                <span class="px-4 py-2 rounded-full bg-white/5 text-xs font-semibold text-secondary">Tango</span>
                <span class="px-4 py-2 rounded-full bg-white/5 text-xs font-semibold text-secondary">Viennese Waltz</span>
              </div>
              <button class="w-fit flex items-center gap-4 py-4 px-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-on-primary font-bold transition-transform active:scale-95 shadow-xl shadow-primary/10">
                Begin Journey
                <span class="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Latin Stage Card */}
          <div 
            onClick={() => { setType('latin'); setStep('details'); }}
            class="group relative overflow-hidden rounded-[48px] h-[600px] glass-card latin-glow transition-all duration-500 hover:scale-[1.02] cursor-pointer"
          >
            <div class="absolute inset-0 z-0">
              <img 
                alt="Latin Stage" 
                class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDrgcZiAj0hZb5dmY9HaOXFoV4jvFCTdz4qaMfzWPyH_GVSDhpGmxhevHxYdYo7gazvwwrHjCcvWWr3CWnOXI8_Ub-pzdhY4eib58ZEcBuASftoInmkU3vXmfBJOZ2tjb7JOOO9c0PZVE496G-fsSiZ0cK2Jca_UBCWfNQ02FIIno82LdnnbC89gKlsAzxoyp3Eb23QPB5Q7NVvAAsbnJ57dCnNAjTT-U3fDp1KW1xrV7Szt0WbhQXlaSlKOSi-F_OFbNwlLbsGQ0" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>
            </div>
            <div class="relative z-10 h-full p-12 flex flex-col justify-end">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-1.5 h-8 bg-error rounded-full"></div>
                <span class="text-xs font-bold tracking-[0.2em] text-error uppercase">The Stage</span>
              </div>
              <h2 class="text-5xl font-black text-white mb-4 tracking-tighter">Latin</h2>
              <p class="text-white/60 text-base mb-8 max-w-xs leading-relaxed">
                Rhythm, fire, and raw expression. Command the Samba, Rumba, and the high-energy Jive.
              </p>
              <div class="flex flex-wrap gap-2 mb-10">
                <span class="px-4 py-2 rounded-full bg-white/5 text-xs font-semibold text-error text-opacity-80">Samba</span>
                <span class="px-4 py-2 rounded-full bg-white/5 text-xs font-semibold text-error text-opacity-80">Cha Cha</span>
                <span class="px-4 py-2 rounded-full bg-white/5 text-xs font-semibold text-error text-opacity-80">Rumba</span>
              </div>
              <button class="w-fit flex items-center gap-4 py-4 px-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-on-primary font-bold transition-transform active:scale-95 shadow-xl shadow-primary/10">
                Ignite Stage
                <span class="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-10 glass-panel rounded-[3rem] space-y-12">
      <button 
        onClick={() => setStep('choice')}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-black"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Change Path
      </button>

      <div className="text-center space-y-2">
        <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] opacity-60">Initiation Protocol</span>
        <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight leading-none">
          {type === 'standard' ? 'Standard' : 'Latin'} Studio
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Select Specific Dance</label>
          <div className="grid grid-cols-2 gap-3">
            {dances.map(d => (
              <button
                key={d}
                onClick={() => setDance(d)}
                disabled={isLoading}
                className={clsx(
                  "px-6 py-4 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-widest",
                  dance === d ? "bg-primary text-black border-primary" : "bg-black/40 text-white/40 border-white/5 hover:bg-white/5 hover:text-white",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {d.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Routine Name</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Moonlight Waltz 2026"
            className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 font-headline font-bold text-white placeholder:text-white/10 outline-none focus:ring-1 focus:ring-primary/40 focus:bg-white/5 transition-all text-lg disabled:opacity-50"
          />
        </div>
      </div>

      <div className="pt-8">
        <Button 
          onClick={handleCreate}
          disabled={!dance || !name || isLoading}
          variant="primary" 
          size="lg" 
          className="w-full h-20 rounded-[1.5rem] !text-lg !font-black !tracking-[0.2em] shadow-2xl shadow-primary/20"
        >
          {isLoading ? 'ENCRYPTING...' : 'ENTER THE STUDIO'}
        </Button>
      </div>
    </div>
  );
}
