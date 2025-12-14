# Admin Panel Setup Guide

## Quick Start: Adding Admin Users

Since the admin panel uses Google OAuth, you need to add admin users to the database BEFORE they can log in. Here's how:

---

## Prerequisites

1. **Supabase Database** - Must be running and accessible
2. **Google Email Addresses** - Each admin must have a Google account

---

## Step 1: Access Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** or **SQL Editor**

---

## Step 2: Add Admin Users

### Option A: Using SQL Editor (Recommended)

Copy and paste this SQL into the Supabase SQL Editor:

```sql
-- Assistant Registrar (Full access)
INSERT INTO admin_users (name, email, role, faculty, is_active)
VALUES ('Dr. Rajitha Silva', 'your-email@gmail.com', 'ASSISTANT_REGISTRAR', NULL, true);

-- Vice Chancellor
INSERT INTO admin_users (name, email, role, faculty, is_active)
VALUES ('Prof. M.D. Lamawansa', 'vc-email@gmail.com', 'VICE_CHANCELLOR', NULL, true);

-- Faculty Deans (9 Faculties)
INSERT INTO admin_users (name, email, role, faculty, is_active)
VALUES
  ('Prof. K.G. Perera', 'dean-agri@gmail.com', 'DEAN', 'Faculty of Agriculture', true),
  ('Prof. S. Amarasinghe', 'dean-arts@gmail.com', 'DEAN', 'Faculty of Arts', true),
  ('Prof. R. Jayasinghe', 'dean-dental@gmail.com', 'DEAN', 'Faculty of Dental Sciences', true),
  ('Prof. A.M.H.S. Amarasekara', 'dean-eng@gmail.com', 'DEAN', 'Faculty of Engineering', true),
  ('Prof. P.W.G. Prabashwara', 'dean-med@gmail.com', 'DEAN', 'Faculty of Medicine', true),
  ('Prof. K. Tennakoon', 'dean-sci@gmail.com', 'DEAN', 'Faculty of Science', true),
  ('Prof. S.M.S.B.K. Sumanasekara', 'dean-vet@gmail.com', 'DEAN', 'Faculty of Veterinary Medicine & Animal Science', true),
  ('Prof. N. Senanayake', 'dean-ahs@gmail.com', 'DEAN', 'Faculty of Allied Health Sciences', true),
  ('Prof. R.G. Ariyawansa', 'dean-mgt@gmail.com', 'DEAN', 'Faculty of Management', true);

-- Premises Officer
INSERT INTO admin_users (name, email, role, faculty, is_active)
VALUES ('Mr. H.M. Bandara', 'premises@gmail.com', 'PREMISES_OFFICER', NULL, true);

-- Student Service Division
INSERT INTO admin_users (name, email, role, faculty, is_active)
VALUES
  ('Ms. Nishani Fernando', 'student-service-1@gmail.com', 'STUDENT_SERVICE', NULL, true),
  ('Mr. Kasun Perera', 'student-service-2@gmail.com', 'STUDENT_SERVICE', NULL, true);
```

**IMPORTANT**: Replace the email addresses with actual Google accounts!

### Option B: Using Table Editor

1. Go to **Table Editor**
2. Select `admin_users` table
3. Click **Insert** → **Insert row**
4. Fill in the fields:
   - **name**: Admin's full name
   - **email**: Their Google email (e.g., admin@gmail.com)
   - **role**: One of: `DEAN`, `ASSISTANT_REGISTRAR`, `VICE_CHANCELLOR`, `PREMISES_OFFICER`, `STUDENT_SERVICE`
   - **faculty**: Required for `DEAN`, optional for others (choose from 9 faculties)
   - **is_active**: `true`
5. Click **Save**

---

## Step 3: Verify Admin Users

Run this query to see all admin users:

```sql
SELECT id, name, email, role, faculty, is_active
FROM admin_users
ORDER BY role, name;
```

You should see all your admin users listed.

---

## Step 4: Test Login

1. **Start the application**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Navigate to login page**:
   ```
   http://localhost:8080/admin/login
   ```
   or
   ```
   http://localhost:5173/admin/login
   ```

3. **Click "Sign in with Google"**

4. **Select Google account** that matches an email in the database

5. **Should redirect to** `/admin` panel

---

## Step 5: Verify Role-Based Access

After logging in, verify the tabs shown match the role:

### Assistant Registrar Should See:
- ✅ Dashboard
- ✅ Approvals
- ✅ Societies
- ✅ Events
- ✅ Communication
- ✅ Activity Logs
- ✅ **User Management**

### Dean Should See:
- ✅ Dashboard
- ✅ Approvals (only their faculty)
- ✅ Societies
- ✅ Events
- ✅ Communication
- ✅ Activity Logs

### Student Service Should See:
- ✅ Dashboard
- ✅ Societies
- ✅ Events
- ✅ Communication
- ✅ Activity Logs
- ✅ **Monitoring**
- ❌ No Approvals tab

---

## Google OAuth Configuration

### Backend Setup (Already Done)

The backend is configured in `application.yml` or `application.properties`:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            scope:
              - email
              - profile
