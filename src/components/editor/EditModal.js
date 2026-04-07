'use client';

import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

export function EditModal({ isOpen, onClose, figure }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-sm overflow-hidden">
      <div className="w-full h-full max-w-[1600px] glass-effect rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative border border-white/10">
        
        {/* Sidebar Nav Shell */}
        <aside className="hidden md:flex flex-col w-20 hover:w-64 transition-all duration-500 overflow-hidden bg-black/20 backdrop-blur-3xl z-40 border-r border-white/5 group">
          <div className="flex flex-col h-full py-10">
            <div className="px-5 mb-12 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/10 ring-4 ring-white/5">
                <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHazofDDMkPx-chXCEDNuP50T6-vjeB0b73jPbmswYzZfKEyXwSQuZ6drT4xfGgLacbRYTJ8k-gN2WRcfzVtU1O38zp6lTWN1HFLpoY6SkUr91kw8SKD7RGbjUlUFKwZm7105-SnXHWClJrCeQ7P7sYKAmxg37dEVzF_42l3FxSrfvaT6aJ7hfZCXaeEaS4ld0cRwhmlAsqkFonaPtz8l2PTYaQwm9yZzZW2vr2S8EJxUZDwqY8mYd3tGRds7-NvAsUUY-_iSxTZQ" />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <p className="font-headline font-semibold text-sm text-white">Curator</p>
                <p className="font-label text-[10px] text-white/40 uppercase tracking-[0.1em]">Choreographer</p>
              </div>
            </div>
            
            <nav className="flex-1 px-5 space-y-8">
              <span className="material-symbols-outlined text-white/40 cursor-default">grid_view</span>
              <span className="material-symbols-outlined text-primary font-fill">auto_fix_high</span>
              <span className="material-symbols-outlined text-white/40 cursor-default">accessibility_new</span>
            </nav>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col bg-transparent">
          {/* Top Bar */}
          <header className="h-28 flex items-center justify-between px-10 border-b border-white/5 bg-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] font-label font-bold uppercase tracking-[0.25em] text-primary/80 mb-1">Figure Editing</span>
              <h1 className="text-3xl font-headline font-black tracking-tight text-white uppercase">{figure?.name || 'The Obsidian Arc'}</h1>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-full font-label font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
              >
                Cancel
              </button>
              <Button size="md" className="px-8 rounded-full" onClick={onClose}>
                Save Changes
              </Button>
            </div>
          </header>

          {/* Canvas */}
          <main className="flex-1 overflow-y-auto p-10 space-y-12 bg-white/2 overflow-x-hidden">
            <div className="grid grid-cols-12 gap-10">
              {/* Media Displays */}
              <div className="col-span-12 lg:col-span-8 space-y-10 text-left">
                <section className="relative group">
                  <div className="w-full aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/10 shadow-2xl relative">
                    <img alt="Primary visual" className="w-full h-full object-cover brightness-75 transition-all duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeGnxhBa9EiWQiF-GQuJkj17wGTwutrdlC5fATv3w2cMzQkdufAqtmR2p_taNRCS_Y8CQjWI4JNclNGeANrheLvgSVDOHOydU5zzsx2hxkGj5ZzpJomRHr_7U6cDaNVwcrCRDFYKEwsOlBbFneLzP0ar6LfTCODXpcIvW3JTPRavWtEt8MeerfOzjSCUaqX2ieJ-Y_DXVzm17zcubQbmg2qsfwfUZ7DpW8ZnTnOiAqn27jW1abOIu6EIu9QyHOfmIPoEepiyZ7C8s" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <span className="material-symbols-outlined text-4xl text-white font-fill">play_arrow</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-between items-center">
                    <h3 className="font-headline font-bold text-xl text-white/90">Primary Sequence: Kinetic Flow</h3>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-video rounded-[1.5rem] overflow-hidden bg-white/5 border border-white/10 relative group">
                      <img alt="Alt angle" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8GR6lzenLFvf7cKeYiKKpY6rzhWnNHYRsFMM-i8vBt29wMhj6Xi9j65qpuwPGTddCQvQxNeZcCTLzwRY8n12bKrtimXnAQ89LcmLXYP8Rvh1FV6CtIlpi1Wjecc3DgvanJwZrYyefJpbIFj16LlVD2iNRbT2qrFPDIYbsU2Mt4hWCpQI_ZwUDSbGYSyWk0sRuOXePn4fHKRh5QRUIRlGNHDi8HEXvZH5XG3agDAatk2Wyr1gpLmlXG62MFpjUoPdyHJcjJyjZCBQ" />
                      <div className="absolute top-4 left-4 glass-panel px-4 py-1.5 rounded-full text-[9px] font-black text-primary uppercase tracking-widest bg-black/40">Technical: Feet</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-video rounded-[1.5rem] overflow-hidden bg-white/5 border border-white/10 relative group">
                      <img alt="Reference" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaRibj5LCDkzD5v9lD96n57qD-kPM-TULbGgoKzHFUF1Dz0NsRPtvsWEn6yVyeRJVblgi_2MIOH2n4_FIPrwGQBq8ZXxcHtZ_JxDLpvghxb0MhT8K-kXLmyASnLuuwv0VvaM77uNDIsoYOwgRLjc6iRFgdYTAV40vUOMEddVnCcvQx-ZyDrSzTnJa6T8eb2N6lFnLyJ4brCh_y9rXa9Ercm6Hcp579fI47d_toBdi78ySh6Bosr_Vg1PrlvqWtOGY6qk3M6xw9c7k" />
                      <div className="absolute top-4 left-4 glass-panel px-4 py-1.5 rounded-full text-[9px] font-black text-primary uppercase tracking-widest bg-black/40">Technical: Arms</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Notes */}
              <div className="col-span-12 lg:col-span-4 space-y-10 text-left">
                <section className="glass-effect p-8 rounded-[2rem] flex flex-col h-[400px] border border-white/5 bg-white/[0.03]">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary font-fill">notes</span>
                    <h2 className="font-headline font-black text-xl tracking-tight uppercase">Curator Notes</h2>
                  </div>
                  <textarea 
                    className="flex-1 w-full bg-black/40 border border-white/5 rounded-2xl p-5 font-body text-sm text-white/70 focus:ring-1 focus:ring-primary/40 focus:bg-white/10 outline-none placeholder:text-white/20 resize-none transition-all" 
                    placeholder="Enter technical feedback or choreographic adjustments..."
                  ></textarea>
                </section>

                <section className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.03] backdrop-blur-md">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">BPM Sync</span>
                      <span className="text-primary font-black text-sm tracking-tighter">124 BPM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Difficulty</span>
                      <span className="text-white font-bold text-sm tracking-tight uppercase">Master</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
