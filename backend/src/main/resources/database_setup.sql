-- Create Database
CREATE DATABASE IF NOT EXISTS sms_uop2;
USE sms_uop2;

-- ==========================================
-- 1. ADMIN USERS (System Access)
-- ==========================================
CREATE TABLE IF NOT EXISTS admin_users (
                                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                           email VARCHAR(255) NOT NULL UNIQUE,
                                           name VARCHAR(255) NOT NULL,
                                           password VARCHAR(255), -- Nullable if using OAuth only
                                           role VARCHAR(50) NOT NULL, -- 'DEAN', 'ASSISTANT_REGISTRAR', 'VICE_CHANCELLOR', 'PREMISES_OFFICER', 'STUDENT_SERVICE'
                                           faculty VARCHAR(100), -- Nullable, only for DEAN
                                           is_active BOOLEAN DEFAULT TRUE,
                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. SOCIETIES (Main Registry)
-- ==========================================
CREATE TABLE IF NOT EXISTS societies (
                                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                         society_name VARCHAR(255) NOT NULL,
                                         faculty VARCHAR(100) NOT NULL,
                                         year INT NOT NULL,
                                         status VARCHAR(20) NOT NULL DEFAULT 'INACTIVE',

    -- Basic Details
                                         aims TEXT,
                                         agm_date DATE,
                                         website VARCHAR(255),
                                         bank_account VARCHAR(100),
                                         bank_name VARCHAR(100),

    -- Officials
                                         president_name VARCHAR(255),
                                         president_reg_no VARCHAR(50),
                                         president_email VARCHAR(255),
                                         president_mobile VARCHAR(20),

                                         vice_president_name VARCHAR(255),
                                         vice_president_reg_no VARCHAR(50),
                                         vice_president_email VARCHAR(255),
                                         vice_president_mobile VARCHAR(20),

                                         secretary_name VARCHAR(255),
                                         secretary_reg_no VARCHAR(50),
                                         secretary_email VARCHAR(255),
                                         secretary_mobile VARCHAR(20),

                                         joint_secretary_name VARCHAR(255),
                                         joint_secretary_reg_no VARCHAR(50),
                                         joint_secretary_email VARCHAR(255),
                                         joint_secretary_mobile VARCHAR(20),

                                         treasurer_name VARCHAR(255),
                                         treasurer_reg_no VARCHAR(50),
                                         treasurer_email VARCHAR(255),
                                         treasurer_mobile VARCHAR(20),

                                         editor_name VARCHAR(255),
                                         editor_reg_no VARCHAR(50),
                                         editor_email VARCHAR(255),
                                         editor_mobile VARCHAR(20),

                                         senior_treasurer_name VARCHAR(255),
                                         senior_treasurer_email VARCHAR(255),

                                         registered_date DATE,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                         UNIQUE KEY unique_society_year (society_name, year)
);

-- ==========================================
-- 3. REGISTRATION APPLICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS society_registration_applications (
                                                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Applicant
                                                                 applicant_full_name VARCHAR(255),
                                                                 applicant_reg_no VARCHAR(50),
                                                                 applicant_email VARCHAR(255),
                                                                 applicant_faculty VARCHAR(100),
                                                                 applicant_mobile VARCHAR(20),

    -- Society Details
                                                                 society_name VARCHAR(255) NOT NULL,
                                                                 aims TEXT,
                                                                 agm_date DATE,
                                                                 bank_account VARCHAR(100),
                                                                 bank_name VARCHAR(100),

    -- Senior Treasurer
                                                                 senior_treasurer_title VARCHAR(50),
                                                                 senior_treasurer_full_name VARCHAR(255),
                                                                 senior_treasurer_designation VARCHAR(100),
                                                                 senior_treasurer_department VARCHAR(100),
                                                                 senior_treasurer_email VARCHAR(255),
                                                                 senior_treasurer_address TEXT,
                                                                 senior_treasurer_mobile VARCHAR(20),

    -- Officials
                                                                 president_reg_no VARCHAR(50),
                                                                 president_name VARCHAR(255),
                                                                 president_address TEXT,
                                                                 president_email VARCHAR(255),
                                                                 president_mobile VARCHAR(20),

                                                                 vice_president_reg_no VARCHAR(50),
                                                                 vice_president_name VARCHAR(255),
                                                                 vice_president_address TEXT,
                                                                 vice_president_email VARCHAR(255),
                                                                 vice_president_mobile VARCHAR(20),

                                                                 secretary_reg_no VARCHAR(50),
                                                                 secretary_name VARCHAR(255),
                                                                 secretary_address TEXT,
                                                                 secretary_email VARCHAR(255),
                                                                 secretary_mobile VARCHAR(20),

                                                                 joint_secretary_reg_no VARCHAR(50),
                                                                 joint_secretary_name VARCHAR(255),
                                                                 joint_secretary_address TEXT,
                                                                 joint_secretary_email VARCHAR(255),
                                                                 joint_secretary_mobile VARCHAR(20),

                                                                 junior_treasurer_reg_no VARCHAR(50),
                                                                 junior_treasurer_name VARCHAR(255),
                                                                 junior_treasurer_address TEXT,
                                                                 junior_treasurer_email VARCHAR(255),
                                                                 junior_treasurer_mobile VARCHAR(20),

                                                                 editor_reg_no VARCHAR(50),
                                                                 editor_name VARCHAR(255),
                                                                 editor_address TEXT,
                                                                 editor_email VARCHAR(255),
                                                                 editor_mobile VARCHAR(20),

    -- Status & Workflow
                                                                 status VARCHAR(50) DEFAULT 'PENDING_DEAN',
                                                                 year INT,

                                                                 is_dean_approved BOOLEAN DEFAULT FALSE,
                                                                 is_ar_approved BOOLEAN DEFAULT FALSE,
                                                                 is_vc_approved BOOLEAN DEFAULT FALSE,

                                                                 dean_approval_date DATETIME,
                                                                 ar_approval_date DATETIME,
                                                                 vc_approval_date DATETIME,

                                                                 rejection_reason TEXT,
                                                                 submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                                 approved_date DATETIME
);

-- ==========================================
-- 4. RENEWAL APPLICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS society_renewals (
                                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                applicant_full_name VARCHAR(255),
                                                applicant_reg_no VARCHAR(50),
                                                applicant_email VARCHAR(255),
                                                applicant_faculty VARCHAR(100),
                                                applicant_mobile VARCHAR(20),

                                                society_name VARCHAR(255) NOT NULL,
                                                year INT NOT NULL,
                                                agm_date DATE,
                                                website VARCHAR(255),
                                                bank_account VARCHAR(100),
                                                bank_name VARCHAR(100),
                                                difficulties TEXT,

    -- Officials (Flattened for history)
                                                senior_treasurer_name VARCHAR(255),
                                                senior_treasurer_email VARCHAR(255),
                                                president_name VARCHAR(255),
                                                secretary_name VARCHAR(255),

    -- Status & Workflow
                                                status VARCHAR(50) DEFAULT 'PENDING_DEAN',

                                                is_dean_approved BOOLEAN DEFAULT FALSE,
                                                is_ar_approved BOOLEAN DEFAULT FALSE,
                                                is_vc_approved BOOLEAN DEFAULT FALSE,

                                                dean_approval_date DATETIME,
                                                ar_approval_date DATETIME,
                                                vc_approval_date DATETIME,

                                                rejection_reason TEXT,
                                                submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                approved_date DATETIME
);

-- ==========================================
-- 5. EVENT PERMISSIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS event_permissions (
                                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                                 applicant_name VARCHAR(255),
                                                 applicant_reg_no VARCHAR(50),
                                                 applicant_email VARCHAR(255),
                                                 applicant_mobile VARCHAR(20),
                                                 applicant_position VARCHAR(100),
                                                 applicant_faculty VARCHAR(100),

                                                 society_name VARCHAR(255) NOT NULL,
                                                 event_name VARCHAR(255) NOT NULL,
                                                 event_date DATE NOT NULL,
                                                 time_from TIME,
                                                 time_to TIME,
                                                 place VARCHAR(255),
                                                 description TEXT,

                                                 is_inside_university BOOLEAN,
                                                 late_pass_required BOOLEAN,
                                                 outsiders_invited BOOLEAN,
                                                 outsiders_list TEXT,
                                                 first_year_participation BOOLEAN,

                                                 budget_estimate TEXT,
                                                 fund_collection_methods VARCHAR(255),
                                                 student_fee_amount VARCHAR(100),
                                                 receipt_number VARCHAR(100),
                                                 payment_date DATE,

                                                 senior_treasurer_name VARCHAR(255),
                                                 senior_treasurer_department VARCHAR(100),
                                                 senior_treasurer_mobile VARCHAR(20),

                                                 premises_officer_name VARCHAR(255),
                                                 premises_officer_designation VARCHAR(100),
                                                 premises_officer_division VARCHAR(100),

                                                 status VARCHAR(50) DEFAULT 'PENDING_DEAN',

                                                 is_dean_approved BOOLEAN DEFAULT FALSE,
                                                 is_premises_approved BOOLEAN DEFAULT FALSE,
                                                 is_ar_approved BOOLEAN DEFAULT FALSE,
                                                 is_vc_approved BOOLEAN DEFAULT FALSE,

                                                 dean_approval_date DATETIME,
                                                 premises_approval_date DATETIME,
                                                 ar_approval_date DATETIME,
                                                 vc_approval_date DATETIME,

                                                 rejection_reason TEXT,
                                                 submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                 approved_date DATETIME
);

-- ==========================================
-- 6. SUPPORTING TABLES (Lists)
-- ==========================================

CREATE TABLE IF NOT EXISTS activity_logs (
                                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                             action VARCHAR(255) NOT NULL,
                                             target VARCHAR(255),
                                             user_id VARCHAR(50),
                                             user_name VARCHAR(255),
                                             timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Registration Lists
CREATE TABLE IF NOT EXISTS registration_advisory_board (
                                                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                           registration_id BIGINT,
                                                           name VARCHAR(255),
                                                           designation VARCHAR(255),
                                                           department VARCHAR(255),
                                                           FOREIGN KEY (registration_id) REFERENCES society_registration_applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS registration_committee_members (
                                                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                              registration_id BIGINT,
                                                              reg_no VARCHAR(50),
                                                              name VARCHAR(255),
                                                              FOREIGN KEY (registration_id) REFERENCES society_registration_applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS registration_general_members (
                                                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                            registration_id BIGINT,
                                                            reg_no VARCHAR(50),
                                                            name VARCHAR(255),
                                                            FOREIGN KEY (registration_id) REFERENCES society_registration_applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS registration_planning_events (
                                                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                            registration_id BIGINT,
                                                            month VARCHAR(50),
                                                            activity TEXT,
                                                            FOREIGN KEY (registration_id) REFERENCES society_registration_applications(id) ON DELETE CASCADE
);

-- Renewal Lists
CREATE TABLE IF NOT EXISTS renewal_committee_members (
                                                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                         renewal_id BIGINT,
                                                         reg_no VARCHAR(50),
                                                         name VARCHAR(255),
                                                         FOREIGN KEY (renewal_id) REFERENCES society_renewals(id) ON DELETE CASCADE
);

-- ==========================================
-- 7. INITIAL SYSTEM ADMINS (Required)
-- ==========================================
INSERT IGNORE INTO admin_users (email, name, role, faculty, is_active) VALUES
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
                                                                           ('dean.mgt@pdn.ac.lk', 'Dean Management', 'DEAN', 'Faculty of Management', TRUE);