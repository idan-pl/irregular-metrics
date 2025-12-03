#!/bin/bash
set -e

# Function to check and setup Node Version
ensure_node_version() {
    local required_version="22.12.0"
    local current_version=$(node -v 2>/dev/null | sed 's/v//')

    if [[ -z "$current_version" ]] || [[ "$current_version" == 21.* ]]; then
        echo "Detected incompatible/missing Node.js version. Checking for nvm..."

        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

        if command -v nvm &> /dev/null; then
            echo "Found nvm. Installing/Using Node version from .nvmrc (or package.json engine)..."
            nvm install 22.12.0
            nvm use 22.12.0
        else
            echo "Warning: nvm not found. Please ensure Node.js 22.12+ is installed."
        fi
    fi
}

echo "=== Setting up Irregular Metrics ==="

# 1. Frontend Setup
echo ""
echo "--- Frontend Setup ---"
ensure_node_version

cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend node_modules already exists. Skipping install (run 'npm install' manually if needed)."
fi
cd ..

# 2. Backend Setup
echo ""
echo "--- Backend Setup ---"
cd backend

if command -v uv &> /dev/null; then
    echo "Found 'uv'. Syncing backend environment..."
    uv sync
else
    echo "'uv' not found. Falling back to standard Python venv..."

    if [ ! -d ".venv" ]; then
        echo "Creating .venv..."
        python3 -m venv .venv
    fi

    source .venv/bin/activate

    echo "Installing dependencies using pip..."
    # Attempt to install from pyproject.toml.
    # If this fails due to missing build-system, we'll fallback to manual list based on current pyproject.toml
    if ! pip install .; then
        echo "Direct pip install failed (likely missing build backend). Installing dependencies manually..."
        pip install "fastapi>=0.123.0" "sqlmodel>=0.0.27" "uvicorn>=0.38.0"
    fi
fi
cd ..

echo ""
echo "=== Installation Complete! ==="
echo "You can now run the app using ./run.sh"
