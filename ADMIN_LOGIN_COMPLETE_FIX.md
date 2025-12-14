# Complete Admin Login Fix Guide

## Problem Summary
Admin login through Google OAuth is failing with "Access Denied" error.

## Root Causes Found
1. **Frontend missing .env file** - Frontend doesn't have VITE_BACKEND_URL configured
2. **Google Cloud Console redirect URI** - Not properly configured
3. **Database admin_users table** - May not have the correct email entries

---

## Complete Fix Instructions

### 1. Configure Google Cloud Console (CRITICAL)

Go to: https://console.cloud.google.com/apis/credentials

**Steps:**
1. Select your project
2. Find OAuth 2.0 Client ID: `918615763678-bvvq6f80lvo7mrfkekf0ttf12i3cards.apps.googleusercontent.com`
3. Click **Edit** (pencil icon)
4. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:8080/login/oauth2/code/google
   http://127.0.0.1:8080/login/oauth2/code/google
   ```
5. Under **Authorized JavaScript origins**, add (if not present):
   ```
   http://localhost:5173
   http://localhost:8080
   http://127.0.0.1:5173
   http://127.0.0.1:8080
   ```
6. Click **SAVE**
7. **WAIT 1-2 MINUTES** for changes to propagate

---

### 2. Frontend Environment Variables (FIXED)

✅ Created `/sms-uop/.env` with:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_BACKEND_URL=http://localhost:8080
```

**Action Required:** Restart your frontend dev server after this file is created.

---

### 3. Backend Environment Variables (FIXED)

✅ Updated `/.env` with correct database password:
```env
DB_PASSWORD=NewStrongPassword123!
```

---

### 4. Database Setup

#### Option A: Run SQL Script
```bash
cd /tmp/cc-agent/61369615/project/backend
mysql -u root -pNewStrongPassword123! sms_uop < setup_admin_users.sql
```

#### Option B: Manual SQL
```sql
USE sms_uop;

-- Add your Gmail account
INSERT INTO admin_users (email, full_name, role, is_active, created_at)
VALUES ('chamudithakarunarathne06@gmail.com', 'Chamuditha Karunarathne', 'VICE_CHANCELLOR', true, NOW())
ON DUPLICATE KEY UPDATE is_active = true;

-- Verify
SELECT id, email, full_name, role, is_active FROM admin_users;
```

**Important:** The email MUST match EXACTLY with your Google account email (case-sensitive).

---

### 5. Restart Everything

```bash
# Terminal 1: Backend
cd /tmp/cc-agent/61369615/project/backend
./mvnw clean spring-boot:run

# Terminal 2: Frontend
cd /tmp/cc-agent/61369615/project/sms-uop
npm run dev
```

**Important:** You MUST restart both servers for environment variable changes to take effect.

---

### 6. Test Login Flow

1. **Clear Browser Data:**
   - Open DevTools (F12)
   - Application → Cookies → Delete all for `localhost:5173` and `localhost:8080`
   - Or use Incognito/Private window

2. **Test Login:**
   - Go to: http://localhost:5173/admin/login
   - Click "Sign in with Google"
   - Browser should redirect to Google login
   - Login with `chamudithakarunarathne06@gmail.com`
   - Should redirect back to: http://localhost:5173/admin

---

## How OAuth Flow Works

```
User clicks "Sign in with Google"
    ↓
Frontend redirects to: http://localhost:8080/oauth2/authorization/google
    ↓
Backend (Spring Boot) redirects to: https://accounts.google.com/o/oauth2/v2/auth
    ↓
User logs in with Google
    ↓
Google redirects to: http://localhost:8080/login/oauth2/code/google (with code)
    ↓
Backend exchanges code for token, gets user info
    ↓
CustomOidcUserService checks database for user email
    ↓
If found and active → Creates session → Redirects to: http://localhost:5173/admin
    ↓
If not found → Redirects to: http://localhost:5173/admin/login?error=auth_failed
```

---

## Debugging Steps

### Check Backend Logs

When you try to login, you should see in backend console:

```
🚀 OIDC LOGIN ATTEMPT (Google)
➤ Email from Google: chamudithakarunarathne06@gmail.com
✅ SUCCESS: Logged in as VICE_CHANCELLOR
```

**If you see:**
```
❌ FAILED: No matching user found in DB for: chamudithakarunarathne06@gmail.com
```
This means the email is NOT in the database. Run the SQL insert again.

