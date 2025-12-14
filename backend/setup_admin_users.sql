-- Admin Users Setup Script
-- Run this to add admin users to the database

USE sms_uop;

-- Check if admin_users table exists
-- If not, it will be created automatically by Spring Boot

-- Clear existing test data (optional - remove if you want to keep existing users)
-- DELETE FROM admin_users WHERE email LIKE '%@gmail.com';

-- Add admin users
-- Replace the email addresses with actual Gmail accounts that will be used for login

-- 1. Vice Chancellor (Full Access)
INSERT INTO admin_users (email, name, role, is_active, created_at)
VALUES ('gsgamage4@gmail.com', 'Chamuditha Karunarathne', 'VICE_CHANCELLOR', true, NOW())
ON DUPLICATE KEY UPDATE is_active = true;

-- 2. Assistant Registrar
-- INSERT INTO admin_users (email, full_name, role, is_active, created_at)
-- VALUES ('ar@gmail.com', 'Assistant Registrar', 'ASSISTANT_REGISTRAR', true, NOW())
-- ON DUPLICATE KEY UPDATE is_active = true;

-- 3. Dean
-- INSERT INTO admin_users (email, full_name, role, is_active, created_at)
-- VALUES ('dean@gmail.com', 'Dean Name', 'DEAN', true, NOW())
-- ON DUPLICATE KEY UPDATE is_active = true;

-- 4. Student Service Officer
-- INSERT INTO admin_users (email, full_name, role, is_active, created_at)
-- VALUES ('studentservice@gmail.com', 'Student Service Officer', 'STUDENT_SERVICE', true, NOW())
-- ON DUPLICATE KEY UPDATE is_active = true;

-- 5. Premises Officer
-- INSERT INTO admin_users (email, full_name, role, is_active, created_at)
-- VALUES ('premises@gmail.com', 'Premises Officer', 'PREMISES_OFFICER', true, NOW())
-- ON DUPLICATE KEY UPDATE is_active = true;

-- Verify the data
SELECT
    id,
    email,
    name,
    role,
    is_active,
    created_at
FROM admin_users
ORDER BY created_at DESC;

-- Check count
SELECT
    role,
    COUNT(*) as count,
    GROUP_CONCAT(email) as emails
FROM admin_users
WHERE is_active = true
GROUP BY role;
