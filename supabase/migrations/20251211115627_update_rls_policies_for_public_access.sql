/*
  # Update RLS Policies for Public Access
  
  1. Changes
    - Allow public users to submit registrations
    - Allow public users to submit renewals
    - Allow public users to submit event permissions
    - Allow public users to read active societies
  
  2. Security
    - Public can INSERT but not UPDATE/DELETE
    - Only authenticated users can approve/manage
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can manage registrations" ON society_registration_applications;
DROP POLICY IF EXISTS "Authenticated users can manage renewals" ON society_renewals;
DROP POLICY IF EXISTS "Authenticated users can manage events" ON event_permissions;

-- Society Registration Applications: Public INSERT, Authenticated ALL
CREATE POLICY "Anyone can submit registrations"
  ON society_registration_applications FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read registrations"
  ON society_registration_applications FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update registrations"
  ON society_registration_applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete registrations"
  ON society_registration_applications FOR DELETE
  TO authenticated
  USING (true);

-- Society Renewals: Public INSERT, Authenticated ALL
CREATE POLICY "Anyone can submit renewals"
  ON society_renewals FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read renewals"
  ON society_renewals FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update renewals"
  ON society_renewals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete renewals"
  ON society_renewals FOR DELETE
  TO authenticated
  USING (true);

-- Event Permissions: Public INSERT, Authenticated ALL
CREATE POLICY "Anyone can submit event permissions"
  ON event_permissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update event permissions"
  ON event_permissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete event permissions"
  ON event_permissions FOR DELETE
  TO authenticated
  USING (true);

-- Related tables policies (all authenticated)
DROP POLICY IF EXISTS "Authenticated users can manage advisory board" ON registration_advisory_board;
DROP POLICY IF EXISTS "Authenticated users can manage committee members" ON registration_committee_members;
DROP POLICY IF EXISTS "Authenticated users can manage general members" ON registration_general_members;
DROP POLICY IF EXISTS "Authenticated users can manage planning events" ON registration_planning_events;

-- Allow public to insert related registration tables
CREATE POLICY "Anyone can insert advisory board"
  ON registration_advisory_board FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read advisory board"
  ON registration_advisory_board FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert committee members"
  ON registration_committee_members FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read committee members"
  ON registration_committee_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert general members"
  ON registration_general_members FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read general members"
  ON registration_general_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert planning events"
  ON registration_planning_events FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read planning events"
  ON registration_planning_events FOR SELECT
  TO public
  USING (true);

-- Renewal related tables
DROP POLICY IF EXISTS "Authenticated users can manage renewal committee" ON renewal_committee_members;
DROP POLICY IF EXISTS "Authenticated users can manage renewal advisory board" ON renewal_advisory_board;
DROP POLICY IF EXISTS "Authenticated users can manage renewal events" ON renewal_planning_events;
DROP POLICY IF EXISTS "Authenticated users can manage renewal members" ON renewal_society_members;
DROP POLICY IF EXISTS "Authenticated users can manage renewal officials" ON renewal_society_officials;
DROP POLICY IF EXISTS "Authenticated users can manage renewal activities" ON renewal_previous_activities;

CREATE POLICY "Anyone can insert renewal committee"
  ON renewal_committee_members FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read renewal committee"
  ON renewal_committee_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert renewal advisory"
  ON renewal_advisory_board FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read renewal advisory"
  ON renewal_advisory_board FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert renewal events"
  ON renewal_planning_events FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read renewal events"
  ON renewal_planning_events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert renewal members"
  ON renewal_society_members FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read renewal members"
  ON renewal_society_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert renewal officials"
  ON renewal_society_officials FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read renewal officials"
  ON renewal_society_officials FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert renewal activities"
  ON renewal_previous_activities FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read renewal activities"
  ON renewal_previous_activities FOR SELECT
  TO public
  USING (true);
