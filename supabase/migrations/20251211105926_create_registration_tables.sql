/*
  # Create Society Registration Tables

  1. New Tables
    - `society_registration_applications` - Main registration data
    - `registration_advisory_board` - Advisory board members
    - `registration_committee_members` - Committee members
    - `registration_general_members` - General members
    - `registration_planning_events` - Planned events
  
  2. Security
    - Enable RLS on all tables
    - Authenticated access for management
*/

CREATE TABLE IF NOT EXISTS society_registration_applications (
  id BIGSERIAL PRIMARY KEY,
  
  applicant_full_name TEXT,
  applicant_reg_no TEXT,
  applicant_email TEXT,
  applicant_faculty TEXT,
  applicant_mobile TEXT,
  
  society_name TEXT NOT NULL,
  aims TEXT,
  agm_date DATE,
  bank_account TEXT,
  bank_name TEXT,
  
  senior_treasurer_title TEXT,
  senior_treasurer_full_name TEXT,
  senior_treasurer_designation TEXT,
  senior_treasurer_department TEXT,
  senior_treasurer_email TEXT,
  senior_treasurer_address TEXT,
  senior_treasurer_mobile TEXT,
  
  president_reg_no TEXT,
  president_name TEXT,
  president_address TEXT,
  president_email TEXT,
  president_mobile TEXT,
  
  vice_president_reg_no TEXT,
  vice_president_name TEXT,
  vice_president_address TEXT,
  vice_president_email TEXT,
  vice_president_mobile TEXT,
  
  secretary_reg_no TEXT,
  secretary_name TEXT,
  secretary_address TEXT,
  secretary_email TEXT,
  secretary_mobile TEXT,
  
  joint_secretary_reg_no TEXT,
  joint_secretary_name TEXT,
  joint_secretary_address TEXT,
  joint_secretary_email TEXT,
  joint_secretary_mobile TEXT,
  
  junior_treasurer_reg_no TEXT,
  junior_treasurer_name TEXT,
  junior_treasurer_address TEXT,
  junior_treasurer_email TEXT,
  junior_treasurer_mobile TEXT,
  
  editor_reg_no TEXT,
  editor_name TEXT,
  editor_address TEXT,
  editor_email TEXT,
  editor_mobile TEXT,
  
  status TEXT DEFAULT 'PENDING_DEAN' CHECK (status IN ('PENDING_DEAN', 'PENDING_AR', 'PENDING_VC', 'APPROVED', 'REJECTED')),
  year INTEGER,
  
  is_dean_approved BOOLEAN DEFAULT FALSE,
  is_ar_approved BOOLEAN DEFAULT FALSE,
  is_vc_approved BOOLEAN DEFAULT FALSE,
  
  dean_approval_date TIMESTAMPTZ,
  dean_comment TEXT,
  ar_approval_date TIMESTAMPTZ,
  ar_comment TEXT,
  vc_approval_date TIMESTAMPTZ,
  vc_comment TEXT,
  
  rejection_reason TEXT,
  submitted_date TIMESTAMPTZ DEFAULT NOW(),
  approved_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS registration_advisory_board (
  id BIGSERIAL PRIMARY KEY,
  registration_id BIGINT NOT NULL REFERENCES society_registration_applications(id) ON DELETE CASCADE,
  name TEXT,
  designation TEXT,
  department TEXT
);

CREATE TABLE IF NOT EXISTS registration_committee_members (
  id BIGSERIAL PRIMARY KEY,
  registration_id BIGINT NOT NULL REFERENCES society_registration_applications(id) ON DELETE CASCADE,
  reg_no TEXT,
  name TEXT
);

CREATE TABLE IF NOT EXISTS registration_general_members (
  id BIGSERIAL PRIMARY KEY,
  registration_id BIGINT NOT NULL REFERENCES society_registration_applications(id) ON DELETE CASCADE,
  reg_no TEXT,
  name TEXT
);

CREATE TABLE IF NOT EXISTS registration_planning_events (
  id BIGSERIAL PRIMARY KEY,
  registration_id BIGINT NOT NULL REFERENCES society_registration_applications(id) ON DELETE CASCADE,
  month TEXT,
  activity TEXT
);

ALTER TABLE society_registration_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_advisory_board ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_general_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_planning_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage registrations"
  ON society_registration_applications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage advisory board"
  ON registration_advisory_board FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage committee members"
  ON registration_committee_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage general members"
  ON registration_general_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage planning events"
  ON registration_planning_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_registration_status ON society_registration_applications(status);
CREATE INDEX IF NOT EXISTS idx_registration_year ON society_registration_applications(year);
CREATE INDEX IF NOT EXISTS idx_registration_faculty ON society_registration_applications(applicant_faculty);
CREATE INDEX IF NOT EXISTS idx_registration_email ON society_registration_applications(applicant_email);
