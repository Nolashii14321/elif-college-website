# Elif College Backend

This is the backend server for Elif College School Management System.

## For Railway Deployment

### Required Environment Variables

Set these in Railway's environment variables:

```
DB_HOST=<from Railway MySQL MYSQLHOST>
DB_USER=<from Railway MySQL MYSQLUSER>
DB_PASSWORD=<from Railway MySQL MYSQLPASSWORD>
DB_NAME=<from Railway MySQL MYSQLDATABASE>
DB_PORT=<from Railway MySQL MYSQLPORT>
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
NODE_ENV=production
PORT=3000
```

### Railway Configuration

- **Root Directory:** `Backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** 18.x or higher

### After Deployment

1. Create admin user using the web interface:
   - Go to: `https://your-app.railway.app/HTML/admin-register.html`
   - Or use Railway MySQL console to insert admin user

2. Access admin panel:
   - URL: `https://your-app.railway.app/HTML/admin-login.html`

## Local Development

```bash
cd Backend
npm install
node server.js
```

Server runs on http://localhost:3000
