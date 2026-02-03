#!/bin/bash
set -e

# Cloudflare Tunnel Setup for Irregular Metrics
# Gives you a free HTTPS URL like: https://random-words.trycloudflare.com

cd "$(dirname "$0")/.."

echo "=== Irregular Metrics with Cloudflare Tunnel ==="

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "Installing cloudflared..."

    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
        sudo dpkg -i cloudflared.deb
        rm cloudflared.deb
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install cloudflared
    else
        echo "Please install cloudflared manually:"
        echo "https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/"
        exit 1
    fi
fi

# Build frontend for production
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Cleanup on exit
cleanup() {
    echo "Stopping backend..."
    kill $BACKEND_PID 2>/dev/null || true
}
trap cleanup EXIT

# Start backend (serves both API and frontend static files)
echo "Starting backend..."
cd backend
uv run uvicorn main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
cd ..

sleep 2

echo ""
echo "Starting Cloudflare Tunnel..."
echo "=========================================="
echo "Your HTTPS URL will appear below (look for 'https://*.trycloudflare.com')"
echo "=========================================="
echo ""

cloudflared tunnel --url http://localhost:8000
