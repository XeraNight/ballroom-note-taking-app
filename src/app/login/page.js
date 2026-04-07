'use client';

import { useState } from 'react';
import { signInWithAudit } from '@/lib/auth-service';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signInWithAudit(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/discipline');
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-surface">
      {/* High-Impact Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Dramatic dance stage background" 
          className="w-full h-full object-cover grayscale contrast-125 opacity-40"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCswS5OO-D94FFlmGFdVeIIxJZU-0QrvI4_cm1pf9Itey_H8OWqNZluqDfOGq5yxqL3w-IK7Sz-cVKsarXpV9_nKS9FQrVgHoVxKtUHtwVzjYutic5T5tCJ0spJUvpZPVhzaGrldenbTFwlkPVEHhGoWv_Ajt6ERXM4U4v7p2WeHvgEQilFaQj1YvnyBHgnlghPiFDJ6qx59Es66jvAoM0KHGYYCWzjvi3vysIp6xdB3Q_8fogWtXGAeUhRd4y20waxWKXLoSdEcoE" 
        />
        {/* Tonal Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface-container-lowest opacity-90"></div>
      </div>

      {/* Content Shell */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Branding Header */}
        <div className="text-center mb-12">
          <h1 className="font-headline font-black tracking-widest text-primary text-3xl mb-2 uppercase">OBSIDIAN STAGE</h1>
          <p className="font-label text-[10px] tracking-[0.4em] text-on-surface opacity-40 uppercase">Curated Choreography</p>
        </div>

        {/* Sleek Login Card */}
        <div className="glass-effect p-10 rounded-xl shadow-2xl border-none">
          <form className="space-y-8" onSubmit={handleSignIn}>
            {/* Form Fields */}
            <div className="space-y-6">
              <div className="relative group">
                <label className="block font-label text-[10px] tracking-widest uppercase text-primary mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">Email Address</label>
                <input 
                  className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body text-sm py-3 transition-colors placeholder:text-on-surface/20" 
                  placeholder="performer@obsidian.stage" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <label className="block font-label text-[10px] tracking-widest uppercase text-primary mb-2 opacity-70 group-focus-within:opacity-100 transition-opacity">Password</label>
                <input 
                  className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body text-sm py-3 transition-colors placeholder:text-on-surface/20" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold text-center">{error}</p>
            )}

            {/* Primary Action */}
            <div className="pt-4">
              <button 
                disabled={loading}
                className="gold-gradient w-full py-4 rounded-lg font-headline font-bold text-on-primary tracking-widest text-xs uppercase shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            {/* Minimal Secondary Action */}
            <div className="flex items-center justify-between pt-2">
              <a className="font-label text-[10px] tracking-widest uppercase text-on-surface opacity-40 hover:opacity-100 transition-opacity" href="#">Reset Access</a>
              <a className="font-label text-[10px] tracking-widest uppercase text-primary hover:underline transition-all" href="#">Request Entry</a>
            </div>
          </form>
        </div>

        {/* Bottom Branding */}
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-6 mb-6">
            <span className="material-symbols-outlined text-on-surface/30 cursor-pointer hover:text-primary transition-colors">lock_open</span>
            <span className="material-symbols-outlined text-on-surface/30 cursor-pointer hover:text-primary transition-colors">fingerprint</span>
            <span className="material-symbols-outlined text-on-surface/30 cursor-pointer hover:text-primary transition-colors">qr_code_2</span>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 w-full py-8 pointer-events-none">
        <div className="flex flex-col items-center justify-center gap-2 opacity-20">
          <p className="font-label text-[9px] tracking-[0.3em] uppercase">© {new Date().getFullYear()} THE OBSIDIAN STAGE. CURATED CHOREOGRAPHY.</p>
        </div>
      </footer>
    </main>
  );
}
