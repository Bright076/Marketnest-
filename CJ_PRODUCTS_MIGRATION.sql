-- CJDropShipping Products Migration
-- Add cj_pid column to track CJ product IDs
-- Run this in Supabase SQL Editor

-- Step 1: Add cj_pid column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS cj_pid TEXT;

-- Step 2: Create unique index on cj_pid to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS products_cj_pid_unique 
ON public.products(cj_pid) 
WHERE cj_pid IS NOT NULL;

-- Step 3: Add comment
COMMENT ON COLUMN public.products.cj_pid IS 'CJDropShipping product ID (PID)';

-- Verify
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'cj_pid';
