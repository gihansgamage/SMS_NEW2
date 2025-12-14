# 🚀 Quick Start - Society Management System (MySQL Version)

## ⚡ Get Running in 5 Steps

### 1️⃣ Install MySQL 8.0

**Check if MySQL is installed:**
```bash
mysql --version
```

**If not installed:**
- **Windows**: Download from https://dev.mysql.com/downloads/installer/
- **macOS**: `brew install mysql@8.0 && brew services start mysql@8.0`
- **Linux**: `sudo apt update && sudo apt install mysql-server`

### 2️⃣ Create Database

**Run the SQL script:**
```bash
# Navigate to project root
cd /path/to/project

# Create database and tables
mysql -u root -p < backend/src/main/resources/database_setup.sql
```

**Verify database created:**
```bash
mysql -u root -p -e "USE sms_uop; SHOW TABLES;"
```

You should see 11 tables created with 14 admin users pre-loaded.

### 3️⃣ Update `.env` File

Open `.env` file and update these values:

```env
# MySQL Configuration (REQUIRED)
DB_PASSWORD=your_mysql_root_password

# Google OAuth (REQUIRED)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Email Configuration (REQUIRED)
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Get Google OAuth Credentials:**
- Go to: https://console.cloud.google.com/
- Create OAuth 2.0 Client ID
- Add redirect URI: `http://localhost:8080/login/oauth2/code/google`

**Get Gmail App Password:**
- Go to: https://myaccount.google.com/apppasswords
- Generate 16-character app password

### 4️⃣ Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

✅ **Backend running at**: http://localhost:8080

**Expected output:**
```
Environment variables loaded from .env file
HikariPool-1 - Start completed
Tomcat started on port(s): 8080 (http)
Started SmsUopApplication
```

### 5️⃣ Start Frontend

**Open new terminal** (keep backend running):

```bash
cd sms-uop
npm install
npm run dev
```

✅ **Frontend running at**: http://localhost:5173

## 🎯 Test the Application

### Public Features
- Open: http://localhost:5173
- Browse societies
- Try registration form
- Submit event permission

### Admin Panel
- Open: http://localhost:5173/admin/login
- Login with: `gihansgamage@gmail.com` (or any authorized email)
- View dashboard
- Test approval workflows

## 📋 Pre-configured Admin Users

| Email | Role | Faculty |
|-------|------|---------|
| gihansgamage@gmail.com | Vice Chancellor | - |
| gihansanjaya2001@gmail.com | Deputy VC | - |
| gsgamage4@gmail.com | Assistant Registrar | - |
| mathscrewyt@gmail.com | Premises Officer | - |
| sooslemr@gmail.com | Student Service | - |
| dean.eng@pdn.ac.lk | Dean | Engineering |
| s20369@sci.pdn.ac.lk | Dean | Science |
| dean.med@pdn.ac.lk | Dean | Medicine |

*(9 faculty deans total - see database_setup.sql for complete list)*

## 🔧 Troubleshooting

### MySQL Connection Issues

**Problem**: "Access denied for user 'root'@'localhost'"
```bash
Solution:
1. Check MySQL root password
2. Update DB_PASSWORD in .env
3. Test: mysql -u root -p
```

**Problem**: "Unknown database 'sms_uop'"
```bash
Solution: Run the SQL script:
mysql -u root -p < backend/src/main/resources/database_setup.sql
```

**Problem**: MySQL not running
```bash
# Check status
sudo systemctl status mysql  # Linux
brew services list           # macOS

# Start MySQL
sudo systemctl start mysql   # Linux
brew services start mysql@8.0 # macOS
```

### Backend Issues

**Problem**: "Could not load .env file"
```
Solution:
- Ensure .env file is in project root (not in backend folder)
- Check file permissions
```

**Problem**: "Port 8080 already in use"
```bash
# Linux/macOS
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### OAuth/Email Issues

**Problem**: OAuth login fails
```
Solution:
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
- Check redirect URI in Google Console
- Must use email from admin_users table
```

**Problem**: Emails not sending
```
Solution:
- Use app password, not regular Gmail password
- Enable 2FA on Gmail first
- Generate new app password
```

## ✅ What's Included

- ✅ MySQL database with 11 tables
- ✅ 14 pre-configured admin users
- ✅ Complete approval workflows (Dean → AR → VC)
- ✅ Event permission workflow (Dean → Premises → AR → VC)
- ✅ Email notifications at each approval step
- ✅ PDF generation for applications
- ✅ Activity logging system
- ✅ Google OAuth authentication
- ✅ Input validation

## 📊 Database Schema

### Core Tables (6)
1. **admin_users** - System administrators
2. **societies** - Registered societies registry
3. **society_registration_applications** - New registrations
4. **society_renewals** - Annual renewals
5. **event_permissions** - Event permission requests
6. **activity_logs** - System audit trail

### Supporting Tables (5)
7. **registration_advisory_board**
8. **registration_committee_members**
9. **registration_general_members**
10. **registration_planning_events**
11. **renewal_committee_members**

## 🎯 Key Features

### Registration Process
1. Applicant fills registration form
2. Dean approval (faculty-specific)
3. Assistant Registrar approval
4. Vice Chancellor approval
5. Email notifications at each step
6. PDF download available

### Renewal Process
1. Select existing society from dropdown
2. Data auto-fills from previous year
3. Same approval workflow as registration
4. Can modify any fields

### Event Permission Process
1. Select registered society
2. Verify applicant position matches society records
3. Approval workflow: Dean → Premises → AR → VC
4. Email notifications to all parties

### Admin Panel Features
- **Dashboard**: Statistics, upcoming events
- **Approvals**: Role-based approval queues
- **Societies**: View/filter all societies
- **Events**: Manage event permissions
- **Communication**: Email society officials
- **Activity Logs**: Complete audit trail
- **User Management**: Add/manage admins (AR only)
- **Monitoring**: View all activities (Student Service)

## 📚 Full Documentation

- `DATABASE_SETUP.md` - Complete MySQL setup guide
- `backend/README.md` - Backend configuration
- `README.md` - Complete system overview
- `IMPLEMENTATION_SUMMARY.md` - Technical details

## 🎉 Quick Command Reference

```bash
# Check MySQL
mysql --version
mysql -u root -p -e "SHOW DATABASES;"

# Create database
mysql -u root -p < backend/src/main/resources/database_setup.sql

# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend (new terminal)
cd sms-uop
npm install
npm run dev

# Access
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
# Admin: http://localhost:5173/admin/login
```

## 🚀 Next Steps

1. ✅ Install MySQL 8.0
2. ✅ Create database with SQL script
3. ✅ Update .env with credentials
4. ✅ Start backend
5. ✅ Start frontend
6. ✅ Login and test!

---

**Need detailed help?** Check `DATABASE_SETUP.md` for comprehensive MySQL setup instructions.
