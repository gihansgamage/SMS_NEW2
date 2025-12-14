# Admin Panel Documentation

## Overview

The Society Management System admin panel provides role-based access control for 5 types of administrators to manage society registrations, renewals, event permissions, and communications. The system implements Google OAuth authentication with database-backed authorization.

---

## Admin User Types

The system supports 5 distinct admin roles with specific permissions:

### 1. Vice Chancellor / Deputy Vice Chancellor
**Role Code**: `VICE_CHANCELLOR`

**Access Tabs**:
- ✅ Dashboard
- ✅ Approvals
- ✅ Societies
- ✅ Events
- ✅ Communication
- ✅ Activity Logs
- ❌ User Management
- ❌ Monitoring

**Approval Rights**:
- Final approval on all registrations (after Dean → AR)
- Final approval on all renewals (after Dean → AR)
- Final approval on all event permissions (after Dean → Premises → AR)

**Access Scope**: All faculties

---

### 2. Faculty Deans (9 Faculties)
**Role Code**: `DEAN`

**Faculties**:
1. Faculty of Agriculture
2. Faculty of Arts
3. Faculty of Dental Sciences
4. Faculty of Engineering
5. Faculty of Medicine
6. Faculty of Science
7. Faculty of Veterinary Medicine & Animal Science
8. Faculty of Allied Health Sciences
9. Faculty of Management

**Access Tabs**:
- ✅ Dashboard
- ✅ Approvals
- ✅ Societies
- ✅ Events
- ✅ Communication
- ✅ Activity Logs
- ❌ User Management
- ❌ Monitoring

**Approval Rights**:
- First-level approval on registrations from their faculty
- First-level approval on renewals from their faculty
- First-level approval on event permissions from their faculty

**Access Scope**: Only their assigned faculty

**Key Feature**: Deans see ONLY approvals from their faculty. For example:
- Engineering Dean sees only societies where `applicantFaculty = "Faculty of Engineering"`
- Arts Dean sees only societies where `applicantFaculty = "Faculty of Arts"`

---

### 3. Assistant Registrar
**Role Code**: `ASSISTANT_REGISTRAR`

**Access Tabs**:
- ✅ Dashboard
- ✅ Approvals
- ✅ Societies
- ✅ Events
- ✅ Communication
- ✅ Activity Logs
- ✅ User Management (EXCLUSIVE)
- ❌ Monitoring

**Approval Rights**:
- Second-level approval on all registrations (after Dean)
- Second-level approval on all renewals (after Dean)
- Third-level approval on event permissions (after Dean → Premises)

**Access Scope**: All faculties

**Special Powers**:
- Can add new admin users
- Can activate/deactivate admin accounts
- Full user management capabilities
- Most powerful admin role

---

### 4. Premises Officer
**Role Code**: `PREMISES_OFFICER`

**Access Tabs**:
- ✅ Dashboard
- ✅ Approvals
- ✅ Societies
- ✅ Events
- ✅ Communication
- ✅ Activity Logs
- ❌ User Management
- ❌ Monitoring

**Approval Rights**:
- Second-level approval ONLY on event permissions (after Dean, before AR)
- No approval rights on registrations or renewals

**Access Scope**: All faculties

**Workflow Position**: Dean → **Premises Officer** → AR → VC

---

### 5. Student Service Division
**Role Code**: `STUDENT_SERVICE`

**Access Tabs**:
- ✅ Dashboard
- ❌ Approvals (READ-ONLY, not shown in tabs)
- ✅ Societies
- ✅ Events
- ✅ Communication
- ✅ Activity Logs
- ❌ User Management
- ✅ Monitoring (EXCLUSIVE)

**Approval Rights**:
- **NONE** - This is a monitoring/support role only

**Access Scope**: All faculties

**Special Powers**:
- Can view ALL approval requests across all faculties
- Can monitor activities of other admins
- READ-ONLY access to approval workflows
- Cannot approve or reject anything

---

## Authentication Flow

### Google OAuth Login

