/*
  # Create Society Renewal Tables

  1. New Tables
    - `society_renewals` - Main renewal data
    - `renewal_committee_members` - Committee members for renewal
    - `renewal_advisory_board` - Advisory board for renewal
    - `renewal_planning_events` - Planned events for renewal
    - `renewal_society_members` - Society members list
    - `renewal_society_officials` - Society officials
    - `renewal_previous_activities` - Previous year activities
  
  2. Security
    - Enable RLS on all tables
*/

CREATE TABLE IF NOT EXISTS society_renewals (
  id BIGSERIAL PRIMARY KEY,
  
  applicant_full_name TEXT,
  applicant_reg_no TEXT,
  applicant_email TEXT,
  applicant_faculty TEXT,
  applicant_mobile TEXT,
  
  society_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  agm_date DATE,
  website TEXT,
  bank_account TEXT,
  bank_name TEXT,
  difficulties TEXT,
  
  senior_treasurer_name TEXT,
  senior_treasurer_email TEXT,
  president_name TEXT,
  secretary_name TEXT,
  
  status TEXT DEFAULT 'PENDING_DEAN' CHECK (status IN ('PENDING_DEAN', 'PENDING_AR', 'PENDING_VC', 'APPROVED', 'REJECTED')),
  
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

CREATE TABLE IF NOT EXISTS renewal_committee_members (
  id BIGSERIAL PRIMARY KEY,
  renewal_id BIGINT NOT NULL REFERENCES society_renewals(id) ON DELETE CASCADE,
  reg_no TEXT,
  name TEXT,
  position TEXT
);

CREATE TABLE IF NOT EXISTS renewal_advisory_board (
  id BIGSERIAL PRIMARY KEY,
  renewal_id BIGINT NOT NULL REFERENCES society_renewals(id) ON DELETE CASCADE,
  name TEXT,
  designation TEXT,
  department TEXT
);

CREATE TABLE IF NOT EXISTS renewal_planning_events (
  id BIGSERIAL PRIMARY KEY,
  renewal_id BIGINT NOT NULL REFERENCES society_renewals(id) ON DELETE CASCADE,
  month TEXT,
  activity TEXT
);

CREATE TABLE IF NOT EXISTS renewal_society_members (
  id BIGSERIAL PRIMARY KEY,
  renewal_id BIGINT NOT NULL REFERENCES society_renewals(id) ON DELETE CASCADE,
  reg_no TEXT,
  name TEXT,
  faculty TEXT
);

CREATE TABLE IF NOT EXISTS renewal_society_officials (
  id BIGSERIAL PRIMARY KEY,
  renewal_id BIGINT NOT NULL REFERENCES society_renewals(id) ON DELETE CASCADE,
  position TEXT,
  name TEXT,
  reg_no TEXT,
  email TEXT,
  mobile TEXT
);

CREATE TABLE IF NOT EXISTS renewal_previous_activities (
  id BIGSERIAL PRIMARY KEY,
  renewal_id BIGINT NOT NULL REFERENCES society_renewals(id) ON DELETE CASCADE,
  date DATE,
  activity TEXT,
  description TEXT
);

ALTER TABLE society_renewals ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_advisory_board ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_planning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_society_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_society_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_previous_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage renewals"
  ON society_renewals FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage renewal committee"
  ON renewal_committee_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage renewal advisory board"
  ON renewal_advisory_board FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage renewal events"
  ON renewal_planning_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage renewal members"
  ON renewal_society_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage renewal officials"
  ON renewal_society_officials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage renewal activities"
  ON renewal_previous_activities FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_renewals_status ON society_renewals(status);
CREATE INDEX IF NOT EXISTS idx_renewals_year ON society_renewals(year);
CREATE INDEX IF NOT EXISTS idx_renewals_society ON society_renewals(society_name);