### Check Frontend Network

1. Open DevTools → Network tab
2. Click "Sign in with Google"
3. You should see:
   - Redirect to `localhost:8080/oauth2/authorization/google`
   - Then to `accounts.google.com`
   - Then back to `localhost:8080/login/oauth2/code/google`
   - Finally to `localhost:5173/admin`

**If you see "Redirect URI mismatch" from Google:**
- Google Cloud Console redirect URI is NOT configured correctly
- Double-check Step 1 above

### Check Session Cookie

After successful login:
1. DevTools → Application → Cookies → http://localhost:8080
2. You should see `JSESSIONID` cookie
3. The frontend makes API calls with `withCredentials: true` to include this cookie

---

## Common Issues & Solutions

### Issue: "Access Denied" Error

**Cause:** Email not in database OR is_active = false

**Solution:**
```sql
SELECT * FROM admin_users WHERE email = 'chamudithakarunarathne06@gmail.com';
-- If not found, insert it
-- If found but is_active = false:
UPDATE admin_users SET is_active = true WHERE email = 'chamudithakarunarathne06@gmail.com';
```

### Issue: "Redirect URI mismatch"

**Cause:** Google Cloud Console not configured

**Solution:** Double-check Step 1. The redirect URI MUST be EXACTLY:
```
http://localhost:8080/login/oauth2/code/google
```

### Issue: Stuck on "Loading..." or Frontend Not Redirecting

**Cause:** Frontend .env file not loaded OR servers not restarted

**Solution:**
1. Verify `/sms-uop/.env` exists with VITE_BACKEND_URL
2. Restart frontend: Kill process and run `npm run dev` again
3. Clear browser cache/cookies

### Issue: 401 Unauthorized on /api/admin/user-info

**Cause:** Session cookie not being sent

**Solution:**
- Check API calls have `withCredentials: true` (already configured in api.ts)
- Check cookie `sameSite: lax` in application.yml (already configured)
- Use same domain (localhost) for both frontend and backend

---

## Quick Verification Checklist

Before testing login, verify:

- [ ] Google Cloud Console has redirect URI: `http://localhost:8080/login/oauth2/code/google`
- [ ] File `/sms-uop/.env` exists with VITE_BACKEND_URL and VITE_API_BASE_URL
- [ ] Backend `.env` has correct DB_PASSWORD
- [ ] Database has admin user with YOUR Gmail address
- [ ] admin_users.is_active = true (or 1)
- [ ] Backend server running on port 8080
- [ ] Frontend server running on port 5173
- [ ] Browser cookies cleared OR using Incognito

---

## Test Another Admin User

To add more admin users:

```sql
USE sms_uop;

-- Add another admin
INSERT INTO admin_users (email, full_name, role, is_active, created_at)
VALUES ('another-email@gmail.com', 'Another Admin', 'DEAN', true, NOW())
ON DUPLICATE KEY UPDATE is_active = true;
```

Available roles:
- `VICE_CHANCELLOR` - Full access
- `ASSISTANT_REGISTRAR` - AR specific access
- `DEAN` - Dean specific access (needs faculty column set)
- `STUDENT_SERVICE` - Student service access
- `PREMISES_OFFICER` - Premises access

---

## Still Not Working?

1. **Check backend startup logs** - Look for database connection errors
2. **Check backend login logs** - Should show "🚀 OIDC LOGIN ATTEMPT"
3. **Check frontend console** - Look for network errors
4. **Verify database connection:**
   ```bash
   mysql -u root -pNewStrongPassword123! -e "USE sms_uop; SELECT COUNT(*) FROM admin_users;"
   ```
5. **Check ports are not in use:**
   ```bash
   lsof -i :8080
   lsof -i :5173
   ```

---

## Summary of Files Changed

1. ✅ Created: `/sms-uop/.env` - Frontend environment variables
2. ✅ Updated: `/.env` - Backend database password
3. ✅ Created: `/backend/setup_admin_users.sql` - Admin user setup script
4. ✅ Verified: `/backend/src/main/resources/application.yml` - OAuth config
5. ✅ Verified: Backend SecurityConfig.java - OAuth endpoints
6. ✅ Verified: CustomOidcUserService.java - Email validation logic

All backend code is already correct. The main issue was missing frontend environment variables and Google Cloud Console configuration.
