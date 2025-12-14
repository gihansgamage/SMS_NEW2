# Admin Login - Quick Fix

## The Problem
Your admin login fails because **Google Cloud Console doesn't have the correct redirect URI**.

## The Solution (5 Minutes)

### Step 1: Fix Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

1. Find your OAuth Client ID
2. Click the **edit** button (pencil icon)
3. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
4. Click **SAVE**

### Step 2: Add Your Email to Database

Open MySQL and run:

```sql
USE sms_uop;

INSERT INTO admin_users (email, full_name, role, is_active, created_at)
VALUES ('chamudithakarunarathne06@gmail.com', 'Admin', 'VICE_CHANCELLOR', true, NOW())
ON DUPLICATE KEY UPDATE is_active = true;

-- Verify it worked
SELECT email, role, is_active FROM admin_users;
```

### Step 3: Restart Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Step 4: Test Login

1. Go to: http://localhost:5173/admin/login
2. Click "Sign in with Google"
3. Choose: `chamudithakarunarathne06@gmail.com`
4. ✅ Should work now!

---

## That's It!

The key issue is the redirect URI. Google needs to know where to send users after login.

**Spring Boot expects:** `http://localhost:8080/login/oauth2/code/google`

If it's still not working, check the detailed guide: `ADMIN_LOGIN_FIX.md`
