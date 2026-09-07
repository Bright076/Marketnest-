-- MarketNest: Visit Tracking System
-- Run this in Supabase SQL Editor

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_page_path ON visits(page_path);

-- Add comment for documentation
COMMENT ON TABLE visits IS 'Tracks page visits for analytics';
COMMENT ON COLUMN visits.page_path IS 'URL path that was visited (e.g., /, /products, /cart)';
COMMENT ON COLUMN visits.visited_at IS 'Timestamp when the visit occurred';

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'visits'
ORDER BY ordinal_position;
