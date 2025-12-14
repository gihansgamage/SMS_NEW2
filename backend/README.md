# Society Management System Backend - University of Peradeniya

## Overview
Spring Boot backend for the Society Management System (SMS-UOP) at the University of Peradeniya.

## Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0
- **Security**: Spring Security with OAuth2 (Google)
- **Email**: Spring Mail
- **PDF Generation**: iText 7
- **Build Tool**: Maven

## Prerequisites
- Java 17 or higher
- MySQL 8.0
- Maven 3.6+
- Google OAuth2 credentials

## Setup Instructions

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE sms_uop;

-- Create user (optional)
CREATE USER 'sms_user'@'localhost' IDENTIFIED BY 'sms_password';
GRANT ALL PRIVILEGES ON sms_uop.* TO 'sms_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Environment Variables
Create a `.env` file or set environment variables:

```bash
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
EMAIL_USERNAME=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Google OAuth2 Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth2 credentials
5. Add authorized redirect URIs:
   - `http://localhost:8080/login/oauth2/code/google`
   - `http://localhost:8080/api/auth/success`

### 4. Gmail App Password
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password for the application
3. Use this app password in EMAIL_PASSWORD

### 5. Run the Application
```bash
# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## API Endpoints

### Public Endpoints
- `GET /api/societies/public` - Get all societies (paginated)
- `GET /api/societies/public/{id}` - Get society by ID
- `POST /api/societies/register` - Register new society
- `POST /api/societies/renew` - Renew existing society
- `POST /api/events/request` - Request event permission

### Admin Endpoints (Requires Authentication)
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/pending-approvals` - Get pending approvals
- `POST /api/admin/approve-registration/{id}` - Approve registration
- `POST /api/admin/reject-registration/{id}` - Reject registration
- `POST /api/admin/approve-event/{id}` - Approve event
- `GET /api/admin/activity-logs` - Get activity logs
- `POST /api/admin/send-email` - Send bulk emails

### File Endpoints
- `GET /api/files/download/registration/{id}` - Download registration PDF
- `GET /api/files/download/event/{id}` - Download event permission PDF
- `GET /api/files/export/societies` - Export societies to Excel

## Database Schema

### Key Tables
- `societies` - Final approved societies
- `society_registrations` - Temporary table for approval process
- `society_renewals` - Society renewal applications
- `event_permissions` - Event permission requests
- `admin_users` - System administrators
- `activity_logs` - System activity tracking

### Approval Workflow
1. **Registration/Renewal**: Dean → Assistant Registrar → Vice Chancellor
2. **Event Permission**: Assistant Registrar → Vice Chancellor

## Security Features
- Google OAuth2 authentication for admin users
- Role-based access control
- CORS configuration for frontend integration
- Input validation and sanitization
- SQL injection prevention through JPA

## Email Notifications
- Registration/renewal confirmations
- Approval workflow notifications
- Rejection notifications with reasons
- Bulk communication system

## PDF Generation
- Professional application forms with university branding
- Digital signatures and approval sections
- Downloadable certificates

## Development Notes

### Adding New Admin Users
Admin users are managed through the database. Only Assistant Registrars can add new admin users through the admin panel.

### Faculty Configuration
The system supports 9 faculties as defined in the requirements. Each dean is associated with their specific faculty.

### Year-wise Data Management
All data is tracked by academic year for proper historical records and filtering.

### Activity Logging
All significant actions are logged with user information, timestamps, and details for audit purposes.

## Production Deployment

### Environment Configuration
- Use environment-specific application.yml files
- Configure proper database connection pooling
- Set up SSL/TLS for secure communication
- Configure email server settings

### Security Hardening
- Use strong database passwords
- Implement rate limiting
- Add request logging
- Configure firewall rules
- Regular security updates

### Monitoring
- Add application monitoring (e.g., Micrometer + Prometheus)
- Database performance monitoring
- Email delivery monitoring
- Error tracking and alerting

## Integration with Frontend
The React frontend should make API calls to these endpoints. Update the frontend's API service to point to `http://localhost:8080/api` instead of using localStorage.

## Testing
```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify
```

## Support
For technical support or questions about the system, contact the development team or refer to the Spring Boot documentation.