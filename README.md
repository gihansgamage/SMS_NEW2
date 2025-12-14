# University of Peradeniya - Society Management System

A comprehensive web-based system for managing student societies, including registration, renewal, event permissions, and multi-stage approval workflows.

## 🎯 System Overview

This system enables:
- **New Society Registration** with multi-stage approval
- **Annual Society Renewal** process
- **Event Permission Requests** with facility management
- **Admin Panel** with role-based access control
- **Email Notifications** at each approval stage
- **PDF Generation** for applications
- **Complete Audit Trail** of all activities

## 🏗️ Technology Stack

- **Frontend:** React 18 + Vite + TailwindCSS
- **Backend:** Spring Boot 3.2.6 + Java 17
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Google OAuth2
- **Email:** SMTP (Gmail)

## ✅ What's Been Implemented

### Backend
- ✅ Complete database schema (15+ tables)
- ✅ PostgreSQL/Supabase integration
- ✅ All JPA entities properly configured
- ✅ Full approval workflow logic
- ✅ Email notification service
- ✅ PDF generation service
- ✅ Activity logging service
- ✅ REST API controllers
- ✅ Google OAuth2 authentication
- ✅ Role-based access control

### Database
- ✅ All tables created in Supabase
- ✅ Row Level Security enabled
- ✅ Proper indexes for performance
- ✅ Pre-populated admin users
- ✅ Unique constraints and relationships

### Security
- ✅ Google OAuth2 configured
- ✅ Role-based authorization
- ✅ Protected admin endpoints
- ✅ Activity logging for auditing

## 🚀 Quick Start

### Prerequisites

Ensure you have:
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- Git

### Step 1: Configure Credentials

Edit `.env` in the project root:

```env
# Google OAuth (⚠️ REQUIRED - Add your credentials)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Email Config (⚠️ REQUIRED - Add your credentials)
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
STUDENT_SERVICE_EMAIL=studentservice@pdn.ac.lk

# Database (✅ Already configured)
DB_URL=jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
DB_USERNAME=postgres.nizbwzjcycuwureorahc
DB_PASSWORD=SMS-UOP-Database-2024

# Frontend (✅ Already configured)
VITE_SUPABASE_URL=https://nizbwzjcycuwureorahc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# URLs (✅ Already configured)
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:8080
```

**How to get Google OAuth credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `http://localhost:8080/login/oauth2/code/google`

**How to get Gmail app password:**
1. Enable 2-Factor Authentication
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate password for "Mail"

### Step 2: Run Backend

```bash
cd backend

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8080`

### Step 3: Run Frontend

```bash
cd sms-uop

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 📋 Approval Workflows

### Society Registration & Renewal
```
1. Applicant submits application
2. Faculty Dean reviews → Approve/Reject
3. Assistant Registrar reviews → Approve/Reject
4. Vice Chancellor reviews → Approve/Reject
5. ✓ Approved or ✗ Rejected
```

### Event Permission
```
1. Applicant submits request
2. Faculty Dean reviews → Approve/Reject
3. Premises Officer reviews → Approve/Reject
4. Assistant Registrar reviews → Approve/Reject
5. Vice Chancellor reviews → Approve/Reject
6. ✓ Approved or ✗ Rejected
```

## 👥 Pre-configured Admin Users

These users can login immediately once you configure Google OAuth:

| Role | Email | Access Level |
|------|-------|--------------|
| Vice Chancellor | gihansgamage@gmail.com | Full (except User Management) |
| Deputy VC | gihansanjaya2001@gmail.com | Full (except User Management) |
| Assistant Registrar | gsgamage4@gmail.com | **Super Admin** (Full Access) |
| Premises Officer | mathscrewyt@gmail.com | Events + Basic |
| Student Service | sooslemr@gmail.com | Monitoring + Basic |
| Dean Science | s20369@sci.pdn.ac.lk | Faculty-specific |
| Other Deans | dean.*@pdn.ac.lk | Faculty-specific |

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Complete technical documentation
- **[backend/README.md](backend/README.md)** - Backend-specific documentation

## 🔧 Configuration Files

- `.env` - Environment variables (add your credentials here)
- `backend/src/main/resources/application.yml` - Spring Boot configuration
- `backend/pom.xml` - Maven dependencies
- `sms-uop/vite.config.ts` - Frontend build configuration

## 🗄️ Database Schema

### Main Tables
- `admin_users` - System administrators
- `societies` - Registered societies (master)
- `society_registration_applications` - New registrations
- `society_renewals` - Annual renewals
- `event_permissions` - Event requests
- `activity_logs` - System audit trail

### Supporting Tables
- `registration_advisory_board`, `registration_committee_members`, etc.
- `renewal_committee_members`, `renewal_planning_events`, etc.

## 🔐 Security Features

- ✅ Google OAuth2 authentication
- ✅ Role-based access control
- ✅ Database-verified authorized users (`is_active = TRUE`)
- ✅ Protected admin endpoints
- ✅ Complete activity logging
- ✅ Row Level Security in Supabase

## 📧 Email Notifications

Automated emails are sent:
- ✅ To applicant at each approval stage
- ✅ To senior treasurer on status changes
- ✅ From Student Service Division official email
- ✅ With clear approval/rejection status

## 📄 PDF Generation

System generates PDFs for:
- ✅ Society registration applications
- ✅ Renewal applications
- ✅ Event permission requests
- ✅ Standardized format with all details

## 🎨 Frontend Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Multi-step forms with validation
- ✅ Real-time field validation
- ✅ Search and filter societies
- ✅ Dashboard statistics
- ✅ Role-based UI rendering

## 🧪 Testing

### Test Public Features
1. Open `http://localhost:5173`
2. Browse societies
3. Submit registration form
4. View statistics

