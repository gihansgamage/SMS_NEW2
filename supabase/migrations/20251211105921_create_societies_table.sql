/*
  # Create Societies Table

  1. New Tables
    - `societies`
      - Core identity fields
      - Society information
      - Official contact details
      - Status tracking
      - Year-wise tracking
  
  2. Security
    - Enable RLS on `societies` table
    - Public read access for active societies
    - Authenticated write access
*/

CREATE TABLE IF NOT EXISTS societies (
  id BIGSERIAL PRIMARY KEY,
  society_name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'INACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING')),
  
  aims TEXT,
  agm_date DATE,
  website TEXT,
  bank_account TEXT,
  bank_name TEXT,
  
  president_name TEXT,
  president_reg_no TEXT,
  president_email TEXT,
  president_mobile TEXT,
  
  vice_president_name TEXT,
  vice_president_reg_no TEXT,
  vice_president_email TEXT,
  vice_president_mobile TEXT,
  
  secretary_name TEXT,
  secretary_reg_no TEXT,
  secretary_email TEXT,
  secretary_mobile TEXT,
  
  joint_secretary_name TEXT,
  joint_secretary_reg_no TEXT,
  joint_secretary_email TEXT,
  joint_secretary_mobile TEXT,
  
  treasurer_name TEXT,
  treasurer_reg_no TEXT,
  treasurer_email TEXT,
  treasurer_mobile TEXT,
  
  editor_name TEXT,
  editor_reg_no TEXT,
  editor_email TEXT,
  editor_mobile TEXT,
  
  senior_treasurer_name TEXT,
  senior_treasurer_email TEXT,
  
  registered_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE (society_name, year)
);

ALTER TABLE societies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active societies"
  ON societies FOR SELECT
  USING (status = 'ACTIVE' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage societies"
  ON societies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_societies_name ON societies(society_name);
CREATE INDEX IF NOT EXISTS idx_societies_year ON societies(year);
CREATE INDEX IF NOT EXISTS idx_societies_status ON societies(status);
CREATE INDEX IF NOT EXISTS idx_societies_faculty ON societies(faculty);
