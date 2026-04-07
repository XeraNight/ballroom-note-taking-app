'use client';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) {
  const variants = {
    primary: 'gold-gradient text-on-primary shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95',
    secondary: 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white',
    outline: 'border-2 border-dashed border-white/5 text-white/20 hover:border-primary/20 hover:text-white/40 bg-white/[0.01]',
    ghost: 'text-white/40 hover:bg-white/5 hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-10 py-4 text-sm',
  };

  return (
    <button
      className={twMerge(
        'rounded-lg font-headline font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