### Test Admin Features
1. Go to `http://localhost:5173/admin/login`
2. Login with Google (use authorized email)
3. View dashboard
4. Check pending approvals
5. Approve/reject applications

## 🐛 Troubleshooting

### Backend won't start
- Verify Java 17: `java -version`
- Check port 8080 is available
- Verify database credentials in `.env`

### OAuth login fails
- Check Google credentials in `.env`
- Verify redirect URI in Google Console
- Ensure email is in `admin_users` table

### Emails not sending
- Use Gmail app password (not regular password)
- Enable 2FA on Gmail account
- Verify SMTP settings

### Database connection issues
- Check internet connection
- Verify Supabase credentials
- Test connection: `psql "postgresql://postgres.nizbwzjcycuwureorahc@..."`

## 📊 Admin Panel Tabs

### Dashboard
- System statistics
- Upcoming events
- Recent activities
- Quick actions

### Approvals
- Pending items (role-filtered)
- Application details
- Approve/reject actions
- Comment/reason input

### Societies
- All registered societies
- Filter by year, status, faculty
- View complete details
- Search functionality

### Events
- Past and upcoming events
- Event permissions list
- Approval status

### Communication
- Send emails to societies
- Filter by position
- Bulk email capability

### Activity Logs
- Complete audit trail
- Filter by user, action
- Detailed logging

### User Management (AR only)
- Add/edit admin users
- Toggle active status
- Assign roles and faculties

### Monitoring (Student Service)
- Read-only view of all processes
- System-wide visibility
- No approval actions

## 🔄 Society Status Management

| Status | Meaning |
|--------|---------|
| `PENDING` | In approval workflow |
| `ACTIVE` | Approved and current |
| `INACTIVE` | Not renewed for current year |

Societies are uniquely identified by (name, year) combination.

## 📈 Next Steps

1. **Immediate:**
   - [ ] Add Google OAuth credentials to `.env`
   - [ ] Add Email credentials to `.env`
   - [ ] Start backend: `mvn spring-boot:run`
   - [ ] Start frontend: `npm run dev`
   - [ ] Test login with authorized email

2. **Testing:**
   - [ ] Submit test registration
   - [ ] Test approval workflow
   - [ ] Verify email notifications
   - [ ] Test PDF generation
   - [ ] Check activity logs

3. **Customization:**
   - [ ] Update faculty dean emails
   - [ ] Customize email templates
   - [ ] Adjust PDF formatting
   - [ ] Update Student Service contact

4. **Production:**
   - [ ] Set up production Supabase
   - [ ] Configure production URLs
   - [ ] Enable HTTPS
   - [ ] Set up monitoring
   - [ ] Configure backups

## 📞 Support

For issues:
1. Check `SETUP_GUIDE.md` for detailed instructions
2. Review `IMPLEMENTATION_SUMMARY.md` for technical details
3. Check application logs
4. Verify environment configuration

## 📝 License

University of Peradeniya - Student Service Division

---

## ⚡ Quick Command Reference

```bash
# Backend
cd backend
mvn clean install      # Build project
mvn spring-boot:run    # Start backend
mvn test              # Run tests

# Frontend
cd sms-uop
npm install           # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production

# Database
# Check Supabase dashboard at:
# https://supabase.com/dashboard
```

---

**System Status:** ✅ Ready to Deploy

All components are implemented and ready. Just add your credentials and start the servers!
