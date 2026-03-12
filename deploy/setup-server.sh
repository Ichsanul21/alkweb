#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Alenkosa — VPS Initial Setup Script
# Run ONCE on a fresh Ubuntu 22.04/24.04 VPS
# Usage: bash setup-server.sh
# ═══════════════════════════════════════════════════════════════

set -e

DOMAIN="alenkosa.id"
APP_DIR="/var/www/alenkosa"
DB_NAME="alenkosa"
DB_USER="alenkosa_user"
DB_PASS="CHANGE_THIS_PASSWORD"

echo "🖥️  Setting up server for $DOMAIN..."

# ── 1. System Update ────────────────────────────────────────
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# ── 2. Install Nginx ────────────────────────────────────────
echo "🌐 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx

# ── 3. Install PHP 8.3 ─────────────────────────────────────
echo "🐘 Installing PHP 8.3..."
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y php8.3-fpm php8.3-cli php8.3-mysql php8.3-mbstring \
    php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath php8.3-gd \
    php8.3-intl php8.3-readline php8.3-tokenizer
sudo systemctl enable php8.3-fpm

# ── 4. Install MySQL ───────────────────────────────────────
echo "🗄️  Installing MySQL..."
sudo apt install -y mysql-server
sudo systemctl enable mysql

# Create database and user
sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';"
sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
echo "✅ MySQL database '$DB_NAME' created"

# ── 5. Install Composer ────────────────────────────────────
echo "📦 Installing Composer..."
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# ── 6. Install Node.js 22 ──────────────────────────────────
echo "📦 Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# ── 7. Setup App Directory ──────────────────────────────────
echo "📁 Setting up app directory..."
sudo mkdir -p "$APP_DIR"
sudo chown -R $USER:www-data "$APP_DIR"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "  1. Clone your repo:  cd $APP_DIR && git clone <repo-url> ."
echo "  2. Copy .env:        cp .env.example .env"
echo "  3. Edit .env:        nano .env  (set DB credentials below)"
echo ""
echo "     DB_DATABASE=$DB_NAME"
echo "     DB_USERNAME=$DB_USER"
echo "     DB_PASSWORD=$DB_PASS"
echo ""
echo "  4. Run:  composer install --no-dev --optimize-autoloader"
echo "  5. Run:  php artisan key:generate"
echo "  6. Run:  npm ci && npm run build"
echo "  7. Run:  php artisan migrate --seed"
echo "  8. Run:  php artisan storage:link"
echo "  9. Copy nginx config:"
echo "     sudo cp deploy/nginx.conf /etc/nginx/sites-available/$DOMAIN"
echo "     sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/"
echo "     sudo rm -f /etc/nginx/sites-enabled/default"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "  10. Get SSL:"
echo "     sudo apt install -y certbot python3-certbot-nginx"
echo "     sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "  11. Set permissions:"
echo "     sudo chown -R $USER:www-data $APP_DIR"
echo "     sudo chmod -R 775 $APP_DIR/storage $APP_DIR/bootstrap/cache"
echo ""
echo "═══════════════════════════════════════════════════════"
