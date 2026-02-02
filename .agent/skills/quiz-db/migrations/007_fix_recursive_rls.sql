-- 🚨 EMERGENCY FIX: Recursive RLS & profiles 500 Error
-- ====================================================

-- 1. Drop ALL potentially recursive policies on profiles
-- ------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for users to own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for admins" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for admins" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for teachers" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;


-- 2. Ensure the helper function is safe (SECURITY DEFINER)
-- --------------------------------------------------------
-- This function is safe because it bypasses RLS (Security Definer)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    -- We use a direct query to the table which bypasses RLS because of SECURITY DEFINER
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'teacher')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Create NEW Non-Recursive Policies for Profiles
-- -------------------------------------------------

-- A. Users can read their own profile (Fast, non-recursive)
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- B. Staff can read all profiles (Uses the SECURITY DEFINER function to avoid recursion)
CREATE POLICY "Staff can read all profiles"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- C. Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- D. Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
-- WAIT: "Admins can update all profiles" above is STILL recursive if it hits itself.
-- Let's use is_admin() helper similar to is_staff()

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- 4. Final Verification
-- ---------------------
-- This should now return 1 row for the current user and NO 500 error.
-- SELECT * FROM public.profiles WHERE id = auth.uid();
