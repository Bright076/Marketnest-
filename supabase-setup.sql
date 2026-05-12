-- MarketNest Authentication Setup
-- Using Supabase Auth with user_metadata (NO separate profiles table needed!)

-- This setup uses Supabase Auth's built-in user_metadata feature
-- User data (full_name, phone) is stored directly in auth.users.user_metadata

-- No additional tables or policies needed!
-- Everything is handled by Supabase Auth automatically.

-- To verify your setup:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. After signup, you'll see users with their metadata

-- Optional: Enable email confirmation
-- Go to Authentication > Settings > Email Auth
-- Toggle "Enable email confirmations" if you want users to verify their email

-- That's it! Your auth system is ready to use.