1. **User Clicks "Login with Google"**
   - Redirects to Google OAuth consent screen
   - User authenticates with Google account

2. **Google Returns User Data**
   - Email address extracted from OAuth response
   - System checks database for matching email

3. **Database Validation** (in `CustomOidcUserService.java`)
   ```java
   // Step 1: Find user by email
   AdminUser adminUser = adminUserRepository.findByEmail(googleEmail).orElse(null);

   // Step 2: Check if user exists
   if (adminUser == null) {
       throw new OAuth2AuthenticationException("Unauthorized: Email not registered.");
   }

   // Step 3: Check if user is active
   if (!Boolean.TRUE.equals(adminUser.getIsActive())) {
       throw new OAuth2AuthenticationException("Account is inactive.");
   }

   // Step 4: Map role and grant access
   authorities = "ROLE_" + adminUser.getRole().name();
   ```

4. **Success Redirect**
   - Redirects to `/admin` panel
   - Session established with role-based permissions

### Security Checks

✅ **Email must exist in `admin_users` table**
✅ **`isActive` must be `true`** (or `1` in database)
✅ **Role must be one of the 5 valid roles**
✅ **No password required** (OAuth handles authentication)

---

## Admin Panel UI Structure

### Sidebar Navigation

The sidebar dynamically shows tabs based on user role:

```typescript
// AdminPanel.tsx
const getTabs = () => {
  const baseTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  // Approvals: Everyone EXCEPT Student Service
  if (adminUser.role !== 'STUDENT_SERVICE') {
    baseTabs.push({ id: 'approvals', label: 'Approvals', icon: CheckSquare });
  }

  // Societies, Events, Communication, Logs: Everyone
  baseTabs.push(
    { id: 'societies', label: 'Societies', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'communication', label: 'Communication', icon: Mail },
    { id: 'logs', label: 'Activity Logs', icon: FileText }
  );

  // Monitoring: Only Student Service
  if (adminUser.role === 'STUDENT_SERVICE') {
    baseTabs.push({ id: 'monitoring', label: 'Monitoring', icon: Eye });
  }

  // User Management: Only Assistant Registrar
  if (adminUser.role === 'ASSISTANT_REGISTRAR') {
    baseTabs.push({ id: 'users', label: 'User Management', icon: Shield });
  }

  return baseTabs;
};
```

### User Info Display

Sidebar header shows:
- Admin name
- Admin role (formatted: "ASSISTANT REGISTRAR", "DEAN", etc.)
- Color-coded role badge

---

## Tab Functionalities

### 1. Dashboard Tab

**Available To**: All admins

**Displays**:
- Total societies count
- Active societies count
- Current year registrations count
- Current year renewals count
- **Pending approvals count** (role-specific)
- Upcoming approved events
- Welcome message with current date/time
- Admin info (name, role, email)

