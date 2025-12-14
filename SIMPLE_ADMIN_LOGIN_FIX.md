# Simple Admin Login Fix - 3 Steps

## What Was Wrong
1. Frontend missing `.env` file with backend URL
2. Google Cloud Console needs redirect URI
3. Your Gmail needs to be in the database

## What I Fixed
✅ Created `sms-uop/.env` with backend URLs
✅ Updated root `.env` with correct database password
✅ Created `backend/setup_admin_users.sql` for easy database setup

---

## You Need To Do (3 Steps)

### Step 1: Google Cloud Console (2 minutes)

Go to: https://console.cloud.google.com/apis/credentials

1. Find your OAuth Client ID (the one starting with 918615763678)
2. Click **Edit**
3. Under "Authorized redirect URIs", add:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
4. Click **SAVE**
5. Wait 1 minute for changes to take effect

### Step 2: Add Your Email to Database

Run this command:
```bash
mysql -u root -pNewStrongPassword123! sms_uop -e "
INSERT INTO admin_users (email, full_name, role, is_active, created_at)
VALUES ('chamudithakarunarathne06@gmail.com', 'Admin', 'VICE_CHANCELLOR', true, NOW())
ON DUPLICATE KEY UPDATE is_active = true;
SELECT * FROM admin_users;
"
```

Or use the SQL file:
```bash
cd /tmp/cc-agent/61369615/project/backend
mysql -u root -pNewStrongPassword123! sms_uop < setup_admin_users.sql
```

### Step 3: Restart Both Servers

**Terminal 1 - Backend:**
```bash
cd /tmp/cc-agent/61369615/project/backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd /tmp/cc-agent/61369615/project/sms-uop
npm run dev
```

---

## Test It

1. Go to: http://localhost:5173/admin/login
2. Click "Sign in with Google"
3. Login with: `chamudithakarunarathne06@gmail.com`
4. Should work! ✅

---

## If Still Not Working

Run this test script:
```bash
cd /tmp/cc-agent/61369615/project
./test-admin-setup.sh
```

It will check:
- Frontend .env file
- Backend .env file
- Database connection
- Admin users in database
- Running servers

---

## What Changed In Your Project

1. **Created:** `sms-uop/.env`
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_BACKEND_URL=http://localhost:8080
   ```

2. **Updated:** `.env` (root)
   ```env
   DB_PASSWORD=NewStrongPassword123!
   ```

3. **Created:** `backend/setup_admin_users.sql`
   - SQL script to easily add admin users

4. **Verified:** All backend OAuth code is correct
   - SecurityConfig.java ✓
   - CustomOidcUserService.java ✓
   - AdminController.java ✓

---

## Add More Admin Users

```sql
INSERT INTO admin_users (email, full_name, role, is_active, created_at)
VALUES ('another@gmail.com', 'Another Admin', 'DEAN', true, NOW());
```

Roles available:
- `VICE_CHANCELLOR` - Full access
- `ASSISTANT_REGISTRAR` - AR access
- `DEAN` - Dean access
- `STUDENT_SERVICE` - Student service
- `PREMISES_OFFICER` - Premises

---

## Why It Failed Before

The frontend was calling:
```javascript
window.location.href = `${backendUrl}/oauth2/authorization/google`
```

But `backendUrl` was **undefined** because there was no `.env` file!

Now with `.env` file created, it correctly redirects to `http://localhost:8080/oauth2/authorization/google`.

---

## Need More Help?

See detailed guide: `ADMIN_LOGIN_COMPLETE_FIX.md`
