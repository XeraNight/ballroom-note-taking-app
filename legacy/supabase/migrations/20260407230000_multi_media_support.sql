-- Migration: Support multiple media URLs in lineup_figures
-- Created: 2026-04-07

-- 1. Backup existing single URL columns (if any data exists, it should be migrated, 
-- but in this dev phase it's likely fresh).
ALTER TABLE public.lineup_figures 
RENAME COLUMN video_url TO video_url_legacy;

ALTER TABLE public.lineup_figures 
RENAME COLUMN image_url TO image_url_legacy;

-- 2. Add new array columns
ALTER TABLE public.lineup_figures 
ADD COLUMN video_urls TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN image_urls TEXT[] DEFAULT '{}'::TEXT[];

-- 3. (Optional) Migrate data if needed
-- UPDATE public.lineup_figures SET video_urls = ARRAY[video_url_legacy] WHERE video_url_legacy IS NOT NULL;
-- UPDATE public.lineup_figures SET image_urls = ARRAY[image_url_legacy] WHERE image_url_legacy IS NOT NULL;

-- 4. Drop legacy columns
ALTER TABLE public.lineup_figures 
DROP COLUMN video_url_legacy,
DROP COLUMN image_url_legacy;
