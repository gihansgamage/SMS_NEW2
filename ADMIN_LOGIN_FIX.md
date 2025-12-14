# Admin Login Fix Guide

## Problem
Admin login is failing with "Access Denied" error when using Google OAuth.

## Root Cause
The Google OAuth redirect URIs are not properly configured in Google Cloud Console.

## Solution

### 1. Configure Google Cloud Console

Go to [Google Cloud Console](https://console.cloud.google.com/) and follow these steps:

1. **Select Your Project** or create a new one

2. **Navigate to Credentials**
   - Go to "APIs & Services" → "Credentials"

3. **Edit OAuth 2.0 Client ID**
   - Find your OAuth 2.0 Client ID: `918615763678-bvvq6f80lvo7mrfkekf0ttf12i3cards.apps.googleusercontent.com`
   - Click the edit icon (pencil)

4. **Add Authorized Redirect URIs**

   Add EXACTLY these URIs:
   ```
   http://localhost:8080/login/oauth2/code/google
   http://127.0.0.1:8080/login/oauth2/code/google
   ```

5. **Add Authorized JavaScript Origins** (if not already present)
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   http://localhost:8080
   http://127.0.0.1:8080
   ```

6. **Save Changes**

### 2. Add Admin Users to Database

Connect to your MySQL database and add admin users:

```sql
-- Connect to database
USE sms_uop;

-- Add your Gmail account as an admin
INSERT INTO admin_users (email, full_name, role, is_active, created_at)
VALUES
('chamudithakarunarathne06@gmail.com', 'Admin User', 'VICE_CHANCELLOR', true, NOW()),
('your-other-email@gmail.com', 'Another Admin', 'DEAN', true, NOW());

-- Verify the data
SELECT id, email, role, is_active FROM admin_users;
```

### 3. Admin User Roles

Available roles in the system:
- `VICE_CHANCELLOR` - Full access to all admin features
- `ASSISTANT_REGISTRAR` - Access to AR-specific features
- `DEAN` - Access to Dean-specific features
- `STUDENT_SERVICE` - Access to student service features
- `PREMISES_OFFICER` - Access to premises-related features

### 4. Restart Backend Server

After making these changes, restart your Spring Boot backend:

```bash
cd backend
./mvnw spring-boot:run
```

Or if using IDE, stop and start the application.

### 5. Test Login

1. Open browser: `http://localhost:5173/admin/login`
2. Click "Sign in with Google"
3. Select your Google account (must match email in database)
4. You should be redirected to admin panel

## Troubleshooting

### Still Getting "Access Denied"?

**Check Backend Logs:**
Look for these messages in backend console:
```
🚀 OIDC LOGIN ATTEMPT (Google)
➤ Email from Google: your-email@gmail.com
```

**Common Issues:**

1. **Email Mismatch**
   - Google email: `test@gmail.com`
   - Database email: `test@googlemail.com` or different case
   - **Fix:** Use exact same email in database as shown by Google

2. **User Inactive**
   - Check `is_active` column is `true` (or `1`)
   ```sql
   UPDATE admin_users SET is_active = true WHERE email = 'your-email@gmail.com';
   ```

3. **Wrong Redirect URI**
   - Make sure Google Console has: `http://localhost:8080/login/oauth2/code/google`
   - NOT: `http://localhost:5173/...` (that's frontend)

4. **OAuth Client ID/Secret Wrong**
   - Verify in `.env` file
   - Verify in Google Cloud Console matches

### Clear Browser Cache

Sometimes old OAuth sessions cause issues:
1. Open Developer Tools (F12)
2. Go to Application → Cookies
3. Delete all cookies for `localhost:5173` and `localhost:8080`
4. Try logging in again

### Check Database Connection

```sql
-- Verify admin_users table exists
SHOW TABLES LIKE 'admin_users';

-- Check table structure
DESCRIBE admin_users;

-- List all admin users
SELECT * FROM admin_users;
```

## Expected Flow

```
1. User clicks "Sign in with Google" on /admin/login
   ↓
2. Redirects to Google OAuth: https://accounts.google.com/o/oauth2/v2/auth
   ↓
3. User selects Google account and grants permissions
   ↓
4. Google redirects back to: http://localhost:8080/login/oauth2/code/google
   ↓
5. Spring Boot receives OAuth code and exchanges for token
   ↓
6. CustomOidcUserService checks database for user email
   ↓
7. If found and active → Success → Redirect to /admin
   ↓
8. If not found → Failure → Redirect to /admin/login?error=auth_failed
```

## Quick Checklist

- [ ] Google Cloud Console redirect URI: `http://localhost:8080/login/oauth2/code/google`
- [ ] Admin user email in database matches Google account exactly
- [ ] `is_active` column is `true` (or `1`)
- [ ] Backend server is running on port 8080
- [ ] Frontend is running on port 5173
- [ ] Browser cookies cleared
- [ ] `.env` file has correct OAuth credentials

## Still Not Working?

Check backend logs for detailed error messages. The CustomOidcUserService prints detailed debugging info:

```
🚀 OIDC LOGIN ATTEMPT (Google)
➤ Email from Google: [shows actual email from Google]
✅ SUCCESS: Logged in as VICE_CHANCELLOR
```

or

```
❌ FAILED: No matching user found in DB for: [email]
```

This will tell you exactly what's wrong.
