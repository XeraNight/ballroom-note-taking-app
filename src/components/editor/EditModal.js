'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

export function EditModal({ isOpen, onClose, figure, onSave, onDelete }) {
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(8);
  const [videoUrls, setVideoUrls] = useState(['', '', '']);
  const [imageUrls, setImageUrls] = useState(['', '']);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (figure) {
      setNotes(figure.notes || '');
      setDuration(figure.duration || 8);
      const v = [...(figure.video_urls || [])];
      while (v.length < 3) v.push('');
      setVideoUrls(v);

      const img = [...(figure.image_urls || [])];
      while (img.length < 2) img.push('');
      setImageUrls(img);
      setErrorStatus(null);
      setIsConfirmingDelete(false);
    }
  }, [figure]);

  const handleUpload = async (e, type, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorStatus(null);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const { publicUrl } = await response.json();

      if (type === 'video') {
        const newUrls = [...videoUrls];
        newUrls[index] = publicUrl;
        setVideoUrls(newUrls);
      } else {
        const newUrls = [...imageUrls];
        newUrls[index] = publicUrl;
        setImageUrls(newUrls);
      }
    } catch (error) {
      setErrorStatus(`Transfer Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave({
        ...figure,
        notes,
        duration: parseInt(duration) || 8,
        video_urls: videoUrls.filter(u => u !== ''),
        image_urls: imageUrls.filter(u => u !== '')
      });
    } catch (err) {
      setErrorStatus('Synchronization Failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    try {
      setIsSaving(true);
      await onDelete(figure.id);
    } catch (err) {
      setErrorStatus('Removal Failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={clsx(
      "fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10",
      "bg-black/60 backdrop-blur-sm overflow-hidden animate-in fade-in duration-300"
    )}>
      <div className="w-full h-full max-w-[1600px] glass-modal rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row relative">
        
        <div className="flex-1 flex flex-col min-h-0 bg-transparent overflow-hidden">
          <header className="h-28 flex items-center justify-between px-10 border-b border-white/5 shrink-0">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-label font-bold uppercase tracking-[0.25em] text-primary/80 mb-1">Figure Editing</span>
                <h1 className="text-3xl font-headline font-bold tracking-tight text-white italic uppercase">{figure?.figure_name}</h1>
              </div>
              {errorStatus && (
                <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                  {errorStatus}
                </div>
              )}
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-full font-label font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-widest font-black"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={uploading || isSaving}
                className={clsx(
                  "btn-neo",
                  (uploading || isSaving) ? "opacity-50 cursor-not-allowed" : "btn-neo-primary"
                )}
              >
                {isSaving ? 'Syncing...' : (uploading ? 'Uploading...' : 'Save Changes')}
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-12 lg:col-span-8 space-y-10">
                <section className="relative group">
                  <div className="w-full aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/10 shadow-2xl relative">
                    {videoUrls[0] ? (
                      <video src={videoUrls[0]} className="w-full h-full object-cover" controls />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/10 bg-white/5">
                        <span className="material-symbols-outlined text-6xl">videocam</span>
                        <label className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-all">
                          Upload Primary Sequence
                          <input type="file" className="hidden" accept="video/*" onChange={(e) => handleUpload(e, 'video', 0)} />
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex justify-between items-center px-2">
                    <h3 className="font-headline font-semibold text-xl text-white/90 uppercase tracking-tight italic">Primary Sequence: Kinetic Flow</h3>
                    {videoUrls[0] && (
                      <label className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-xl">file_upload</span>
                        <input type="file" className="hidden" accept="video/*" onChange={(e) => handleUpload(e, 'video', 0)} />
                      </label>
                    )}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2].map(idx => (
                    <div key={idx} className="space-y-4">
                      <div className="aspect-video rounded-[1.5rem] overflow-hidden bg-white/5 border border-white/10 relative group">
                        {videoUrls[idx] ? (
                          <video src={videoUrls[idx]} className="w-full h-full object-cover" controls />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/10">
                            <span className="material-symbols-outlined text-3xl">videocam</span>
                            <label className="text-[8px] font-bold uppercase tracking-widest cursor-pointer hover:text-white/40">
                              Upload Alt Angle {idx === 1 ? 'A' : 'B'}
                              <input type="file" className="hidden" accept="video/*" onChange={(e) => handleUpload(e, 'video', idx)} />
                            </label>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 glass-panel px-4 py-1.5 rounded-full text-[9px] font-bold text-primary uppercase tracking-[0.15em] backdrop-blur-md">
                          Alt Angle {idx === 1 ? 'A' : 'B'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 space-y-10">
                <section className="glass-panel p-8 rounded-[2rem] flex flex-col h-[350px]">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>notes</span>
                    <h2 className="font-headline font-bold text-xl tracking-tight uppercase italic">Curator Notes</h2>
                  </div>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="flex-1 w-full bg-white/5 border border-white/5 rounded-2xl p-5 font-body text-sm text-white/70 focus:ring-1 focus:ring-primary/40 focus:bg-white/10 outline-none placeholder:text-white/20 resize-none transition-all" 
                    placeholder="Enter technical feedback or choreographic adjustments..."
                  />
                </section>

                <section className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="font-headline font-bold text-xl tracking-tight uppercase italic">Stills & Mood</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    {[0, 1].map(idx => (
                      <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        {imageUrls[idx] ? (
                          <img src={imageUrls[idx]} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt="Still" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white/10">
                            <label className="cursor-pointer hover:text-white/20">
                              <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'image', idx)} />
                            </label>
                          </div>
                        )}
                        {imageUrls[idx] && (
                           <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 cursor-pointer">
                              <span className="material-symbols-outlined text-white text-lg">edit</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'image', idx)} />
                           </label>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.03] backdrop-blur-md space-y-6">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em]">Technical Specs</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right text-xs text-primary font-black outline-none focus:border-primary/50"
                        />
                        <span className="text-[8px] text-white/20 font-black uppercase">Seconds</span>
                      </div>
                    </div>
                  </div>
                  {isConfirmingDelete ? (
                    <div className="flex gap-3 mt-4 animate-in fade-in zoom-in-95 duration-200">
                      <button 
                        onClick={handleDelete}
                        disabled={isSaving}
                        className="flex-1 btn-neo btn-neo-error italic"
                      >
                        {isSaving ? 'REMOVING...' : 'CONFIRM REMOVAL'}
                      </button>
                      <button 
                        onClick={() => setIsConfirmingDelete(false)}
                        className="px-6 py-4 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] transition-all"
                      >
                        BACK
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleDelete}
                      disabled={isSaving}
                      className="w-full btn-neo btn-neo-error opacity-40 hover:opacity-100 italic"
                    >
                      REMOVE FROM LINEUP
                    </button>
                  )}
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
