'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { FigureCard } from '@/components/editor/FigureCard';
import { PREDEFINED_FIGURES } from '@/lib/figures';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { supabase } from '@/lib/supabase';
import { clsx } from 'clsx';

export default function WorkspacePage({ params }) {
  const [lineup, setLineup] = useState(null);
  const [figures, setFigures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // For school project, if no ID exists, we mock one
    async function fetchData() {
      // In a real app, we would fetch from Supabase
      // const { data } = await supabase.from('lineups').select('*').eq('id', params.id).single();
      
      setLineup({ name: 'The Obsidian Arc', type: 'standard' });
      setFigures([
        { id: '1', name: 'Follow-way', category: 'Transition Move', type: 'transition' },
        { id: '2', name: 'Six Step', category: 'Core Power', type: 'transition' },
        { id: '3', name: 'Natural Spin', category: 'Advanced Spin', type: 'spin' },
      ]);
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFigures((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-primary font-headline animate-pulse">LOADING STAGE...</div>;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body antialiased overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col px-12 pt-28 pb-10 gap-8 overflow-hidden">
        {/* Header Actions */}
        <div className="flex justify-between items-end shrink-0">
          <div className="space-y-1">
            <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] opacity-80 font-label">Editor Mode</span>
            <h1 className="text-3xl font-black tracking-tight text-white font-headline uppercase leading-none">Lineup Editing Workspace</h1>
          </div>
          <Button variant="primary" size="md">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Create Lineup
          </Button>
        </div>

        {/* Central Workspace */}
        <div className="flex-1 flex gap-8 overflow-hidden">
          {/* Figures Sidebar (Left) */}
          <aside className="w-80 glass-effect rounded-2xl p-6 flex flex-col gap-6 border border-white/5 bg-white/[0.02]">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-white/90 uppercase tracking-widest font-headline">Figures Library</h3>
              <span className="material-symbols-outlined text-white/30 text-lg cursor-pointer hover:text-primary transition-colors">filter_list</span>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {PREDEFINED_FIGURES.standard.map((fig) => (
                <div key={fig.id} className="bg-white/[0.03] p-4 rounded-xl cursor-grab flex items-center gap-4 hover:bg-white/[0.06] border border-white/5 transition-all group">
                  <span className="material-symbols-outlined text-primary/40 text-lg group-hover:text-primary transition-colors">drag_indicator</span>
                  <div>
                    <p className="font-bold text-sm text-white/90 font-headline uppercase">{fig.name}</p>
                    <p className="text-[10px] text-white/40 font-medium font-label">{fig.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Lineup Sequence Area */}
          <section className="flex-1 glass-effect rounded-2xl relative overflow-hidden flex flex-col border border-white/5 bg-white/[0.01]">
            <div className="p-5 flex justify-between items-center border-b border-white/5 bg-white/5 backdrop-blur-md shrink-0">
              <h3 className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em] font-headline">Sequence: {lineup.name}</h3>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2.5 bg-black/40 rounded-full px-4 py-1.5 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]"></span>
                  <span className="text-[10px] font-bold text-white/60 tracking-wider">02:45.00</span>
                </div>
              </div>
            </div>

            {/* Sequence Draggable Canvas */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center py-10 relative">
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={(e) => setActiveId(e.active.id)}
              >
                <div className="flex items-center gap-14 min-w-max px-12 h-64">
                  <SortableContext 
                    items={figures.map(f => f.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {figures.map((fig, index) => (
                      <div key={fig.id} className="flex items-center gap-14">
                        <FigureCard 
                          figure={fig} 
                          pos={index + 1} 
                          active={activeId === fig.id}
                        />
                        {index < figures.length - 1 && (
                          <div className="flex flex-col items-center gap-3 shrink-0">
                            <div className="w-12 h-px bg-gradient-to-r from-primary/60 to-white/10"></div>
                            <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold font-label">Transition</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </SortableContext>

                  <Button variant="outline" className="w-52 h-64 border-2 border-dashed flex-col gap-4">
                    <span className="material-symbols-outlined text-lg">add</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-inherit">Drop Figure</span>
                  </Button>
                </div>
              </DndContext>
            </div>

            {/* Footer Toolbar */}
            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-between items-center shrink-0 backdrop-blur-xl">
              <div className="flex items-center gap-8">
                <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">undo</span>
                  Undo
                </button>
                <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">redo</span>
                  Redo
                </button>
              </div>

              {/* Playback */}
              <div className="flex items-center gap-3 bg-black/60 rounded-full p-1.5 border border-white/10 shadow-2xl">
                <button className="w-11 h-11 rounded-full flex items-center justify-center bg-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  <span className="material-symbols-outlined text-2xl font-fill">play_arrow</span>
                </button>
                <button className="w-11 h-11 rounded-full flex items-center justify-center text-white/40 hover:bg-white/5 transition-all">
                  <span className="material-symbols-outlined text-2xl">stop</span>
                </button>
                <div className="h-6 w-px bg-white/10 mx-2"></div>
                <span className="text-[11px] font-bold px-4 text-white/60 tracking-[0.2em] font-label">00:14 / 02:45</span>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm">Save Draft</Button>
                <Button variant="primary" size="sm" className="px-8">Publish</Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Visual Accents */}
      <div className="fixed -bottom-20 -right-20 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
    </div>
  );
}
