/*
  # Create Event Permission Tables

  1. New Tables
    - `event_permissions` - Event permission requests
  
  2. Security
    - Enable RLS
    - Authenticated access for management
  
  3. Notes
    - Approval chain: Dean -> Premises Officer -> AR -> VC
*/

CREATE TABLE IF NOT EXISTS event_permissions (
  id BIGSERIAL PRIMARY KEY,
  
  applicant_name TEXT,
  applicant_reg_no TEXT,
  applicant_email TEXT,
  applicant_mobile TEXT,
  applicant_position TEXT,
  applicant_faculty TEXT,
  
  society_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  time_from TIME,
  time_to TIME,
  place TEXT,
  description TEXT,
  
  is_inside_university BOOLEAN DEFAULT TRUE,
  late_pass_required BOOLEAN DEFAULT FALSE,
  outsiders_invited BOOLEAN DEFAULT FALSE,
  outsiders_list TEXT,
  first_year_participation BOOLEAN DEFAULT FALSE,
  
  budget_estimate TEXT,
  fund_collection_methods TEXT,
  student_fee_amount TEXT,
  receipt_number TEXT,
  payment_date DATE,
  
  senior_treasurer_name TEXT,
  senior_treasurer_department TEXT,
  senior_treasurer_mobile TEXT,
  
  premises_officer_name TEXT,
  premises_officer_designation TEXT,
  premises_officer_division TEXT,
  
  status TEXT DEFAULT 'PENDING_DEAN' CHECK (status IN ('PENDING_DEAN', 'PENDING_PREMISES', 'PENDING_AR', 'PENDING_VC', 'APPROVED', 'REJECTED')),
  
  is_dean_approved BOOLEAN DEFAULT FALSE,
  is_premises_approved BOOLEAN DEFAULT FALSE,
  is_ar_approved BOOLEAN DEFAULT FALSE,
  is_vc_approved BOOLEAN DEFAULT FALSE,
  
  dean_approval_date TIMESTAMPTZ,
  dean_comment TEXT,
  premises_approval_date TIMESTAMPTZ,
  premises_comment TEXT,
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

ALTER TABLE event_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved events"
  ON event_permissions FOR SELECT
  USING (status = 'APPROVED' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage events"
  ON event_permissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_events_status ON event_permissions(status);
CREATE INDEX IF NOT EXISTS idx_events_society ON event_permissions(society_name);
CREATE INDEX IF NOT EXISTS idx_events_date ON event_permissions(event_date);
CREATE INDEX IF NOT EXISTS idx_events_faculty ON event_permissions(applicant_faculty);
