'use client';

import { useRouter } from 'next/navigation';

export default function DisciplinePage() {
  const router = useRouter();

  const handleSelect = (style) => {
    // We'll store the selection or just redirect to the list/create page
    router.push(`/lineups/new?style=${style}`);
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen flex flex-col">
      {/* TopAppBar Navigation Shell */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-4 bg-[#131313]/60 backdrop-blur-xl z-50">
        <div className="text-xl font-black tracking-widest text-primary font-headline uppercase">OBSIDIAN STAGE</div>
        <div className="hidden md:flex items-center gap-8">
          <a className="font-headline tracking-tighter font-bold uppercase text-sm text-[#E2E2E2] opacity-70 hover:opacity-100 transition-opacity duration-300" href="#">Library</a>
          <a className="font-headline tracking-tighter font-bold uppercase text-sm text-[#E2E2E2] opacity-70 hover:opacity-100 transition-opacity duration-300" href="#">Workshops</a>
          <a className="font-headline tracking-tighter font-bold uppercase text-sm text-[#E2E2E2] opacity-70 hover:opacity-100 transition-opacity duration-300" href="#">Choreography</a>
        </div>
        <div className="flex items-center gap-4 text-primary">
          <button className="material-symbols-outlined hover:opacity-100 transition-opacity duration-300">notifications</button>
          <button className="material-symbols-outlined hover:opacity-100 transition-opacity duration-300">account_circle</button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col justify-center items-center px-6 pt-24 pb-12">
        {/* Header Section */}
        <header className="w-full max-w-6xl mb-16 text-left">
          <p className="font-label text-[10px] tracking-[0.3em] uppercase text-primary mb-4">Curated Selection</p>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-none mb-4 uppercase">
            CHOOSE YOUR <br /> <span className="text-primary italic">DISCIPLINE.</span>
          </h1>
          <p className="font-body text-on-surface opacity-60 max-w-md text-lg">
            Select a performance style to access specialized movement vaults and choreography notes.
          </p>
        </header>

        {/* Selection Grid */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Standard Card */}
          <div className="group relative overflow-hidden rounded-lg bg-surface-container h-[600px] flex items-end p-10 transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-40 group-hover:opacity-60" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlApKJz7vxuyYbYRXBJxlSZ_EnqOo919Jw861DjWQHEpsBMzEXnGTz993qYVexvj3y7ZKrNLzAO1xQP7RM_FnRYlNRRwbinY2dmr3zbaz0DZ6rwW5djhSG0UBYms7U8ZLL__MHBFvknPb0EAQAidmY3-XoqjvKZzmVnVtfha6LQWsDp2ZvPuTb6vDCSKQRCEHCyVF92Qi5I7u7KuGm21bS9XBngO6Qb7uqtddu-ij39YeghCX4pPE1vf7ioxzp-qNuFkwuOkO-Pq0" 
                alt="Standard Ballroom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-secondary/40 to-transparent mix-blend-multiply opacity-80"></div>
            </div>
            {/* Content */}
            <div className="relative z-10 w-full flex flex-col items-start gap-6">
              <div className="flex flex-col">
                <span className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary mb-2 opacity-80">The Classics</span>
                <h2 className="font-headline text-5xl font-black text-on-surface tracking-tighter uppercase">Standard</h2>
              </div>
              <p className="font-body text-on-surface/70 text-sm max-w-xs leading-relaxed group-hover:text-on-surface transition-colors">
                Waltz, Tango, Viennese Waltz, Foxtrot, and Quickstep. Master the art of frame and poise.
              </p>
              <button 
                onClick={() => handleSelect('standard')}
                className="bg-primary text-on-primary font-headline font-bold py-4 px-10 rounded-md tracking-widest text-xs uppercase shadow-2xl hover:bg-primary-container transition-all flex items-center gap-2 group/btn active:scale-95 duration-200"
              >
                Select Style
                <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Latin Card */}
          <div className="group relative overflow-hidden rounded-lg bg-surface-container h-[600px] flex items-end p-10 transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-40 group-hover:opacity-60" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAglSkDzZ6diwERma3RJaNIfhf7_DZ6_b7fZnjcUtE4gXbJcPoseQ_at8zNOiVMLqMS5ANOS7y82LGaGNaSasSlQc6YDETK7PApUpTCHUiVPWwvzp_P1nUH1LykoBVoBJ24Pc9wqpdIKGMtlIz_GAlPZJnezUy4jO7UJMtNvCgUOoZB2U-KW5AqH2x3HdaQirxOnFMYaepPrEcxkN0zwTf3FRfs0ztfgKdQ37gvbzMoDSM9bYr97pfAAfh2yAtYhFl_aurbIWuGIbA" 
                alt="Latin Ballroom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-tertiary/40 to-transparent mix-blend-multiply opacity-80"></div>
            </div>
            {/* Content */}
            <div className="relative z-10 w-full flex flex-col items-start gap-6">
              <div className="flex flex-col">
                <span className="font-label text-[10px] tracking-[0.2em] uppercase text-tertiary mb-2 opacity-80">The Rhythm</span>
                <h2 className="font-headline text-5xl font-black text-on-surface tracking-tighter uppercase">Latin</h2>
              </div>
              <p className="font-body text-on-surface/70 text-sm max-w-xs leading-relaxed group-hover:text-on-surface transition-colors">
                Cha Cha, Samba, Rumba, Paso Doble, and Jive. Express pure passion through rhythm and isolation.
              </p>
              <button 
                onClick={() => handleSelect('latin')}
                className="bg-primary text-on-primary font-headline font-bold py-4 px-10 rounded-md tracking-widest text-xs uppercase shadow-2xl hover:bg-primary-container transition-all flex items-center gap-2 group/btn active:scale-95 duration-200"
              >
                Select Style
                <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Metadata Accent */}
        <div className="mt-20 flex gap-12 opacity-20 hover:opacity-50 transition-opacity">
          <div className="flex flex-col items-center">
            <span className="font-label text-[10px] tracking-widest">EST. {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-label text-[10px] tracking-widest uppercase">Obsidian Core V1.02</span>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-surface-container-lowest">
        <div className="flex gap-8">
          <a className="font-label text-[10px] tracking-[0.2em] uppercase opacity-40 text-on-surface hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="font-label text-[10px] tracking-[0.2em] uppercase opacity-40 text-on-surface hover:text-primary transition-colors" href="#">Terms</a>
          <a className="font-label text-[10px] tracking-[0.2em] uppercase opacity-40 text-on-surface hover:text-primary transition-colors" href="#">Studio Access</a>
        </div>
        <p className="font-label text-[10px] tracking-[0.2em] uppercase opacity-40 text-on-surface">© {new Date().getFullYear()} THE OBSIDIAN STAGE. CURATED CHOREOGRAPHY.</p>
      </footer>
    </div>
  );
}
