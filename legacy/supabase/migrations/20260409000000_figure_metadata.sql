-- Migration: Add BPM and Difficulty to lineup_figures
-- Created: 2026-04-09

ALTER TABLE public.lineup_figures 
ADD COLUMN IF NOT EXISTS bpm INTEGER DEFAULT 0;

ALTER TABLE public.lineup_figures 
ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'Bronze';
