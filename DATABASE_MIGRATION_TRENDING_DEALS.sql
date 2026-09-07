-- MarketNest: Add Trending Products and Today's Deals columns
-- Run this in Supabase SQL Editor

-- Add new columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_deal BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS deal_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS deal_ends_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_is_trending ON products(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_products_is_deal ON products(is_deal) WHERE is_deal = true;
CREATE INDEX IF NOT EXISTS idx_products_deal_ends_at ON products(deal_ends_at) WHERE deal_ends_at IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN products.is_trending IS 'Product appears in Trending Products section';
COMMENT ON COLUMN products.is_deal IS 'Product has an active deal';
COMMENT ON COLUMN products.original_price IS 'Original price before deal (for display)';
COMMENT ON COLUMN products.deal_price IS 'Discounted price when deal is active';
COMMENT ON COLUMN products.deal_ends_at IS 'Deal expiration timestamp';

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name IN ('is_trending', 'is_deal', 'original_price', 'deal_price', 'deal_ends_at')
ORDER BY column_name;
