-- Fix RLS Policies for Profiles Table
-- =====================================
-- This script fixes the Row Level Security policies to allow users to read their own profiles

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create simpler, more permissive policies for development
-- Users can read their own profile
CREATE POLICY "Enable read access for users to own profile"
    ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Enable update for users based on id"
    ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Enable read access for admins"
    ON profiles
    FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- Admins can update all profiles
CREATE POLICY "Enable update for admins"
    ON profiles
    FOR UPDATE
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- Teachers can read all profiles
CREATE POLICY "Enable read access for teachers"
    ON profiles
    FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher'
    );

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Test query to see if you can read profiles
-- Run this while logged in as a user
SELECT id, email, full_name, role FROM profiles WHERE id = auth.uid();
