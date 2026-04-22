'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  DndContext, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  useDroppable,
  pointerWithin
} from '@dnd-kit/core';
import { FigureCard, FigureCardView } from './FigureCard';
import { VaultFigure } from './VaultFigure';
import { lineupService } from '@/lib/lineup-service';
import { DANCES } from '@/lib/dance-data';
import { clsx } from 'clsx';
import { toPng } from 'html-to-image';

const GRID_SIZE = 40;
const CARD_W = 128; 
const CARD_H = 160;
const TILE_W = 3; 
const TILE_H = 4; 
const TILE_X_GAP = 200; 
const TILE_Y_GAP = 240; 

function SequenceConnections({ lineup, danceType }) {
  if (lineup.length < 2) return null;
  const isStandard = danceType === 'standard';
  const color = isStandard ? '#D4AF37' : '#ef4444'; 

  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-0">
      <defs>
        <marker
          id={`arrowhead-${danceType}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={color} />
        </marker>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {lineup.map((fig, idx) => {
        if (idx === 0) return null;
        const prev = lineup[idx - 1];
        
        const px = prev.x || 0;
        const py = prev.y || 0;
        const fx = fig.x || 0;
        const fy = fig.y || 0;

        const dx = fx - px;
        const dy = fy - py;
        
        let x1, y1, x2, y2, cp1x, cp1y, cp2x, cp2y;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) { 
            x1 = px + CARD_W; y1 = py + CARD_H/2;
            x2 = fx; y2 = fy + CARD_H/2;
          } else { 
            x1 = px; y1 = py + CARD_H/2;
            x2 = fx + CARD_W; y2 = fy + CARD_H/2;
          }
          const offset = Math.max(Math.abs(x2 - x1) * 0.4, 50);
          cp1x = x1 + (dx > 0 ? offset : -offset);
          cp1y = y1;
          cp2x = x2 + (dx > 0 ? -offset : offset);
          cp2y = y2;
        } else {
          if (dy > 0) { 
            x1 = px + CARD_W/2; y1 = py + CARD_H;
            x2 = fx + CARD_W/2; y2 = fy;
          } else { 
            x1 = px + CARD_W/2; y1 = py;
            x2 = fx + CARD_W/2; y2 = fy + CARD_H;
          }
          const offset = Math.max(Math.abs(y2 - y1) * 0.4, 50);
          cp1x = x1;
          cp1y = y1 + (dy > 0 ? offset : -offset);
          cp2x = x2;
          cp2y = y2 + (dy > 0 ? -offset : offset);
        }

        const pathData = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;

        return (
          <g key={`path-${prev.id}-${fig.id}`}>
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.2"
              filter="url(#glow)"
            />
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="1"
              markerEnd={`url(#arrowhead-${danceType})`}
              opacity="0.5"
            />
          </g>
        );
      })}
    </svg>
  );
}

function isAreaOccupied(x, y, others, excludeId = null) {
  const targetXStart = Math.round(x / GRID_SIZE);
  const targetYStart = Math.round(y / GRID_SIZE);
  const targetXEnd = targetXStart + TILE_W;
  const targetYEnd = targetYStart + TILE_H;

  return others.some(fig => {
    if (fig.id === excludeId || fig.id?.toString().startsWith('temp-')) return false;
    const fx = Math.round((fig.x || 100) / GRID_SIZE);
    const fy = Math.round((fig.y || 100) / GRID_SIZE);
    const fxEnd = fx + TILE_W;
    const fyEnd = fy + TILE_H;
    
    return !(
      targetXEnd <= fx || 
      targetXStart >= fxEnd || 
      targetYEnd <= fy || 
      targetYStart >= fyEnd
    );
  });
}

function findNearestFreeTileBlock(lineup, startX = 100, startY = 100) {
  let x = Math.round(startX / GRID_SIZE) * GRID_SIZE;
  let y = Math.round(startY / GRID_SIZE) * GRID_SIZE;
  
  let steps = 0;
  while (isAreaOccupied(x, y, lineup)) {
    x += GRID_SIZE;
    if (x > 1800) {
       x = 100;
       y += GRID_SIZE;
    }
    steps++;
    if (steps > 2000) break; 
  }
  return { x, y };
}