```

### Environment Variables

Make sure these are set:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**To get these**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
6. Copy client ID and secret

---

## Adding More Admins (After Initial Setup)

### As Assistant Registrar (Easiest)

1. Log in as AR
2. Click **User Management** tab
3. Click **Add Admin User**
4. Fill in:
   - Name
   - Email (must be Google account)
   - Role
   - Faculty (if Dean)
5. Click **Save**
6. New admin can now log in

### Directly in Database

```sql
INSERT INTO admin_users (name, email, role, faculty, is_active)
VALUES ('New Admin Name', 'newemail@gmail.com', 'ROLE_HERE', 'Faculty Name or NULL', true);
```

---

## Deactivating an Admin

### As Assistant Registrar

1. Go to **User Management**
2. Find the user
3. Click **Toggle Active**
4. User will be set to `is_active = false`
5. They can no longer log in

### Directly in Database

```sql
UPDATE admin_users
SET is_active = false
WHERE email = 'email-to-deactivate@gmail.com';
```

---

## Troubleshooting

### "Email not registered" Error

**Problem**: User's Google email is not in `admin_users` table

**Solution**: Add their email to the database with appropriate role

---

### "Account is inactive" Error

**Problem**: User's `is_active` is `false`

**Solution**:
```sql
UPDATE admin_users
SET is_active = true
WHERE email = 'their-email@gmail.com';
```

---

### User Logs In But Has Wrong Role

**Problem**: Wrong role assigned in database

**Solution**:
```sql
UPDATE admin_users
SET role = 'CORRECT_ROLE'
WHERE email = 'their-email@gmail.com';
```

Valid roles:
- `DEAN`
- `ASSISTANT_REGISTRAR`
- `VICE_CHANCELLOR`
- `PREMISES_OFFICER`
- `STUDENT_SERVICE`

---

### Dean Can't See Any Approvals

**Problem**: Faculty not set or wrong faculty

**Solution**:
```sql
UPDATE admin_users
SET faculty = 'Faculty of Engineering'
WHERE email = 'dean-email@gmail.com';
```

Faculty must be ONE OF:
- `Faculty of Agriculture`
- `Faculty of Arts`
- `Faculty of Dental Sciences`
- `Faculty of Engineering`
- `Faculty of Medicine`
- `Faculty of Science`
- `Faculty of Veterinary Medicine & Animal Science`
- `Faculty of Allied Health Sciences`
- `Faculty of Management`

---

## Testing Workflow

### Test Registration Approval (Dean → AR → VC)

1. **Submit a registration** (as public user)
   - Go to `/register`
   - Fill form with faculty = "Faculty of Engineering"
   - Submit

2. **Login as Engineering Dean**
   - Should see registration in **Approvals** tab
   - Approve it

3. **Login as Assistant Registrar**
   - Should see registration in **Approvals** tab (now pending AR)
   - Approve it

4. **Login as Vice Chancellor**
   - Should see registration in **Approvals** tab (now pending VC)
   - Approve it

5. **Check database**
   ```sql
   SELECT society_name, status, is_dean_approved, is_ar_approved, is_vc_approved
   FROM society_registrations
   ORDER BY submitted_date DESC
   LIMIT 1;
   ```

   Should show:
   - `is_dean_approved = true`
   - `is_ar_approved = true`
   - `is_vc_approved = true`
   - `status = 'APPROVED'`

6. **Check societies table**
   ```sql
   SELECT * FROM societies
   ORDER BY registered_date DESC
   LIMIT 1;
   ```

   Should see new society created!

---

### Test Event Permission (Dean → Premises → AR → VC)

1. **Submit event request** (as public user)
   - Go to `/events/request`
   - Select active society
   - Fill form
   - Submit

2. **Login as Faculty Dean** (matching society's faculty)
   - Approve event

3. **Login as Premises Officer**
   - Should see event in **Approvals**
   - Approve it

4. **Login as AR**
   - Approve it

5. **Login as VC**
   - Give final approval

6. **Verify**:
   ```sql
   SELECT event_name, status, is_dean_approved, is_premises_approved, is_ar_approved, is_vc_approved
   FROM event_permissions
   ORDER BY submitted_date DESC
   LIMIT 1;
   ```

---

### Test Monitoring (Student Service)

1. **Login as Student Service**
2. Click **Monitoring** tab
3. Should see ALL applications from all faculties
4. Click any application to view details
5. Should NOT see Approve/Reject buttons (read-only)

---

## Production Deployment

### Security Checklist

- [ ] Change all default admin emails
- [ ] Use official university email addresses (@pdn.ac.lk)
- [ ] Set strong environment variables
- [ ] Enable HTTPS
- [ ] Update Google OAuth redirect URI to production domain
- [ ] Set `isActive = true` only for verified admins
- [ ] Regularly audit admin_users table
- [ ] Monitor activity_logs for suspicious activity

### Recommended Email Format

```
dean@agri.pdn.ac.lk          (Dean of Agriculture)
dean@eng.pdn.ac.lk           (Dean of Engineering)
ar@admin.pdn.ac.lk           (Assistant Registrar)
vc@pdn.ac.lk                 (Vice Chancellor)
premises@admin.pdn.ac.lk     (Premises Officer)
studentservice@pdn.ac.lk     (Student Service)
```

---

## Summary

1. **Add admin users to database** with correct email, role, and faculty
2. **Set `is_active = true`**
3. **Configure Google OAuth** with client ID and secret
4. **Test login** with each role type
5. **Verify role-based tabs** show correctly
6. **Test approval workflows** end-to-end

The admin panel is ready to use once users are added to the database!
