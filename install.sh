#!/bin/bash
set -e

NODE_VERSION="22.12.0"

# Function to install system dependencies via apt
install_system_deps() {
    if command -v apt-get &> /dev/null; then
        echo "Detected apt-get. Installing system dependencies..."
        local SUDO=""
        if [ "$EUID" -ne 0 ] && command -v sudo &> /dev/null; then
            SUDO="sudo"
        fi

        $SUDO apt-get update
        $SUDO apt-get install -y curl git python3 python3-pip python3-venv
    fi
}

# Function to install nvm
install_nvm() {
    export NVM_DIR="$HOME/.nvm"
    if [ ! -d "$NVM_DIR" ]; then
        echo "Installing nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    fi
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
}

# Function to install uv
install_uv() {
    if ! command -v uv &> /dev/null; then
        echo "Installing uv..."
        curl -LsSf https://astral.sh/uv/install.sh | sh
        # Source the updated PATH
        export PATH="$HOME/.local/bin:$PATH"
    fi
}

# Function to setup Node via nvm
setup_node() {
    echo "Setting up Node.js $NODE_VERSION via nvm..."
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
    nvm alias default $NODE_VERSION
}

echo "=== Setting up Irregular Metrics ==="

install_system_deps

# Install nvm
echo ""
echo "--- Installing nvm ---"
install_nvm

# Install uv
echo ""
echo "--- Installing uv ---"
install_uv

# 1. Frontend Setup
echo ""
echo "--- Frontend Setup ---"
setup_node

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

echo "Syncing backend environment with uv..."
uv sync

cd ..

echo ""
echo "=== Installation Complete! ==="
echo "You can now run the app using ./run.sh"