function CanvasContainer({ 
  children, 
  isOver, 
  activeFigure, 
  onSave, 
  onCreate, 
  onExport,
  isSaving = false,
  stats = { count: 0, estTime: 0 }, 
  isCinematic = false, 
  setIsCinematic = () => {}, 
  viewport = { x: 0, y: 0, scale: 1 },
  onReset = () => {},
  onZoom = () => {}
}) {
  const { setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  return (
    <section 
      ref={setNodeRef}
      className={clsx(
        "flex-1 glass-panel rounded-[1.5rem] relative overflow-hidden flex flex-col border-2 transition-all duration-300 shadow-2xl h-full min-h-0",
        isOver ? "border-[#D4AF37] bg-[#D4AF37]/5 scale-[0.99]" : "border-white/5 bg-transparent",
        activeFigure && !isOver ? "border-dashed border-[#D4AF37]/30" : ""
      )}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: '0 0'
        }}
      ></div>
      
      <div className="p-4 pr-6 flex justify-between items-center bg-[#0e0e0e]/40 backdrop-blur-md relative z-10 border-b border-white/5 shrink-0">
        <h3 className={clsx(
          "text-[9px] font-black uppercase tracking-[0.4em] transition-colors",
          isOver ? "text-[#D4AF37]" : "text-white/40"
        )}>
          {isOver ? 'Drop to Add Figure' : 'Sequence Canvas'}
        </h3>
        <div className="flex gap-4 items-center">
          <div className="flex gap-4 px-4 border-r border-white/5 mr-2">
            <div className="flex flex-col items-end">
              <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Figures</span>
              <span className="text-[10px] font-bold text-primary italic">{stats.count}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Total Time</span>
              <span className="text-[10px] font-bold text-white/60 italic">{stats.estTime}s</span>
            </div>
          </div>

          <div className="flex bg-white/5 rounded-lg border border-white/5 overflow-hidden mr-2">
            <button 
              onClick={() => onZoom(-0.1)}
              className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[14px]">remove</span>
            </button>
            <div className="flex items-center px-2 text-[9px] font-black text-primary/60 min-w-[40px] justify-center bg-[#0e0e0e]/20">
              {Math.round(viewport.scale * 100)}%
            </div>
            <button 
              onClick={() => onZoom(0.1)}
              className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/5 border-l border-white/5"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
            </button>
          </div>

          <button 
            onClick={onReset}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-white/40 hover:text-white transition-all border border-white/5 mr-2"
            title="Recenter Canvas"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
          </button>

          <button 
            onClick={() => setIsCinematic(!isCinematic)}
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all border border-white/5",
              isCinematic ? "bg-primary text-black" : "bg-white/5 text-white/40 hover:text-white"
            )}
            title="Toggle Cinematic Mode"
          >
            <span className="material-symbols-outlined text-sm">{isCinematic ? 'visibility_off' : 'visibility'}</span>
          </button>

          <div className="w-px h-4 bg-white/5 mx-1"></div>

          <button 
            onClick={onExport}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-white/40 hover:text-white transition-all border border-white/5"
            title="Download Canvas Image"
          >
            <span className="material-symbols-outlined text-sm">download</span>
          </button>
          
          <button 
            onClick={isSaving || activeFigure ? () => {} : onSave} 
            disabled={isSaving}
            className="btn-neo btn-neo-primary"
          >
            {isSaving ? 'Syncing...' : 'Save'}
          </button>
          <button 
            onClick={activeFigure ? () => {} : onCreate}
            className="btn-neo btn-neo-error"
          >
            Reset Canvas
          </button>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden bg-[#0a0a0a]/20">
         {children}
      </div>
    </section>
  );
}

