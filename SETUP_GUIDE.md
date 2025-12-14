# Society Management System - Complete Setup Guide

## System Overview

This Society Management System (SMS) is built for the University of Peradeniya to manage:
- New society registrations
- Annual society renewals
- Event permission requests
- Multi-stage approval workflows
- Admin panel with role-based access

**Technology Stack:**
- **Frontend**: React with Vite
- **Backend**: Spring Boot 3.2.6 with Java 17
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Google OAuth2
- **Email**: SMTP (Gmail recommended)

---

## Database Setup

### Supabase Database (Already Configured)

Your Supabase instance is **already provisioned** and the database schema has been created with all required tables:

**Tables Created:**
- `admin_users` - System administrators
- `societies` - Registered societies
- `society_registration_applications` - Registration requests
- `society_renewals` - Renewal requests
- `event_permissions` - Event permission requests
- `activity_logs` - System audit logs
- Supporting tables for members, committees, advisory boards, etc.

**Connection Details** (in `.env`):
```
DB_URL=jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
DB_USERNAME=postgres.nizbwzjcycuwureorahc
DB_PASSWORD=SMS-UOP-Database-2024
```

---

## Required Configuration

### 1. Google OAuth2 Setup

You need to configure Google OAuth for admin panel login:

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   ```
   http://localhost:8080/login/oauth2/code/google
   http://localhost:8080/api/auth/callback
   ```
7. Copy the Client ID and Client Secret

**Update `.env` file:**
```env
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

### 2. Email Configuration

Configure Gmail SMTP for sending approval notifications:

**Steps:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Copy the 16-character password

**Update `.env` file:**
```env
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
STUDENT_SERVICE_EMAIL=studentservice@pdn.ac.lk
```

**Important:** Use the Student Service Division official email as the sender.

---

## Environment Variables

Your `.env` file should contain:

```env
# Frontend (Supabase client)
VITE_SUPABASE_URL=https://nizbwzjcycuwureorahc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend Database
DB_URL=jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
DB_USERNAME=postgres.nizbwzjcycuwureorahc
DB_PASSWORD=SMS-UOP-Database-2024

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
STUDENT_SERVICE_EMAIL=studentservice@pdn.ac.lk

# URLs
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:8080
```

---

## Running the Application

### Backend (Spring Boot)

```bash
cd backend

# Install dependencies and compile
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend (React)

