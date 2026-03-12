#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Alenkosa — Production Deployment Script
# Run on your Ubuntu VPS as: bash deploy.sh
# ═══════════════════════════════════════════════════════════════

set -e

APP_DIR="/var/www/alenkosa"
REPO_BRANCH="main"

echo "🚀 Deploying Alenkosa..."

cd "$APP_DIR"

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin "$REPO_BRANCH"

# 2. Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# 3. Install Node dependencies and build
echo "🔨 Building frontend..."
npm ci --production=false
npm run build

# 4. Run migrations
echo "🗄️ Running migrations..."
php artisan migrate --force

# 5. Clear and rebuild caches
echo "🧹 Optimizing..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan icons:cache 2>/dev/null || true

# 6. Link storage
php artisan storage:link 2>/dev/null || true

# 7. Restart services
echo "🔄 Restarting services..."
sudo systemctl reload php8.3-fpm
sudo systemctl reload nginx

echo "✅ Deployed successfully!"
echo "🌐 https://alenkosa.id"
