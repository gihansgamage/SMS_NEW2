/*
  # Add Status Management Functions
  
  1. Functions
    - Mark societies as INACTIVE if not renewed for current year
    - Update society status to ACTIVE when renewal approved
    - Update society status to PENDING during approval process
  
  2. Triggers
    - Auto-update society status on renewal approval
*/

-- Function to mark societies as inactive if not renewed
CREATE OR REPLACE FUNCTION check_society_renewal_status()
RETURNS void AS $$
BEGIN
  -- Mark societies as INACTIVE if they don't have an approved renewal for current year
  UPDATE societies
  SET status = 'INACTIVE', updated_at = NOW()
  WHERE year < EXTRACT(YEAR FROM CURRENT_DATE)
  AND status = 'ACTIVE'
  AND NOT EXISTS (
    SELECT 1 FROM society_renewals sr
    WHERE sr.society_name = societies.society_name
    AND sr.year = EXTRACT(YEAR FROM CURRENT_DATE)
    AND sr.status = 'APPROVED'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to update society when renewal is approved
CREATE OR REPLACE FUNCTION update_society_on_renewal_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- When renewal is approved, update society record
  IF NEW.status = 'APPROVED' AND OLD.status != 'APPROVED' THEN
    -- Check if society exists for new year
    IF EXISTS (SELECT 1 FROM societies WHERE society_name = NEW.society_name AND year = NEW.year) THEN
      -- Update existing record
      UPDATE societies
      SET status = 'ACTIVE',
          agm_date = NEW.agm_date,
          website = NEW.website,
          bank_account = NEW.bank_account,
          bank_name = NEW.bank_name,
          senior_treasurer_name = NEW.senior_treasurer_name,
          senior_treasurer_email = NEW.senior_treasurer_email,
          updated_at = NOW()
      WHERE society_name = NEW.society_name AND year = NEW.year;
    ELSE
      -- Create new record for new year (copy from previous year)
      INSERT INTO societies (
        society_name, faculty, year, status, agm_date, website, bank_account, bank_name,
        senior_treasurer_name, senior_treasurer_email, registered_date
      )
      SELECT 
        s.society_name, s.faculty, NEW.year, 'ACTIVE', NEW.agm_date, NEW.website,
        NEW.bank_account, NEW.bank_name, NEW.senior_treasurer_name, NEW.senior_treasurer_email,
        s.registered_date
      FROM societies s
      WHERE s.society_name = NEW.society_name
      ORDER BY s.year DESC
      LIMIT 1
      ON CONFLICT (society_name, year) DO UPDATE
      SET status = 'ACTIVE', updated_at = NOW();
    END IF;
  END IF;
  
  -- When renewal is pending, mark society as PENDING for that year
  IF NEW.status LIKE 'PENDING%' THEN
    INSERT INTO societies (
      society_name, faculty, year, status, registered_date
    )
    SELECT 
      s.society_name, s.faculty, NEW.year, 'PENDING', s.registered_date
    FROM societies s
    WHERE s.society_name = NEW.society_name
    ORDER BY s.year DESC
    LIMIT 1
    ON CONFLICT (society_name, year) DO UPDATE
    SET status = 'PENDING', updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for renewal approval
DROP TRIGGER IF EXISTS trg_renewal_approval ON society_renewals;
CREATE TRIGGER trg_renewal_approval
  AFTER INSERT OR UPDATE ON society_renewals
  FOR EACH ROW
  EXECUTE FUNCTION update_society_on_renewal_approval();

-- Function to set society status to PENDING when registration starts
CREATE OR REPLACE FUNCTION create_pending_society_on_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a PENDING society record when registration is submitted
  INSERT INTO societies (
    society_name, faculty, year, status, registered_date
  )
  VALUES (
    NEW.society_name, 
    NEW.applicant_faculty, 
    COALESCE(NEW.year, EXTRACT(YEAR FROM CURRENT_DATE)),
    'PENDING',
    CURRENT_DATE
  )
  ON CONFLICT (society_name, year) DO UPDATE
  SET status = 'PENDING', faculty = NEW.applicant_faculty, updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for registration submission
DROP TRIGGER IF EXISTS trg_registration_submission ON society_registration_applications;
CREATE TRIGGER trg_registration_submission
  AFTER INSERT ON society_registration_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_pending_society_on_registration();

-- Ensure year is set on registration if not provided
CREATE OR REPLACE FUNCTION set_registration_year()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.year IS NULL THEN
    NEW.year := EXTRACT(YEAR FROM CURRENT_DATE);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_registration_year ON society_registration_applications;
CREATE TRIGGER trg_set_registration_year
  BEFORE INSERT ON society_registration_applications
  FOR EACH ROW
  EXECUTE FUNCTION set_registration_year();

-- Ensure year is set on renewal
CREATE OR REPLACE FUNCTION set_renewal_year()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.year IS NULL THEN
    NEW.year := EXTRACT(YEAR FROM CURRENT_DATE);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_renewal_year ON society_renewals;
CREATE TRIGGER trg_set_renewal_year
  BEFORE INSERT ON society_renewals
  FOR EACH ROW
  EXECUTE FUNCTION set_renewal_year();
