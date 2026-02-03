#!/bin/bash
set -e

# Configuration - EDIT THESE
DOMAIN="irregular-services.duckdns.org"
EMAIL="YOUR_EMAIL@example.com"
APP_DIR="/var/www/meh-trics"

echo "=== Irregular Metrics Production Setup ==="
echo "Domain: $DOMAIN"
echo "App directory: $APP_DIR"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo ./setup.sh)"
    exit 1
fi

# Update system
echo "Updating system packages..."
apt update && apt upgrade -y

# Install dependencies
echo "Installing dependencies..."
apt install -y nginx certbot python3-certbot-nginx python3 python3-venv python3-pip nodejs npm curl

# Install uv (not available in apt)
if ! command -v uv &> /dev/null; then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi

# Create app directory
echo "Setting up application directory..."
mkdir -p $APP_DIR
mkdir -p /var/www/certbot

# Copy application files (assumes you've cloned/uploaded the repo)
if [ ! -d "$APP_DIR/backend" ]; then
    echo "ERROR: Please copy your application to $APP_DIR first"
    echo "  git clone YOUR_REPO $APP_DIR"
    exit 1
fi

# Build frontend
echo "Building frontend..."
cd $APP_DIR/frontend
npm install
npm run build

# Setup backend
echo "Setting up backend..."
cd $APP_DIR/backend
uv venv
uv pip install -r requirements.txt 2>/dev/null || uv pip install fastapi uvicorn sqlmodel

# Setup nginx config
echo "Configuring nginx..."
cp $APP_DIR/deploy/nginx.conf /etc/nginx/sites-available/meh-trics
sed -i "s/YOUR_DOMAIN.com/$DOMAIN/g" /etc/nginx/sites-available/meh-trics
ln -sf /etc/nginx/sites-available/meh-trics /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Start nginx first (needed for webroot challenge)
systemctl restart nginx

# Get SSL certificate using webroot method (--keep-until-expiring makes it idempotent)
echo "Obtaining SSL certificate..."
certbot certonly --webroot -w /var/www/certbot -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --keep-until-expiring

# Create systemd service for backend
echo "Creating systemd service..."
cat > /etc/systemd/system/meh-trics.service << EOF
[Unit]
Description=Irregular Metrics Backend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=$APP_DIR/backend
ExecStart=$APP_DIR/backend/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Set permissions
chown -R www-data:www-data $APP_DIR

# Enable and start services
systemctl daemon-reload
systemctl enable meh-trics
systemctl restart meh-trics
systemctl restart nginx

# Setup auto-renewal for SSL (only add if not already present)
echo "Setting up SSL auto-renewal..."
CRON_JOB="0 3 * * * certbot renew --quiet && systemctl reload nginx"
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "$CRON_JOB") | crontab -

echo ""
echo "=== Setup Complete ==="
echo "Your app is now running at https://$DOMAIN:8433"
echo ""
echo "Useful commands:"
echo "  systemctl status meh-trics    # Check backend status"
echo "  systemctl restart meh-trics   # Restart backend"
echo "  journalctl -u meh-trics -f    # View backend logs"
echo "  nginx -t && systemctl reload nginx  # Reload nginx config"