**Role-Specific Data**:
- **Dean**: Only pending items from their faculty
- **AR**: All items pending AR approval
- **VC**: All items pending VC approval
- **Premises Officer**: Only event permissions pending premises approval
- **Student Service**: No pending count (they don't approve)

**Backend**: `AdminService.getDashboardStats()`

---

### 2. Approvals Tab

**Available To**: Dean, AR, VC, Premises Officer (NOT Student Service)

**Displays**:
- List of pending registrations, renewals, and event permissions
- **Faculty-filtered** for Deans
- **All pending** for AR and VC
- **Events only** for Premises Officer

**Actions Per Item**:
- ✅ **Approve** (with optional comment)
- ❌ **Reject** (requires reason)
- 📄 **View Details** (shows full application)

**Approval Flow**:
```
REGISTRATION/RENEWAL:
Dean → AR → VC → Approved

EVENT PERMISSION:
Dean → Premises Officer → AR → VC → Approved
```

**Backend**: `ApprovalService.getPendingItemsForAdmin()`

---

### 3. Societies Tab

**Available To**: All admins

**Displays**:
- All registered societies
- Filterable by:
  - **Year** (2023, 2024, 2025, etc.)
  - **Status** (Active, Pending, Inactive)
  - **Faculty** (for deans, auto-filtered)
- Pagination support

**Shows Per Society**:
- Society name
- Registration date
- Status
- Faculty
- All officials (President, Secretary, etc.)
- Senior Treasurer
- Bank details
- Website
- Member lists
- Advisory board

**Backend**: `AdminService.getAdminSocieties()`

---

### 4. Events Tab

**Available To**: All admins

**Displays**:
- All event permission requests
- Past events (approved, completed)
- Upcoming events (approved, scheduled)
- Pending event requests (role-specific)

**Filterable by**:
- Date range
- Status (Pending, Approved, Rejected)
- Society name

**Shows Per Event**:
- Event name
- Society name
- Applicant name and position
- Event date, time, venue
- Budget estimate
- Approval status
- Comments from each approver

**Backend**: `EventPermissionService`

---

### 5. Communication Tab

**Available To**: All admins

**Purpose**: Send bulk emails to society officials

**Features**:
- **Select Recipients** by:
  - Society (dropdown)
  - Position (President, Secretary, Junior Treasurer, etc.)
  - Or: All societies
  - Or: Specific faculty societies

- **Compose Email**:
  - Subject field
  - Body (rich text)
  - Preview before send

- **Send to Multiple Recipients**:
  - Sends from official Student Service email
  - Logs activity
  - Confirmation shown

**Backend**: `AdminService.sendBulkEmail()`

---

### 6. Activity Logs Tab

**Available To**: All admins

**Displays**:
- All admin actions in the system
- Timestamp of each action
- Admin who performed action
- Action type (e.g., "APPROVE_REGISTRATION_DEAN")
- Entity affected (society name)

**Filterable by**:
- Date range
- Admin user
- Action type

**Example Log Entries**:
```
2025-01-10 14:30:22 | Dean John Smith | APPROVE_REGISTRATION_DEAN | Engineering Society
2025-01-10 15:45:10 | AR Mary Johnson | APPROVE_REGISTRATION_AR | Engineering Society
2025-01-10 16:20:00 | VC Dr. Brown | APPROVE_REGISTRATION_VC | Engineering Society
```

**Backend**: `ActivityLogService.getActivityLogs()`

---

### 7. User Management Tab

**Available To**: Assistant Registrar ONLY

**Features**:

#### Add New Admin User
- Name
- Email
- Role (dropdown: Dean, AR, VC, Premises Officer, Student Service)
- Faculty (required for Deans, optional for others)
- Auto-set `isActive = true`

#### View All Admin Users
- Table showing all admins
- Columns: Name, Email, Role, Faculty, Status (Active/Inactive)

#### Toggle User Active Status
- Activate/Deactivate button per user
- Inactive users cannot log in

**Security**: Only AR has this tab. Attempting to access as other role returns 403.

**Backend**: `AdminService.createAdminUser()`, `getAllAdminUsers()`, `toggleUserActive()`

---

### 8. Monitoring Tab

**Available To**: Student Service Division ONLY

**Purpose**: View all approval workflows (READ-ONLY)

**Displays**:
- ALL registrations (all statuses, all faculties)
- ALL renewals (all statuses, all faculties)
- ALL event permissions (all statuses, all faculties)

**Shows Per Item**:
- Society/Event name
- Applicant
- Faculty
- Current status
- Approval history (who approved when)
- Comments from approvers
- Timestamps

**Cannot**:
- Approve or reject anything
- Modify any data
- Send emails

**Use Case**: Student Service staff can monitor progress and assist with queries without having approval powers

**Backend**: `ApprovalService.getMonitoringApplications()`

---

## Backend Implementation

### Key Services

#### 1. AdminService (`AdminService.java`)
- `getAdminFromAuth()` - Extract admin from OAuth token
- `getDashboardStats()` - Role-based dashboard data
- `createAdminUser()` - Add new admin (AR only)
- `getAllAdminUsers()` - List all admins (AR only)
- `toggleUserActive()` - Activate/deactivate admin (AR only)
- `getActivityLogs()` - Fetch activity logs
- `getAdminSocieties()` - Fetch societies
- `sendBulkEmail()` - Send emails to society officials

#### 2. ApprovalService (`ApprovalService.java`)
- `getPendingItemsForAdmin()` - Role-based pending approvals
- `getDeanPendingApprovals()` - Faculty-filtered for Dean
- `getARPendingApprovals()` - All pending AR approvals
- `getVCPendingApprovals()` - All pending VC approvals
- `getMonitoringApplications()` - All items (Student Service)
- `processRegistrationApproval()` - Handle registration approval/rejection
- `processRenewalApproval()` - Handle renewal approval/rejection
- `processEventPermissionApproval()` - Handle event approval/rejection

#### 3. CustomOidcUserService (`CustomOidcUserService.java`)
- Handles Google OAuth login
- Validates email exists in database
- Checks `isActive = true`
- Maps role to Spring Security authorities
- Handles email matching (fuzzy matching for gmail/googlemail)

#### 4. EmailService (`EmailService.java`)
- `sendRegistrationConfirmation()` - Confirmation to applicant
- `notifyDeanForApproval()` - Notify dean when new application
- `sendRegistrationStatusUpdate()` - Update on approval/rejection
- `notifyAssistantRegistrarForApproval()` - Notify AR
- `notifyViceChancellorForApproval()` - Notify VC
- `notifyPremisesOfficerForApproval()` - Notify Premises (events only)
- All emails CC senior treasurer

---

## Database Schema

### admin_users Table

```sql
CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255), -- Not used (OAuth only)
  role VARCHAR(50) NOT NULL, -- DEAN, ASSISTANT_REGISTRAR, VICE_CHANCELLOR, PREMISES_OFFICER, STUDENT_SERVICE
  faculty VARCHAR(255), -- Required for DEAN, optional for others
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Example Data

```sql
-- Assistant Registrar
INSERT INTO admin_users (name, email, role, is_active)
VALUES ('Dr. Rajitha Silva', 'rajitha@admin.pdn.ac.lk', 'ASSISTANT_REGISTRAR', true);

-- Vice Chancellor
INSERT INTO admin_users (name, email, role, is_active)
VALUES ('Prof. M.D. Lamawansa', 'vc@pdn.ac.lk', 'VICE_CHANCELLOR', true);

-- Faculty Deans (9 faculties)
INSERT INTO admin_users (name, email, role, faculty, is_active)
VALUES
  ('Prof. K.G. Perera', 'dean@agri.pdn.ac.lk', 'DEAN', 'Faculty of Agriculture', true),
  ('Prof. S. Amarasinghe', 'dean@arts.pdn.ac.lk', 'DEAN', 'Faculty of Arts', true),
  ('Prof. R. Jayasinghe', 'dean@dent.pdn.ac.lk', 'DEAN', 'Faculty of Dental Sciences', true),
  ('Prof. A.M.H.S. Amarasekara', 'dean@eng.pdn.ac.lk', 'DEAN', 'Faculty of Engineering', true),
  ('Prof. P.W.G. Prabashwara', 'dean@med.pdn.ac.lk', 'DEAN', 'Faculty of Medicine', true),
  ('Prof. K. Tennakoon', 'dean@sci.pdn.ac.lk', 'DEAN', 'Faculty of Science', true),
  ('Prof. S.M.S.B.K. Sumanasekara', 'dean@vet.pdn.ac.lk', 'DEAN', 'Faculty of Veterinary Medicine & Animal Science', true),
  ('Prof. N. Senanayake', 'dean@ahs.pdn.ac.lk', 'DEAN', 'Faculty of Allied Health Sciences', true),
  ('Prof. R.G. Ariyawansa', 'dean@mgt.pdn.ac.lk', 'DEAN', 'Faculty of Management', true);

-- Premises Officer
INSERT INTO admin_users (name, email, role, is_active)
VALUES ('Mr. H.M. Bandara', 'premises@pdn.ac.lk', 'PREMISES_OFFICER', true);

-- Student Service Division
INSERT INTO admin_users (name, email, role, is_active)
VALUES
  ('Ms. Nishani Fernando', 'nishani@student.pdn.ac.lk', 'STUDENT_SERVICE', true),
  ('Mr. Kasun Perera', 'kasun@student.pdn.ac.lk', 'STUDENT_SERVICE', true);
```

---

## API Endpoints

### Public Endpoints (No Auth)

```
GET  /api/societies/public              - List all societies
GET  /api/societies/public/{id}         - Get society details
POST /api/societies/register            - Submit registration
POST /api/societies/renew               - Submit renewal
POST /api/events/request                - Request event permission
```

### Admin Endpoints (Auth Required)

```
GET  /api/admin/user-info               - Get current admin info
GET  /api/admin/dashboard               - Get dashboard stats (role-specific)
GET  /api/admin/pending-approvals       - Get pending approvals (role-specific)
GET  /api/admin/societies               - List societies with filters
GET  /api/admin/activity-logs           - Get activity logs
POST /api/admin/send-email              - Send bulk email
```

### Approval Endpoints

```
POST /api/admin/approve-registration/{id}  - Approve registration
POST /api/admin/reject-registration/{id}   - Reject registration
POST /api/admin/approve-renewal/{id}       - Approve renewal
POST /api/admin/reject-renewal/{id}        - Reject renewal
POST /api/admin/approve-event/{id}         - Approve event
POST /api/admin/reject-event/{id}          - Reject event
```

### User Management (AR Only)

```
POST /api/admin/ar/manage-admin/add        - Add new admin user
GET  /api/admin/ar/manage-admin/all        - List all admin users
POST /api/admin/ar/manage-admin/toggle-active - Activate/deactivate user
```

### Monitoring (Student Service Only)

```
GET  /api/admin/ss/monitoring-applications - Get all applications (read-only)
```

---

## Security Configuration

### Role-Based Access Control

```java
// SecurityConfig.java
http.authorizeHttpRequests(authz -> authz
  .requestMatchers("/api/admin/vc/**").hasRole("VICE_CHANCELLOR")
  .requestMatchers("/api/admin/ar/**").hasRole("ASSISTANT_REGISTRAR")
  .requestMatchers("/api/admin/dean/**").hasRole("DEAN")
  .requestMatchers("/api/admin/po/**").hasRole("PREMISES_OFFICER")
  .requestMatchers("/api/admin/ss/**").hasRole("STUDENT_SERVICE")
  .requestMatchers("/api/admin/**").hasAnyRole("VICE_CHANCELLOR", "ASSISTANT_REGISTRAR", "DEAN", "STUDENT_SERVICE", "PREMISES_OFFICER")
);
```

### OAuth Configuration

```yaml
# application.yml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope:
              - email
              - profile
```

---

## Faculty Filtering Logic

### Dean Sees Only Their Faculty

**Backend Logic** (`AdminService.getDashboardStats()`):

```java
case DEAN:
  String faculty = admin.getFaculty();
  pendingCount += registrationRepository.findByStatusAndApplicantFaculty(
    PENDING_DEAN, faculty).size();
```

**How It Works**:
1. Dean logs in with email
2. System fetches admin record: `{ role: "DEAN", faculty: "Faculty of Engineering" }`
3. All queries filter by: `WHERE applicantFaculty = 'Faculty of Engineering'`
4. Dean sees ONLY engineering applications

### AR/VC See All Faculties

```java
case ASSISTANT_REGISTRAR:
  pendingCount += registrationRepository.countByStatus(PENDING_AR);
  // No faculty filter - gets all
```

---

## Approval Workflow

### Registration/Renewal Flow

```
1. User submits application
   └─> Status: PENDING_DEAN

2. Dean (faculty-specific) approves
   └─> Status: PENDING_AR
   └─> Email to AR + Applicant + Senior Treasurer

3. Assistant Registrar approves
   └─> Status: PENDING_VC
   └─> Email to VC + Applicant + Senior Treasurer

4. Vice Chancellor approves
   └─> Status: APPROVED
   └─> Society created/updated in database
   └─> Email to Applicant + Senior Treasurer
```

### Event Permission Flow

```
1. User submits event request
   └─> Status: PENDING_DEAN

2. Dean (faculty-specific) approves
   └─> Status: PENDING_PREMISES
   └─> Email to Premises Officer + Applicant + Senior Treasurer

3. Premises Officer approves
   └─> Status: PENDING_AR
   └─> Email to AR + Applicant + Senior Treasurer

4. Assistant Registrar approves
   └─> Status: PENDING_VC
   └─> Email to VC + Applicant + Senior Treasurer

5. Vice Chancellor approves
   └─> Status: APPROVED
   └─> Email to Applicant + Senior Treasurer
```

### Rejection at Any Stage

```
Any approver can reject with reason
└─> Status: REJECTED
└─> Email to Applicant + Senior Treasurer with rejection reason
└─> Process stops
```

---

## Testing Checklist

### Authentication
- [ ] Login with valid Google account (email in database, isActive = true)
- [ ] Login with valid email but isActive = false (should fail)
- [ ] Login with email not in database (should fail)
- [ ] Logout functionality

### Role-Based Tab Access
- [ ] Dean sees 6 tabs (no User Management, no Monitoring)
- [ ] AR sees 7 tabs (includes User Management)
- [ ] VC sees 6 tabs (no User Management, no Monitoring)
- [ ] Premises Officer sees 6 tabs
- [ ] Student Service sees 6 tabs (no Approvals, includes Monitoring)

### Faculty Filtering
- [ ] Engineering Dean sees only Engineering applications
- [ ] Science Dean sees only Science applications
- [ ] AR sees all faculties
- [ ] VC sees all faculties

### Approvals
- [ ] Dean can approve registration from their faculty
- [ ] Dean cannot see registrations from other faculties
- [ ] AR can approve after Dean
- [ ] VC can approve after AR
- [ ] Premises Officer can approve events after Dean

### User Management (AR Only)
- [ ] AR can add new admin users
- [ ] AR can view all admin users
- [ ] AR can toggle user active status
- [ ] Non-AR roles get 403 error on user management endpoints

### Monitoring (Student Service Only)
- [ ] Student Service can view all applications
- [ ] Student Service cannot approve/reject
- [ ] Non-Student Service roles don't see Monitoring tab

### Email Notifications
- [ ] Applicant receives confirmation email
- [ ] Dean receives notification of new application
- [ ] Senior Treasurer CC'd on all emails
- [ ] Status update emails sent after each approval
- [ ] Rejection emails include reason

---

## Summary

### ✅ What's Working

1. **Complete OAuth Authentication**
   - Google OAuth integration
   - Database validation (email + isActive check)
   - Role mapping to Spring Security

2. **Role-Based Access Control**
   - 5 distinct admin types with specific permissions
   - Dynamic tab rendering based on role
   - Backend endpoint protection with @PreAuthorize

3. **Faculty Filtering**
   - Deans see only their faculty
   - AR/VC/Student Service see all
   - Implemented in dashboard stats and approvals

4. **Approval Workflows**
   - Complete 3-stage workflow for registrations/renewals
   - Complete 4-stage workflow for events (includes Premises)
   - Email notifications at every stage
   - Comment/reason tracking

5. **All Tabs Implemented**
   - Dashboard with role-specific stats
   - Approvals with filtering
   - Societies management
   - Events management
   - Communication (bulk email)
   - Activity logs
   - User management (AR only)
   - Monitoring (Student Service only)

### 🎯 Key Features

- **Google OAuth** - No password management needed
- **Faculty-Specific** - Deans see only their faculty
- **Premises Officer** - Unique role for event venue approvals
- **Monitoring Role** - Student Service can view all without approval powers
- **Full Audit Trail** - All actions logged in activity_logs table
- **Email Notifications** - Automated at every approval stage
- **User Management** - AR can manage admin accounts

The admin panel is fully functional and ready for use!