```bash
cd sms-uop

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## System Features

### Approval Workflows

**Registration & Renewal:**
1. Dean (Faculty-specific) → Approve/Reject
2. Assistant Registrar → Approve/Reject
3. Vice Chancellor/Deputy VC → Approve/Reject
4. Final approval → Society registered/renewed

**Event Permission:**
1. Dean (Faculty-specific) → Approve/Reject
2. Premises Officer → Approve/Reject
3. Assistant Registrar → Approve/Reject
4. Vice Chancellor/Deputy VC → Approve/Reject
5. Final approval → Event approved

### Admin Panel Access

**Login:** Only users in `admin_users` table with `is_active = TRUE` can log in via Google OAuth.

**Pre-configured Admins:**
- Vice Chancellor: gihansgamage@gmail.com
- Deputy VC: gihansanjaya2001@gmail.com
- Assistant Registrar: gsgamage4@gmail.com
- Premises Officer: mathscrewyt@gmail.com
- Student Service: sooslemr@gmail.com
- 9 Faculty Deans (dean.*.@pdn.ac.lk)

**Role-Based Access:**
- **Assistant Registrar**: Full access (all tabs)
- **VC/Deputy VC**: Dashboard, Approvals, Societies, Events, Communication, Activity Logs
- **Faculty Deans**: Dashboard, Approvals (faculty-specific), Societies, Events, Communication, Activity Logs
- **Premises Officer**: Dashboard, Approvals (events only), Societies, Events, Communication, Activity Logs
- **Student Service**: Dashboard, Societies, Events, Communication, Activity Logs, Monitoring (read-only)

### Email Notifications

Automated emails are sent at each approval stage to:
- Applicant
- Senior Treasurer
- Relevant approvers

All emails are sent from the Student Service Division official email.

---

## API Endpoints

### Public Endpoints

```
GET  /api/societies/public          - List all societies (with filters)
GET  /api/societies/public/{id}     - Get society details
GET  /api/societies/statistics      - Society statistics
POST /api/societies/register        - Submit registration
POST /api/societies/renew           - Submit renewal
POST /api/events/request            - Submit event permission
POST /api/societies/preview-pdf     - Generate PDF preview
```

### Admin Endpoints (Requires Authentication)

```
GET  /api/admin/dashboard              - Dashboard statistics
GET  /api/admin/pending-approvals      - Get pending approvals
POST /api/admin/approve-registration/{id} - Approve registration
POST /api/admin/reject-registration/{id}  - Reject registration
POST /api/admin/approve-renewal/{id}      - Approve renewal
POST /api/admin/reject-renewal/{id}       - Reject renewal
POST /api/admin/approve-event/{id}        - Approve event
POST /api/admin/reject-event/{id}         - Reject event
GET  /api/admin/activity-logs          - Get activity logs
POST /api/admin/send-communication     - Send emails to societies
```

---

## Data Validation

**Email Validation:**
- Must be valid format
- University emails required for officials
- Email verified at submission

**Registration Number:**
- Normalized (ignore case, spaces, slashes)
- Validated against society records for event permissions

**Mobile Numbers:**
- Numeric validation
- Length validation

**Required Fields:**
- All marked fields must be filled
- Decline reasons required when rejecting

---

## Society Status Management

**Status Values:**
- `PENDING`: In approval workflow
- `ACTIVE`: Fully approved and current
- `INACTIVE`: Not renewed for current year

**Year-based Tracking:**
- Societies are tracked by year
- Unique constraint on (society_name, year)
- Filter by year and status

**Approval Flags:**
- `dean_approved = 1`
- `ar_approved = 1`
- `vc_approved = 1`
- All three must be TRUE for approval

---

## Troubleshooting

### Backend won't start
- Check PostgreSQL connection in `.env`
- Verify Java 17 is installed: `java -version`
- Check port 8080 is available

### OAuth login fails
- Verify Google OAuth credentials in `.env`
- Check redirect URIs in Google Console
- Ensure admin email exists in `admin_users` table

### Emails not sending
- Verify Gmail app password is correct
- Check SMTP settings in application.yml
- Enable "Less secure app access" if needed

### Database connection issues
- Verify Supabase credentials
- Check internet connection
- Test connection string

---

## Security Considerations

1. **Never commit sensitive data** to version control
2. **Use environment variables** for all secrets
3. **Enable SSL** for production deployments
4. **Rotate credentials** periodically
5. **Monitor activity logs** for suspicious activity
6. **Implement rate limiting** in production
7. **Use HTTPS** for all production traffic

---

## Production Deployment

### Backend
1. Build: `mvn clean package`
2. Deploy JAR to server
3. Configure production database
4. Set up reverse proxy (Nginx)
5. Enable SSL/TLS
6. Configure environment variables

### Frontend
1. Update API URLs in code
2. Build: `npm run build`
3. Deploy dist/ folder
4. Configure CDN/hosting
5. Set up domain

### Database
- Supabase handles scaling automatically
- Configure backups
- Monitor query performance

---

## Support

For technical issues:
1. Check application logs
2. Review error messages
3. Verify configuration
4. Check database connectivity

For system questions:
- Refer to this guide
- Check Spring Boot documentation
- Review Supabase documentation

---

## System Architecture

```
Frontend (React)
      ↓
Backend API (Spring Boot)
      ↓
Supabase (PostgreSQL)

Email Service (SMTP) ←→ Backend
Google OAuth ←→ Backend
```

**Data Flow:**
1. User submits application (Frontend)
2. Backend validates and stores (Database)
3. Approval workflow initiated
4. Email notifications sent
5. Admin approves/rejects
6. Status updated
7. Final notifications sent

---

## Next Steps

1. ✅ Database schema created
2. ✅ Spring Boot configured
3. ⏳ Configure Google OAuth credentials
4. ⏳ Configure Email credentials
5. ⏳ Test backend startup
6. ⏳ Test frontend connection
7. ⏳ Test complete workflow

Once you've configured Google OAuth and Email, you're ready to test the complete system!
