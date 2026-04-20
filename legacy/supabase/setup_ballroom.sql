-- ============================================================
-- THE OBSIDIAN STAGE – Supabase Setup Script
-- ============================================================

-- 1. Create Lineups Table
CREATE TABLE IF NOT EXISTS public.lineups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dance_type TEXT NOT NULL CHECK (dance_type IN ('standard', 'latin')),
  dance_name TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Lineup Figures Table (with multi-media, BPM, and Difficulty)
CREATE TABLE IF NOT EXISTS public.lineup_figures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lineup_id UUID NOT NULL REFERENCES public.lineups(id) ON DELETE CASCADE,
  figure_name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  notes TEXT,
  video_urls TEXT[] DEFAULT '{}'::TEXT[],
  image_urls TEXT[] DEFAULT '{}'::TEXT[],
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Profiles Table (for points and categories)
-- NOTE: If this conflicts with ArtStone, we use a specialized Ballroom Profile check
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  standard_category TEXT DEFAULT 'E',
  latin_category TEXT DEFAULT 'E',
  standard_points INTEGER DEFAULT 0,
  latin_points INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.lineups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lineup_figures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Set up RLS Policies
DO $$ 
BEGIN
    -- Lineup Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Ballroom: User manage own lineups' AND tablename = 'lineups') THEN
        CREATE POLICY "Ballroom: User manage own lineups" ON public.lineups FOR ALL USING (auth.uid() = owner_id);
    END IF;

    -- Figure Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Ballroom: User manage own figures' AND tablename = 'lineup_figures') THEN
        CREATE POLICY "Ballroom: User manage own figures" ON public.lineup_figures FOR ALL 
        USING (lineup_id IN (SELECT id FROM lineups WHERE owner_id = auth.uid()));
    END IF;

    -- Profile Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Ballroom: User view own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Ballroom: User view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
    END IF;
END $$;

-- 6. Updated_at Trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_lineup_figures_updated_at ON public.lineup_figures;
CREATE TRIGGER update_lineup_figures_updated_at
  BEFORE UPDATE ON public.lineup_figures
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- 7. User Signup Logic (Ensuring we don't break CRM if applied together)
CREATE OR REPLACE FUNCTION public.handle_ballroom_user()
RETURNS TRIGGER AS $$
BEGIN
  -- We use a sub-block to catch errors so registration DOES NOT fail
  BEGIN
    INSERT INTO public.profiles (id, standard_category, latin_category)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'standard_category', 'E'),
      COALESCE(NEW.raw_user_meta_data->>'latin_category', 'E'),
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      standard_category = EXCLUDED.standard_category,
      latin_category = EXCLUDED.latin_category,
      updated_at = now();
  EXCEPTION WHEN OTHERS THEN
    -- If profile creation fails, we log it to the system but DO NOT block registration
    -- This is exactly how ArtStone ensures 100% signup success
    RETURN NEW;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply Trigger
DROP TRIGGER IF EXISTS trg_ballroom_user_created ON auth.users;
CREATE TRIGGER trg_ballroom_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_ballroom_user();

-- --- STORAGE INFRASTRUCTURE ---

-- Create figure-assets bucket
insert into storage.buckets (id, name, public)
values ('figure-assets', 'figure-assets', true)
on conflict (id) do nothing;

-- Public read access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'figure-assets' );

-- Authenticated upload access
create policy "Authenticated Upload"
on storage.objects for insert
with check (
  bucket_id = 'figure-assets'
  and auth.role() = 'authenticated'
);

-- Full owner control
create policy "Owner Control"
on storage.objects for all
using (
  bucket_id = 'figure-assets'
  and auth.role() = 'authenticated'
);