export function LineupEditor({ lineupId, initialLineup = [], danceType = 'standard', danceName = 'waltz', onEditFigure, onDeleteFigure, onAddFigure, onUpdateFigures }) {
  const getType = (type) => {
    if (!type) return 'standard';
    return type.toLowerCase() === 'latin' ? 'latin' : 'standard';
  };

  const [lineup, setLineup] = useState(initialLineup);
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const prevLineupProp = useRef(initialLineup);
  
  const [activeId, setActiveId] = useState(null);
  const [activeFigure, setActiveFigure] = useState(null);
  const [isOverCanvas, setIsOverCanvas] = useState(false);
  const [isCinematic, setIsCinematic] = useState(false);
  const [toast, setToast] = useState(null);
  const [isPromptingNew, setIsPromptingNew] = useState(false);
  useEffect(() => {
    if (!activeId && initialLineup !== prevLineupProp.current) {
      setLineup(initialLineup);
      prevLineupProp.current = initialLineup;
    }
  }, [initialLineup, activeId]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleZoom = useCallback((delta, mouseX = null, mouseY = null) => {
    setViewport(prev => {
      const nextScale = Math.min(Math.max(prev.scale * Math.exp(delta), 0.25), 3);
      
      if (mouseX !== null && mouseY !== null) {
        const ratio = nextScale / prev.scale;
        return {
          scale: nextScale,
          x: mouseX - (mouseX - prev.x) * ratio,
          y: mouseY - (mouseY - prev.y) * ratio,
        };
      }
      
      return { ...prev, scale: nextScale };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (e.ctrlKey) {
        const delta = -e.deltaY * 0.005;
        handleZoom(delta, mouseX, mouseY);
      } else {
        setViewport(prev => ({
          ...prev,
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY
        }));
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleZoom]);

  const handlePanStart = (e) => {
    if (e.target.id === 'canvas-stage' || e.target.id === 'canvas-background-grid') {
      setIsPanning(true);
      setStartPanPos({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    }
  };

  const handlePanMove = (e) => {
    if (!isPanning) return;
    setViewport(prev => ({
      ...prev,
      x: e.clientX - startPanPos.x,
      y: e.clientY - startPanPos.y
    }));
  };

  const handlePanEnd = () => setIsPanning(false);

  const stats = {
    count: lineup.length,
    estTime: lineup.reduce((acc, f) => acc + (f.duration || 8), 0)
  };

  const themeClass = getType(danceType) === 'latin' ? 'theme-latin' : 'theme-standard';

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor)
  );

  const handleSaveWorkspace = async () => {
    if (!lineupId || isSaving) return;
    try {
      setIsSaving(true);
      const { error } = await lineupService.reorderFigures(lineupId, lineup);
      if (!error) {
        prevLineupProp.current = lineup;
        onUpdateFigures(lineup);
        showToast('Canvas state synchronized successfully.', 'success');
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetRoutine = async () => {
    if (!lineupId || isSaving) return;
    try {
      setIsSaving(true);
      
      const { error } = await lineupService.reorderFigures(lineupId, []);
      if (!error) {
        setLineup([]);
        prevLineupProp.current = [];
        onUpdateFigures([]);
        showToast('Canvas reset: Routine cleared and storage purged.', 'success');
        setIsPromptingNew(false);
      }
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenResetPrompt = () => {
    setIsPromptingNew(true);
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        backgroundColor: '#050505',
        filter: (node) => {
           if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
             return node.href?.includes(window.location.origin);
           }
           return true;
        },
        fontEmbedCSS: '', 
      });
      const link = document.createElement('a');
      link.download = `ellegnote-${danceName || 'routine'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleUpdateFigure = (figureId, updates) => {
    const newList = lineup.map(f => f.id === figureId ? { ...f, ...updates } : f);
    setLineup(newList);
    onUpdateFigures(newList);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveFigure(active.data.current?.figure);
  };

  const handleDragOver = (event) => {
    const { over } = event;
    setIsOverCanvas(over?.id === 'canvas-droppable');
  };

  const handleDragEnd = async (event) => {
    const { active, over, delta } = event;
    const currentActiveFigure = active.data.current?.figure;
    setActiveId(null);
    setActiveFigure(null);
    setIsOverCanvas(false);

    if (active.data.current?.type === 'vault-item' && over?.id === 'canvas-droppable') {
      const figure = currentActiveFigure;
      const lastFigure = lineup.length > 0 ? lineup[lineup.length - 1] : null;
      let startX = 100, startY = 100;
      if (lastFigure) {
        startX = (lastFigure.x || 100) + TILE_X_GAP;
        startY = (lastFigure.y || 100);
        if (startX > 1600) { startX = 100; startY += TILE_Y_GAP; }
      }
      const { x, y } = findNearestFreeTileBlock(lineup, startX, startY);
      const tempId = `temp-${Date.now()}`;
      const tempFigure = { id: tempId, figure_name: figure.name, x, y, duration: 8 };
      setLineup(prev => [...prev, tempFigure]);
      
      await onAddFigure(figure.name, x, y);
      return;
    }

    if (active.data.current?.type === 'figure-item') {
      const index = lineup.findIndex(item => item.id === active.id);
      if (index !== -1) {
        const newList = [...lineup];
        const actualDeltaX = delta.x / viewport.scale;
        const actualDeltaY = delta.y / viewport.scale;
        let finalX = Math.max(20, Math.min(4800, Math.round(((newList[index].x || 100) + actualDeltaX) / GRID_SIZE) * GRID_SIZE));
        let finalY = Math.max(20, Math.min(4800, Math.round(((newList[index].y || 100) + actualDeltaY) / GRID_SIZE) * GRID_SIZE));
        
        if (isAreaOccupied(finalX, finalY, lineup, active.id)) {
           const nextSafe = findNearestFreeTileBlock(lineup, finalX, finalY);
           finalX = nextSafe.x; finalY = nextSafe.y;
        }
        
        newList[index] = { ...newList[index], x: finalX, y: finalY };
        setLineup(newList);
        onUpdateFigures(newList);
      }
    }
  };

  const danceInfo = DANCES[getType(danceType)]?.find(d => d.name.toLowerCase() === (danceName?.toLowerCase() || ''));
  const availableFigures = danceInfo?.figures?.map(f => ({ id: f, name: f, x: 100, y: 100 })) || [];

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      autoScroll={false}
    >
      <div className={clsx("flex flex-col flex-1", themeClass)}>
        <div className="flex-1 flex gap-6 pb-12 min-h-0 relative z-10 w-full overflow-hidden">
          <section className={clsx(
            "glass-panel rounded-[1.5rem] p-5 flex flex-col gap-4 border border-white/5 h-[480px] shrink-0 shadow-2xl transition-all duration-500",
            isCinematic ? "w-0 p-0 opacity-0 border-none -translate-x-10" : "w-64"
          )}>
            {!isCinematic && (
              <>
                <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Library</h3>
                <div className="space-y-4 overflow-y-auto pr-3 py-4 custom-scrollbar flex-1 min-h-0">
                  {availableFigures.map((fig) => (
                    <VaultFigure key={fig.id} figure={fig} onAdd={onAddFigure} danceType={danceType} />
                  ))}
                </div>
              </>
            )}
          </section>

          <CanvasContainer 
            isOver={isOverCanvas} 
            activeFigure={activeFigure}
            onSave={handleSaveWorkspace}
            onCreate={handleOpenResetPrompt}
            onExport={handleExport}
            isSaving={isSaving}
            stats={stats}
            isCinematic={isCinematic}
            setIsCinematic={setIsCinematic}
            viewport={viewport}
            onZoom={handleZoom}
            onReset={() => { setViewport({ x: 0, y: 0, scale: 1 }); }}
            lineup={lineup}
            danceType={danceType}
          >
            <div 
              ref={canvasRef}
              className={clsx("flex-1 overflow-hidden relative z-10 min-h-[500px] w-full bg-[#0a0a0a]/20 touch-none", isPanning ? "cursor-grabbing" : "cursor-grab")}
              onMouseDown={handlePanStart} onMouseMove={handlePanMove} onMouseUp={handlePanEnd} onMouseLeave={handlePanEnd}
            >
              <div id="canvas-stage" className="absolute inset-0 p-8 w-[5000px] h-[5000px] transition-transform duration-75 ease-out" style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`, transformOrigin: '0 0' }}>
                <SequenceConnections lineup={lineup} danceType={danceType} />
                {lineup.map((figure, index) => (
                  <div key={figure.id} style={{ position: 'absolute', left: figure.x || 100, top: figure.y || 100, zIndex: activeId === figure.id ? 50 : 10 }}>
                    <div className={clsx("transition-opacity duration-300", activeId === figure.id ? "opacity-20" : "opacity-100")}>
                      <FigureCard 
                        figure={{ 
                          ...figure, 
                          onEdit: onEditFigure, 
                          onDelete: (id) => {
                            showToast('Sequence healed: Figure archived', 'success');
                            onDeleteFigure(id);
                          }, 
                          onUpdate: handleUpdateFigure 
                        }} 
                        pos={`P${index + 1}`}
                        active={index === 0}
                        isDraggable={true}
                        danceType={danceType}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CanvasContainer>

          {}
          {toast && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-[#0e0e0e]/90 backdrop-blur-xl border border-primary/20 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                <span className="text-[11px] font-black tracking-widest uppercase text-primary/90">
                  {toast.message}
                </span>
              </div>
            </div>
          )}

          {}
          {isPromptingNew && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#050505]/80 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-[#0e0e0e] border border-white/5 p-8 rounded-3xl max-w-sm w-full shadow-3xl text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                  <span className="material-symbols-outlined text-red-500 text-3xl">restart_alt</span>
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Reset Canvas?</h3>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-8 leading-relaxed">
                  This will permanently clear all figures on the canvas and purge associated notes and videos.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setIsPromptingNew(false)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Cancel</button>
                  <button onClick={handleResetRoutine} className="flex-1 btn-neo btn-neo-error">Reset Canvas</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DragOverlay dropAnimation={null} zIndex={1000}>
        {activeId && activeFigure ? (
          <div className="scale-[1.05] opacity-90 pointer-events-none rotate-[2deg]">
             <FigureCardView figure={{ ...activeFigure }} pos="New" active={true} danceType={danceType} />
          </div>
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}
