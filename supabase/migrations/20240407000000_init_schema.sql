-- Ballroom Note-Taking App Database Schema
-- Created: 2026-04-07

-- ENTITY 1: Lineups (Core group of figures)
CREATE TABLE IF NOT EXISTS lineups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dance_type TEXT NOT NULL CHECK (dance_type IN ('standard', 'latin')),
  dance_name TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY 2: Lineup Figures (Individual steps in the sequence)
CREATE TABLE IF NOT EXISTS lineup_figures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lineup_id UUID NOT NULL REFERENCES lineups(id) ON DELETE CASCADE,
  figure_name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  notes TEXT,
  video_url TEXT,
  image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE lineups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lineup_figures ENABLE ROW LEVEL SECURITY;

-- Policies for Lineups
CREATE POLICY "Users can create their own lineups" ON lineups
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can view their own lineups" ON lineups
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can update their own lineups" ON lineups
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own lineups" ON lineups
  FOR DELETE USING (auth.uid() = owner_id);

-- Policies for Lineup Figures
CREATE POLICY "Users can manage figures in their own lineups" ON lineup_figures
  FOR ALL USING (
    lineup_id IN (SELECT id FROM lineups WHERE owner_id = auth.uid())
  );

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lineup_figures_updated_at
  BEFORE UPDATE ON lineup_figures
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();
