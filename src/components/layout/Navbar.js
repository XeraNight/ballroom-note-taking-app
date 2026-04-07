'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-4 bg-[#131313]/60 backdrop-blur-xl z-50 border-b border-white/5">
      <Link href="/" className="text-xl font-black tracking-widest text-primary font-headline uppercase">
        OBSIDIAN STAGE
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="/library">Library</NavLink>
        <NavLink href="/workshops">Workshops</NavLink>
        <NavLink href="/choreography">Choreography</NavLink>
      </div>

      <div className="flex items-center gap-4 text-primary">
        <button className="material-symbols-outlined hover:opacity-100 transition-opacity duration-300">notifications</button>
        <button className="material-symbols-outlined hover:opacity-100 transition-opacity duration-300">account_circle</button>
      </div>
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link 
      href={href} 
      className="font-headline tracking-tighter font-bold uppercase text-sm text-[#E2E2E2] opacity-70 hover:opacity-100 transition-opacity duration-300"
    >
      {children}
    </Link>
  );
}
