'use client';

import { useDraggable } from '@dnd-kit/core';
import { clsx } from 'clsx';

export function VaultFigure({ figure, onAdd, danceType = 'standard' }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `vault-${figure.id}`,
    data: {
      type: 'vault-item',
      figure: figure,
    },
  });
  return (
    <div 
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={clsx(
        "glass-card p-3 rounded-xl cursor-grab active:cursor-grabbing flex items-center gap-3 group/item transition-all mx-1",
        isDragging ? "opacity-40 scale-95" : "hover:scale-[1.02] hover:shadow-xl hover:shadow-[#D4AF37]/5"
      )}
      onClick={() => !isDragging && onAdd(figure.name)}
    >
      <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center group-hover/item:bg-[#D4AF37]/10 transition-all border border-white/5">
        <img 
          src={danceType === 'latin' ? "/images/latin-icon.gif" : "/images/standard-icon.gif"} 
          alt="Figure icon" 
          className="w-full h-full object-cover opacity-80 group-hover/item:opacity-100 transition-opacity"
          style={{ 
            filter: 'invert(1) sepia(1) saturate(5) hue-rotate(-15deg) brightness(1.1)',
            mixBlendMode: 'screen' 
          }}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-bold text-xs text-white/80 leading-snug group-hover/item:text-white transition-colors truncate">{figure.name}</p>
        <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.1em]">{figure.category || 'Core'}</p>
      </div>
      <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-white/20 text-sm">drag_indicator</span>
      </div>
    </div>
  );
}
