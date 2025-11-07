#!/bin/bash
# Backend/scripts/deploy.sh
# Production deployment script for Elif College

set -e

echo "🚀 Starting Elif College deployment..."

# Configuration
APP_NAME="elif-college-api"
BACKUP_DIR="/var/backups/elif-college"
LOG_DIR="/var/log/elif-college"
APP_DIR="/var/www/elif-college"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Create necessary directories
print_status "Creating directories..."
mkdir -p $BACKUP_DIR
mkdir -p $LOG_DIR
mkdir -p $APP_DIR

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    npm install -g pm2
fi

# Install dependencies
print_status "Installing dependencies..."
cd $APP_DIR
npm install --production

# Create backup before deployment
print_status "Creating database backup..."
node scripts/backup.js

# Set proper permissions
print_status "Setting permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
chmod 600 $APP_DIR/.env

# Start/restart application with PM2
print_status "Starting application with PM2..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Setup log rotation
print_status "Setting up log rotation..."
cat > /etc/logrotate.d/elif-college << EOF
$LOG_DIR/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Setup firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    print_status "Configuring firewall..."
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
fi

# Setup SSL with Let's Encrypt (if certbot is available)
if command -v certbot &> /dev/null; then
    print_warning "SSL setup available. Run: certbot --nginx -d yourdomain.com"
fi

# Health check
print_status "Performing health check..."
sleep 5
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
else
    print_error "❌ Application health check failed!"
    exit 1
fi

# Display status
print_status "Deployment completed successfully!"
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "📝 Logs location: $LOG_DIR"
echo "💾 Backups location: $BACKUP_DIR"
echo "🌐 Application URL: http://localhost:3000"
echo ""
print_warning "Don't forget to:"
echo "1. Update DNS records to point to this server"
echo "2. Setup SSL certificate with Let's Encrypt"
echo "3. Configure your domain in the .env file"
echo "4. Update Google Analytics ID in HTML files"


