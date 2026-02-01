-- 1. Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. RBAC Roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
    END IF;
END $$;

-- 3. Profiles (Extends Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'student',
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Academic Structure Hierarchy
CREATE TABLE IF NOT EXISTS public.grades (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL, -- e.g., '12. Sınıf'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.courses (
    id SERIAL PRIMARY KEY,
    grade_id INTEGER REFERENCES public.grades(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'MATEMATİK'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.units (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'SAYILAR VE CEBİR'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.topics (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES public.units(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'Denklem ve Eşitsizlikler'
    base_content TEXT, -- Base material for AI to generate contextual summaries
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_outcomes (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES public.topics(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE, -- e.g., 'TD.12.1.1.1.'
    description TEXT NOT NULL, -- e.g., 'Üslü ve köklü ifadeler içeren denklemler çözer.'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Question Bank
CREATE TABLE IF NOT EXISTS public.questions (
    id SERIAL PRIMARY KEY,
    learning_outcome_id INTEGER REFERENCES public.learning_outcomes(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES public.questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tests & Submissions
CREATE TABLE IF NOT EXISTS public.tests (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.test_questions (
    test_id INTEGER REFERENCES public.tests(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES public.questions(id) ON DELETE CASCADE,
    PRIMARY KEY (test_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.submissions (
    id SERIAL PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    test_id INTEGER REFERENCES public.tests(id) ON DELETE CASCADE,
    score INTEGER,
    answers JSONB, -- Store student answers for analysis
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Gamification
CREATE TABLE IF NOT EXISTS public.achievements (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_achievements (
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (student_id, achievement_id)
);

-- 8. Row Level Security (RLS) Basic Rules
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;

-- 9. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
