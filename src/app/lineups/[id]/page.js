'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineupEditor } from '@/components/editor/LineupEditor';
import { EditModal } from '@/components/editor/EditModal';
import { lineupService } from '@/lib/lineup-service';

export default function WorkspacePage({ params: paramsPromise }) {
  const router = useRouter();
  const [lineup, setLineup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingFigure, setEditingFigure] = useState(null);
  const [params, setParams] = useState(null);

  useEffect(() => {
    async function resolveParams() {
      const p = await paramsPromise;
      setParams(p);
    }
    resolveParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (!params?.id) return;
    
    async function fetchData() {
      const { data, error } = await lineupService.getLineupDetail(params.id);
      if (error || !data) {
        console.error("LOAD FAIL:", error);
      } else {
        setLineup(data);
      }
      setLoading(false);
    }
    fetchData();
  }, [params?.id]);

  const handleEditFigure = (figure) => {
    setEditingFigure(figure);
  };

  const handleSaveFigure = async (updatedFigure) => {
    try {
      const { error } = await lineupService.updateFigure(params.id, updatedFigure.id, {
        notes: updatedFigure.notes,
        video_urls: updatedFigure.video_urls,
        image_urls: updatedFigure.image_urls,
        duration: updatedFigure.duration
      });
      
      if (error) throw error;

      setEditingFigure(null);
      const { data, error: fetchError } = await lineupService.getLineupDetail(params.id);
      if (fetchError) throw fetchError;
      if (data) setLineup(data);
    } catch (err) {
      console.error('Error saving figure:', err.message);
      console.error(`Conflict in EllegNote: ${err.message}`);
    }
  };

  const handleAddFigure = async (figureName, x = 100, y = 100) => {
    try {
      const { data, error } = await lineupService.addFigure(params.id, figureName, x, y);
      if (error) throw error;
      setLineup(prev => ({
        ...prev,
        figures: [...(prev.figures || []), data]
      }));
    } catch (err) {
      console.error('Error adding figure:', err.message);
    }
  };

  const handleUpdateFigures = (newFigures) => {
    setLineup(prev => ({
      ...prev,
      figures: newFigures
    }));
    lineupService.reorderFigures(params.id, newFigures).catch(err => {
      console.error('Coordinate sync failed:', err);
    });
  };

  const handleDeleteFigure = async (figureId) => {
    try {
      setLineup(prev => {
        const remainingFigures = prev.figures.filter(f => f.id !== figureId);
        lineupService.reorderFigures(params.id, remainingFigures).catch(err => {
           console.error('Background sync failed:', err);
        });

        return {
          ...prev,
          figures: remainingFigures
        };
      });

      setEditingFigure(null);
    } catch (err) {
      console.error('Error healing sequence:', err.message);
      console.error(`Healing failed: ${err.message}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-8">
      <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin"></div>
      <div className="text-[#D4AF37] font-black tracking-[0.5em] text-[10px] animate-pulse uppercase">Initializing EllegNote</div>
    </div>
  );

  return (
    <div className="bg-background text-on-surface antialiased overflow-hidden h-full relative">
            <main className="pt-8 pb-8 px-12 h-full flex flex-col gap-6 ellegance-bg overflow-hidden relative">
        <header className="flex justify-between items-end relative z-10 shrink-0">
          <div className="max-w-2xl">
            <p className="text-[#D4AF37] font-black tracking-[0.4em] mb-2 text-[8px] uppercase">
              {lineup?.dance_type === 'standard' ? 'Standard Excellence' : 'Latin Artist'} • {lineup?.dance_name}
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase font-headline italic leading-none">
              {lineup?.name || 'Loading Routine...'}
            </h1>
          </div>
        </header>

        <section className="flex-1 min-h-0 relative z-10 overflow-hidden">
          <LineupEditor 
            lineupId={lineup?.id}
            initialLineup={lineup?.figures || []}
            danceType={lineup?.dance_type || 'standard'}
            danceName={lineup?.dance_name || ''}
            onEditFigure={handleEditFigure}
            onDeleteFigure={handleDeleteFigure}
            onAddFigure={handleAddFigure}
            onUpdateFigures={handleUpdateFigures}
          />
        </section>
      </main>

      <EditModal 
        isOpen={!!editingFigure}
        figure={editingFigure}
        onClose={() => setEditingFigure(null)}
        onSave={handleSaveFigure}
        onDelete={handleDeleteFigure}
      />

            <div className="fixed -bottom-20 -right-20 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed top-1/4 -left-20 w-[600px] h-[600px] bg-[#D4AF37]/3 blur-[120px] rounded-full pointer-events-none z-0"></div>
    </div>
  );
}
