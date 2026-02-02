-- Add grade_id column to profiles table
-- ========================================

-- Add grade_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'grade_id'
    ) THEN
        ALTER TABLE profiles ADD COLUMN grade_id INTEGER;
        COMMENT ON COLUMN profiles.grade_id IS 'Student grade/class level';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;
