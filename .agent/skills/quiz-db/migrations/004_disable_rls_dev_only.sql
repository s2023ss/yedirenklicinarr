-- TEMPORARY: Disable RLS for Development
-- =========================================
-- WARNING: This is only for development! 
-- DO NOT use this in production!

-- Disable RLS on profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Test query
SELECT id, email, full_name, role FROM profiles;
