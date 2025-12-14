#!/bin/bash

echo "=================================="
echo "Admin Login Setup Verification"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check frontend .env
echo "1. Checking frontend .env file..."
if [ -f "sms-uop/.env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env exists"
    if grep -q "VITE_BACKEND_URL" sms-uop/.env; then
        echo -e "${GREEN}✓${NC} VITE_BACKEND_URL configured"
    else
        echo -e "${RED}✗${NC} VITE_BACKEND_URL missing"
    fi
    if grep -q "VITE_API_BASE_URL" sms-uop/.env; then
        echo -e "${GREEN}✓${NC} VITE_API_BASE_URL configured"
    else
        echo -e "${RED}✗${NC} VITE_API_BASE_URL missing"
    fi
else
    echo -e "${RED}✗${NC} Frontend .env does NOT exist"
    echo -e "${YELLOW}  Action: Create sms-uop/.env file${NC}"
fi
echo ""

# Check backend .env
echo "2. Checking backend .env file..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env exists"
    if grep -q "DB_PASSWORD=NewStrongPassword123!" .env; then
        echo -e "${GREEN}✓${NC} DB_PASSWORD configured"
    else
        echo -e "${YELLOW}⚠${NC} DB_PASSWORD may need updating"
    fi
    if grep -q "GOOGLE_CLIENT_ID" .env; then
        echo -e "${GREEN}✓${NC} GOOGLE_CLIENT_ID configured"
    else
        echo -e "${RED}✗${NC} GOOGLE_CLIENT_ID missing"
    fi
    if grep -q "FRONTEND_URL" .env; then
        echo -e "${GREEN}✓${NC} FRONTEND_URL configured"
    else
        echo -e "${RED}✗${NC} FRONTEND_URL missing"
    fi
else
    echo -e "${RED}✗${NC} Backend .env does NOT exist"
fi
echo ""

# Check database connection
echo "3. Checking database connection..."
if command -v mysql &> /dev/null; then
    DB_TEST=$(mysql -u root -pNewStrongPassword123! -e "SELECT 1" 2>&1)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Database connection successful"

        # Check if database exists
        DB_EXISTS=$(mysql -u root -pNewStrongPassword123! -e "SHOW DATABASES LIKE 'sms_uop';" 2>&1 | grep sms_uop)
        if [ ! -z "$DB_EXISTS" ]; then
            echo -e "${GREEN}✓${NC} Database 'sms_uop' exists"

            # Check admin_users table
            TABLE_EXISTS=$(mysql -u root -pNewStrongPassword123! sms_uop -e "SHOW TABLES LIKE 'admin_users';" 2>&1 | grep admin_users)
            if [ ! -z "$TABLE_EXISTS" ]; then
                echo -e "${GREEN}✓${NC} Table 'admin_users' exists"

                # Count admin users
                ADMIN_COUNT=$(mysql -u root -pNewStrongPassword123! sms_uop -e "SELECT COUNT(*) FROM admin_users WHERE is_active = true;" -s -N 2>&1)
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✓${NC} Active admin users: $ADMIN_COUNT"

                    if [ "$ADMIN_COUNT" -eq 0 ]; then
                        echo -e "${YELLOW}  ⚠ No active admin users found!${NC}"
                        echo -e "${YELLOW}  Action: Run backend/setup_admin_users.sql${NC}"
                    else
                        echo ""
                        echo "   Active admins:"
                        mysql -u root -pNewStrongPassword123! sms_uop -e "SELECT email, role, is_active FROM admin_users WHERE is_active = true;" 2>&1
                    fi
                fi
            else
                echo -e "${YELLOW}⚠${NC} Table 'admin_users' does not exist"
                echo -e "${YELLOW}  Action: Start backend server to create tables${NC}"
            fi
        else
            echo -e "${YELLOW}⚠${NC} Database 'sms_uop' does not exist"
            echo -e "${YELLOW}  Action: Start backend server to create database${NC}"
        fi
    else
        echo -e "${RED}✗${NC} Database connection failed"
        echo -e "${YELLOW}  Check DB_PASSWORD in .env file${NC}"
    fi
else
    echo -e "${YELLOW}⚠${NC} MySQL command not found, skipping database check"
fi
echo ""

# Check if ports are available
echo "4. Checking if ports are available..."
if command -v lsof &> /dev/null; then
    PORT_8080=$(lsof -i :8080 2>/dev/null)
    if [ -z "$PORT_8080" ]; then
        echo -e "${YELLOW}⚠${NC} Port 8080 (backend) is free - backend not running"
    else
        echo -e "${GREEN}✓${NC} Port 8080 (backend) is in use - backend running"
    fi

    PORT_5173=$(lsof -i :5173 2>/dev/null)
    if [ -z "$PORT_5173" ]; then
        echo -e "${YELLOW}⚠${NC} Port 5173 (frontend) is free - frontend not running"
    else
        echo -e "${GREEN}✓${NC} Port 5173 (frontend) is in use - frontend running"
    fi
else
    echo -e "${YELLOW}⚠${NC} lsof command not found, skipping port check"
fi
echo ""

# Summary
echo "=================================="
echo "Summary & Next Steps"
echo "=================================="
echo ""
echo "1. Ensure Google Cloud Console is configured:"
echo "   - Redirect URI: http://localhost:8080/login/oauth2/code/google"
echo "   - Go to: https://console.cloud.google.com/apis/credentials"
echo ""
echo "2. Add your Gmail to database:"
echo "   mysql -u root -pNewStrongPassword123! sms_uop < backend/setup_admin_users.sql"
echo ""
echo "3. Restart servers (if running):"
echo "   Backend:  cd backend && ./mvnw spring-boot:run"
echo "   Frontend: cd sms-uop && npm run dev"
echo ""
echo "4. Test login:"
echo "   http://localhost:5173/admin/login"
echo ""
echo "=================================="
