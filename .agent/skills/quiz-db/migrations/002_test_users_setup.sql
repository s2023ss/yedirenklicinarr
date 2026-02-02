-- Test Users Setup Instructions
-- ================================
-- This file contains instructions for creating test users in Supabase

-- IMPORTANT: You need to create these users via Supabase Dashboard first!
-- Go to: Authentication > Users > Add User (via email)

-- Test User Credentials:
-- ----------------------
-- 1. Admin User
--    Email: admin@yedirenklicinar.com
--    Password: Password123!
--    Role: admin

-- 2. Teacher User
--    Email: ogretmen@yedirenklicinar.com
--    Password: Password123!
--    Role: teacher

-- 3. Student User
--    Email: ogrenci@yedirenklicinar.com
--    Password: Password123!
--    Role: student

-- After creating users in Supabase Dashboard, run this SQL to set up their profiles:
-- (The trigger should handle this automatically, but if needed, you can manually insert)

-- Manual Profile Setup (if trigger doesn't work):
-- -----------------------------------------------

-- First, get the user IDs from auth.users table:
-- SELECT id, email FROM auth.users WHERE email IN (
--     'admin@yedirenklicinar.com',
--     'ogretmen@yedirenklicinar.com',
--     'ogrenci@yedirenklicinar.com'
-- );

-- Then insert profiles manually (replace UUIDs with actual user IDs):
-- INSERT INTO profiles (id, email, full_name, role, permissions) VALUES
-- ('ADMIN_USER_ID_HERE', 'admin@yedirenklicinar.com', 'Admin User', 'admin', '{"manage_users": true, "manage_exams": true}'::jsonb),
-- ('TEACHER_USER_ID_HERE', 'ogretmen@yedirenklicinar.com', 'Öğretmen User', 'teacher', '{"create_exams": true, "grade_exams": true}'::jsonb),
-- ('STUDENT_USER_ID_HERE', 'ogrenci@yedirenklicinar.com', 'Öğrenci User', 'student', '{"take_exams": true}'::jsonb);

-- Verify profiles were created:
SELECT p.id, p.email, p.full_name, p.role, p.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email IN (
    'admin@yedirenklicinar.com',
    'ogretmen@yedirenklicinar.com',
    'ogrenci@yedirenklicinar.com'
);
