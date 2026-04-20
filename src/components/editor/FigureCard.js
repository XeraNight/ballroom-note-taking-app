'use client';

import { useDraggable } from '@dnd-kit/core';
import { clsx } from 'clsx';

/**
 * FigureCardView - A pure visual representation of a figure card with optimized layout and working click areas.
 */
export function FigureCardView({ 
  figure, 
  active, 
  pos, 
  listeners, 
  attributes, 
  innerRef,
  isDraggable = false,
  style = {},
  danceType = 'standard'
}) {
  const handleDurationClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // CRITICAL: Stop event from bubbling to the edit overlay
    const current = figure.duration || 8;
    const val = prompt(`Enter duration (seconds/beats) for ${figure.figure_name || figure.name}:`, current);
    if (val !== null) {
      const num = parseInt(val);
      if (!isNaN(num) && num > 0) {
        if (figure.onUpdate) figure.onUpdate(figure.id, { duration: num });
      }
    }
  };

  return (
    <div 
      ref={innerRef} 
      {...attributes} 
      style={style}
      className={clsx("relative group shrink-0", active ? "z-40" : "z-10")}
    >
      <div 
        className={clsx(
        "w-32 h-40 rounded-xl p-3 flex flex-col justify-between shadow-2xl transition-all duration-500 overflow-hidden relative group/card border",
        active 
          ? "active-glass-card scale-105 border-[#D4AF37]/30" 
          : "glass-card opacity-80 hover:opacity-100 hover:scale-[1.01] border-white/5"
      )}>
        
        {/* EDIT OVERLAY - Now at z-10 to be behind interactive buttons but over background */}
        <div 
           onClick={() => figure.onEdit && figure.onEdit(figure)}
           className="absolute inset-0 z-10 cursor-pointer"
        ></div>

        {/* TOP INTERACTORS (Badge / Actions) - High Z-index */}
        <div className="absolute top-2 right-2 flex gap-1 z-50">
          <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-all translate-x-2 group-hover/card:translate-x-0">
             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const confirmed = window.confirm(`Are you sure you want to delete "${figure.figure_name || figure.name}"? This will also remove its notes and videos.`);
                  if (confirmed && figure.onDelete) {
                    figure.onDelete(figure.id);
                  }
                }}
                className="w-5 h-5 rounded-md bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-red-500/40 hover:text-red-400 transition-all border border-white/10"
                title="Delete Figure"
              >
                <span className="material-symbols-outlined text-[10px]">close</span>
              </button>
              
              {isDraggable && (
                <div 
                  {...listeners}
                  className="w-5 h-5 rounded-md bg-black/40 backdrop-blur-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-primary/20 transition-all border border-white/10"
                  title="Move Figure"
                >
                  <span className="material-symbols-outlined text-white/40 group-hover/card:text-primary text-[10px]">drag_indicator</span>
                </div>
              )}
          </div>
          
          <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 group-hover/card:opacity-0 transition-opacity">
            <span className={clsx(
              "text-[8px] font-black tracking-[0.1em] transition-colors",
              active ? "text-[#D4AF37]" : "text-white/40"
            )}>
              {pos}
            </span>
          </div>
        </div>

        {/* TOP ROW: Visual Icon */}
        <div className="flex justify-between items-start relative z-20 pointer-events-none">
          <div className={clsx(
            "w-5 h-5 rounded-md overflow-hidden flex items-center justify-center transition-colors",
            active ? "bg-[#D4AF37]/20" : "bg-white/5"
          )}>
            <img 
              src={danceType === 'latin' ? "/images/latin-icon.gif" : "/images/standard-icon.gif"} 
              alt="Type icon" 
              className={clsx(
                "w-full h-full object-cover transition-all",
                active ? "opacity-100 scale-110" : "opacity-30 group-hover/card:opacity-60"
              )}
              style={{ filter: 'invert(1) sepia(1) saturate(5) hue-rotate(-15deg)', mixBlendMode: 'screen' }}
            />
          </div>
        </div>

        {/* MIDDLE: Name & Category */}
        <div className="space-y-0.5 relative z-20 pointer-events-none">
          <p className={clsx(
            "font-bold text-xs leading-tight uppercase font-headline transition-colors line-clamp-2",
            active ? "text-white" : "text-white/80 group-hover/card:text-white"
          )}>
            {(typeof (figure.figure_name || figure.name) === 'object') 
              ? (figure.figure_name?.name || figure.name?.name || 'Unknown Move')
              : (figure.figure_name || figure.name)}
          </p>
          <p className="text-[6px] text-white/30 uppercase tracking-[0.1em] font-medium">
            {figure.category || 'Core Figure'}
          </p>
        </div>

        {/* BOTTOM: Progress & Timing (Z-50 to ensure clickability) */}
        <div className="space-y-1.5 relative z-50">
          <div className="flex justify-end pr-0.5">
            <button 
                onClick={handleDurationClick}
                className="text-[6px] font-black text-white/20 hover:text-primary transition-all bg-black/40 backdrop-blur-md py-0.5 px-2 rounded-full border border-white/10 z-50 uppercase tracking-widest"
              >
                {figure.duration || 8}s
            </button>
          </div>
          <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={clsx(
                "h-full transition-all duration-700",
                active ? "bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.5)] w-full" : "bg-white/10 w-1/4 group-hover/card:w-1/2 group-hover/card:bg-white/30"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * FigureCard - The draggable wrapper for the figure card.
 */
export function FigureCard({ figure, active, pos, isDraggable = true, danceType = 'standard' }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({ 
    id: figure.id,
    data: {
      type: 'figure-item',
      id: figure.id,
      figure: figure
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50
  } : undefined;

  return (
    <FigureCardView
      figure={figure}
      active={active}
      pos={pos}
      listeners={listeners}
      attributes={attributes}
      innerRef={setNodeRef}
      isDraggable={isDraggable}
      style={style}
      danceType={danceType}
    />
  );
}
