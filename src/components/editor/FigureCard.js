'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';

export function FigureCard({ figure, active, pos }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: figure.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="relative group shrink-0"
    >
      <div className={clsx(
        "w-52 h-64 rounded-2xl p-7 flex flex-col justify-between shadow-2xl transition-all cursor-grab",
        active 
          ? "bg-primary/5 border border-primary/40 shadow-primary/10 scale-105" 
          : "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-primary/30"
      )}>
        <div className="flex justify-between items-start">
          <div className={clsx(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            active ? "bg-primary/20" : "bg-white/5"
          )}>
            <span className={clsx(
              "material-symbols-outlined text-lg",
              active ? "text-primary font-fill" : "text-white/30"
            )}>
              {figure.type === 'spin' ? 'cyclone' : 'motion_photos_on'}
            </span>
          </div>
          <span className={clsx(
            "text-[9px] font-black tracking-[0.2em] uppercase",
            active ? "text-primary" : "text-white/20"
          )}>
            POS {pos}
          </span>
        </div>

        <div className="space-y-1">
          <p className={clsx(
            "font-bold text-xl leading-tight uppercase font-headline",
            active ? "text-white" : "text-white/80"
          )}>
            {figure.name}
          </p>
          <p className="text-[9px] text-white/40 uppercase tracking-[0.15em] font-medium font-label">
            {figure.category || 'Core Move'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={clsx(
                "h-full transition-all duration-500",
                active ? "bg-primary shadow-[0_0_8px_rgba(212,175,55,0.5)] w-full" : "bg-white/20 w-1/2"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
