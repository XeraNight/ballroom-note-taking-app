'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const DanceContext = createContext();

export function DanceProvider({ children }) {
  const [danceType, setDanceType] = useState('standard'); // 'standard' or 'latin'

  // Presistence
  useEffect(() => {
    const saved = localStorage.getItem('obsidian_dance_type');
    if (saved) setDanceType(saved);
  }, []);

  const toggleDanceType = () => {
    const newType = danceType === 'standard' ? 'latin' : 'standard';
    setDanceType(newType);
    localStorage.setItem('obsidian_dance_type', newType);
  };

  const setType = (type) => {
    setDanceType(type);
    localStorage.setItem('obsidian_dance_type', type);
  };

  return (
    <DanceContext.Provider value={{ danceType, toggleDanceType, setType }}>
      {children}
    </DanceContext.Provider>
  );
}

export const useDance = () => useContext(DanceContext);
