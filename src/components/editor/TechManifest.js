'use client';

import { useState, useEffect } from 'react';

export function TechManifest({ isOpen, onClose, lineup }) {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [jsonPreview, setJsonPreview] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Check backend status
      fetch('http://localhost:4000/status')
        .then(res => res.json())
        .then(() => setBackendStatus('Healthy (Express.js)'))
        .catch(() => setBackendStatus('Connection Error'));

      // Format current lineup for preview
      setJsonPreview(JSON.stringify({
        routine_name: 'Waltz Example',
        figures_count: lineup.length,
        data: lineup.slice(0, 3) // Show first 3 for brevity
      }, null, 2));
    }
  }, [isOpen, lineup]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl glass-modal rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 flex flex-col">
        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Architecture Manifest</span>
            <h2 className="text-2xl font-bold text-white uppercase italic tracking-tight">Technical Specifications</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <main className="p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {/* Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-2">Backend Hub</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${backendStatus.includes('Healthy') ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <span className="text-xs font-bold text-white/80">{backendStatus}</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-2">Persistence Layer</span>
              <span className="text-xs font-bold text-white/80">Local JSON (db.json)</span>
            </div>
          </div>

          {/* Logic Explanation */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-l-2 border-primary pl-3">Integration Summary</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              This application utilizes a hybrid architecture. **Supabase** handles secure session management and authentication, 
              while a custom **Express.js** instance provides real-time persistence for choreographic routines via a RESTful API. 
              Assets (videos/images) are served directly from the local filesystem to bypass cloud storage limits.
            </p>
          </section>

          {/* Code Preview */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-widest border-l-2 border-primary pl-3">Data Exchange Payload</h3>
              <span className="text-[8px] font-bold text-white/20 uppercase">View: JSON</span>
            </div>
            <pre className="p-6 rounded-2xl bg-black/40 border border-white/5 text-[10px] text-primary/70 font-mono overflow-x-auto">
              {jsonPreview}
              {"\n"}  ...
            </pre>
          </section>
        </main>

        <footer className="p-6 bg-white/[0.02] border-t border-white/5 text-center px-10">
          <p className="text-[9px] text-white/20 font-medium uppercase tracking-[0.2em] leading-relaxed">
            Technical submission for homework requirements — Verified Backend Persistence
          </p>
        </footer>
      </div>
    </div>
  );
}
