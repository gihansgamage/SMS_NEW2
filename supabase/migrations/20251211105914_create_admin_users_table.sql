/*
  # Create Admin Users Table

  1. New Tables
    - `admin_users`
      - `id` (bigserial, primary key)
      - `email` (text, unique, not null)
      - `name` (text, not null)
      - `role` (text, not null) - 'VICE_CHANCELLOR', 'DEAN', 'ASSISTANT_REGISTRAR', 'PREMISES_OFFICER', 'STUDENT_SERVICE'
      - `faculty` (text, nullable) - only for DEAN role
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('VICE_CHANCELLOR', 'DEAN', 'ASSISTANT_REGISTRAR', 'PREMISES_OFFICER', 'STUDENT_SERVICE')),
  faculty TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_faculty ON admin_users(faculty);

INSERT INTO admin_users (email, name, role, faculty, is_active) VALUES
  ('gihansgamage@gmail.com', 'Vice Chancellor', 'VICE_CHANCELLOR', NULL, TRUE),
  ('gihansanjaya2001@gmail.com', 'Deputy Vice Chancellor', 'VICE_CHANCELLOR', NULL, TRUE),
  ('gsgamage4@gmail.com', 'Assistant Registrar', 'ASSISTANT_REGISTRAR', NULL, TRUE),
  ('mathscrewyt@gmail.com', 'Premises Officer', 'PREMISES_OFFICER', NULL, TRUE),
  ('sooslemr@gmail.com', 'Student Services Division', 'STUDENT_SERVICE', NULL, TRUE),
  ('dean.agri@pdn.ac.lk', 'Dean Agriculture', 'DEAN', 'Faculty of Agriculture', TRUE),
  ('dean.arts@pdn.ac.lk', 'Dean Arts', 'DEAN', 'Faculty of Arts', TRUE),
  ('dean.dental@pdn.ac.lk', 'Dean Dental', 'DEAN', 'Faculty of Dental Sciences', TRUE),
  ('dean.eng@pdn.ac.lk', 'Dean Engineering', 'DEAN', 'Faculty of Engineering', TRUE),
  ('dean.med@pdn.ac.lk', 'Dean Medicine', 'DEAN', 'Faculty of Medicine', TRUE),
  ('s20369@sci.pdn.ac.lk', 'Dean Science', 'DEAN', 'Faculty of Science', TRUE),
  ('dean.vet@pdn.ac.lk', 'Dean Veterinary', 'DEAN', 'Faculty of Veterinary Medicine and Animal Science', TRUE),
  ('dean.ahs@pdn.ac.lk', 'Dean Allied Health', 'DEAN', 'Faculty of Allied Health Sciences', TRUE),
  ('dean.mgt@pdn.ac.lk', 'Dean Management', 'DEAN', 'Faculty of Management', TRUE)
ON CONFLICT (email) DO NOTHING;
