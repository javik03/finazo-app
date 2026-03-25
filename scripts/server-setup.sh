#!/bin/bash
# Finazo server setup script for Hetzner Cloud (Ubuntu 24.04 LTS)
# Run this on a fresh Ubuntu server as root to prepare for Finazo deployment
# Usage: bash server-setup.sh

set -e  # Exit on any error

REPO_URL="https://github.com/YOUR_ORG/finazo-app.git"
DEPLOY_PATH="/opt/finazo"
DOMAIN="finazo.lat"
EMAIL="your-email@example.com"  # For Let's Encrypt

echo "================================"
echo "Finazo Server Setup"
echo "================================"
echo "Domain: $DOMAIN"
echo "Deploy path: $DEPLOY_PATH"
echo "Email: $EMAIL"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Error: This script must be run as root"
  exit 1
fi

# ===== Update system =====
echo "[1/8] Updating system packages..."
apt-get update
apt-get upgrade -y

# ===== Install Docker =====
echo "[2/8] Installing Docker..."
apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify Docker installation
docker --version
docker compose version

# ===== Install Nginx =====
echo "[3/8] Installing Nginx..."
apt-get install -y nginx

# Start and enable Nginx
systemctl enable nginx
systemctl start nginx

# ===== Install Certbot (Let's Encrypt) =====
echo "[4/8] Installing Certbot for SSL..."
apt-get install -y certbot python3-certbot-nginx

# ===== Create deploy directory =====
echo "[5/8] Creating deployment directory..."
mkdir -p "$DEPLOY_PATH"
cd "$DEPLOY_PATH"

# ===== Clone repository =====
echo "[6/8] Cloning Finazo repository..."
if [ ! -d "$DEPLOY_PATH/.git" ]; then
  git clone "$REPO_URL" .
else
  echo "Repository already cloned, pulling latest changes..."
  git pull origin master
fi

# ===== Setup .env.production =====
echo "[7/8] Creating .env.production..."
if [ ! -f "$DEPLOY_PATH/.env.production" ]; then
  cat > "$DEPLOY_PATH/.env.production" << EOF
# Database
DATABASE_URL=postgresql://finazo:GENERATE_SECURE_PASSWORD_HERE@localhost:5432/finazo
POSTGRES_PASSWORD=GENERATE_SECURE_PASSWORD_HERE

# Claude API
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE

# Webhook secret (generate a random string, min 16 chars)
ARTICLE_WEBHOOK_SECRET=YOUR_RANDOM_SECRET_HERE

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Affiliate IDs (optional)
WISE_AFFILIATE_ID=
REMITLY_AFFILIATE_ID=
EOF
  echo "WARNING: .env.production created with placeholder values"
  echo "Edit $DEPLOY_PATH/.env.production with real secrets before starting containers"
else
  echo ".env.production already exists, skipping creation"
fi

# ===== Install Nginx configuration =====
echo "[8/8] Setting up Nginx configuration..."
cp "$DEPLOY_PATH/nginx/finazo.conf" /etc/nginx/sites-available/finazo.conf
ln -sf /etc/nginx/sites-available/finazo.conf /etc/nginx/sites-enabled/finazo.conf
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
nginx -t

# ===== Get SSL certificate =====
echo ""
echo "Requesting SSL certificate from Let's Encrypt..."
echo "(Make sure DNS is pointing to this server before proceeding)"
echo ""

# Create certbot directory
mkdir -p /var/www/certbot

# Request certificate (standalone mode, then switch to nginx)
certbot certonly \
  --webroot \
  -w /var/www/certbot \
  --non-interactive \
  --agree-tos \
  -m "$EMAIL" \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --cert-name "$DOMAIN"

# Reload Nginx with SSL config
systemctl reload nginx

# ===== Setup auto-renewal =====
echo "Setting up Let's Encrypt auto-renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer

# ===== Build and start Docker containers =====
echo ""
echo "Building and starting Docker containers..."
cd "$DEPLOY_PATH"

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Build and start
docker compose pull
docker compose up -d --build

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Edit $DEPLOY_PATH/.env.production with real API keys"
echo "2. Verify SSL: curl https://$DOMAIN/"
echo "3. Check app logs: docker compose logs -f app"
echo "4. Set up GitHub Actions secrets in your repo:"
echo "   - HETZNER_SSH_KEY (private SSH key for 'deploy' user)"
echo "   - HETZNER_USER (usually 'root' or 'deploy')"
echo ""
echo "App running at: https://$DOMAIN"
echo "Database: PostgreSQL on localhost:5432"
echo ""
