-- Comprehensive RLS Policies & Schema Fixes
-- ==========================================

-- 1. Schema Updates: Add Audit Columns
-- ------------------------------------

-- Add user_id to submissions if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'user_id') THEN
        ALTER TABLE public.submissions ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Add created_by to quizzes if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quizzes' AND column_name = 'created_by') THEN
        ALTER TABLE public.quizzes ADD COLUMN created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid();
    END IF;
END $$;

-- Add created_by to questions if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'created_by') THEN
        ALTER TABLE public.questions ADD COLUMN created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid();
    END IF;
END $$;


-- 2. Enable RLS on all tables
-- --------------------------
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;


-- 3. Academic Structure Policies (grades, courses, units, topics, learning_outcomes)
-- ---------------------------------------------------------------------------------

-- Helper Function to check if user is admin or teacher
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role IN ('admin', 'teacher')
        FROM public.profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Everyone authenticated can read
DROP POLICY IF EXISTS "Enable read access for profiles" ON public.profiles; -- Fixed from previous migrations if exists
DROP POLICY IF EXISTS "Public read access for profiles" ON public.grades;
CREATE POLICY "Public read access for authenticated" ON public.grades FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Staff manage grades" ON public.grades;
CREATE POLICY "Staff manage grades" ON public.grades FOR ALL TO authenticated USING (public.is_staff());

-- Repeat for others
DROP POLICY IF EXISTS "Public read access" ON public.courses;
DROP POLICY IF EXISTS "Public read access for authenticated" ON public.courses;
CREATE POLICY "Public read access for authenticated" ON public.courses FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Staff manage courses" ON public.courses;
CREATE POLICY "Staff manage courses" ON public.courses FOR ALL TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "Public read access" ON public.units;
DROP POLICY IF EXISTS "Public read access for authenticated" ON public.units;
CREATE POLICY "Public read access for authenticated" ON public.units FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Staff manage units" ON public.units;
CREATE POLICY "Staff manage units" ON public.units FOR ALL TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "Public read access" ON public.topics;
DROP POLICY IF EXISTS "Public read access for authenticated" ON public.topics;
CREATE POLICY "Public read access for authenticated" ON public.topics FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Staff manage topics" ON public.topics;
CREATE POLICY "Staff manage topics" ON public.topics FOR ALL TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "Public read access" ON public.learning_outcomes;
DROP POLICY IF EXISTS "Public read access for authenticated" ON public.learning_outcomes;
CREATE POLICY "Public read access for authenticated" ON public.learning_outcomes FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Staff manage outcomes" ON public.learning_outcomes;
CREATE POLICY "Staff manage outcomes" ON public.learning_outcomes FOR ALL TO authenticated USING (public.is_staff());


-- 4. Quiz System Policies
-- -----------------------

DROP POLICY IF EXISTS "Public read quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Teacher manage quizzes" ON public.quizzes;
CREATE POLICY "Public read quizzes" ON public.quizzes FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Staff manage quizzes" ON public.quizzes;
CREATE POLICY "Staff manage quizzes" ON public.quizzes FOR ALL TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "Public read questions" ON public.questions;
DROP POLICY IF EXISTS "Teacher manage questions" ON public.questions;
CREATE POLICY "Public read questions" ON public.questions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Staff manage questions" ON public.questions;
CREATE POLICY "Staff manage questions" ON public.questions FOR ALL TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "Public read options" ON public.options;
DROP POLICY IF EXISTS "Teacher manage options" ON public.options;
CREATE POLICY "Public read options" ON public.options FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Staff manage options" ON public.options;
CREATE POLICY "Staff manage options" ON public.options FOR ALL TO authenticated USING (public.is_staff());


-- 5. Submissions Policies
-- -----------------------

DROP POLICY IF EXISTS "Users read own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Students read own submissions" ON public.submissions;
CREATE POLICY "Users read own submissions" ON public.submissions FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff());

DROP POLICY IF EXISTS "Users insert own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Students insert own submissions" ON public.submissions;
CREATE POLICY "Users insert own submissions" ON public.submissions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
