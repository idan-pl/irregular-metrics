#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p)
}

# Check and Setup Node Version
ensure_node_version() {
    local required_version="22.12.0" # Using 23 as safe bet per .nvmrc
    local current_version=$(node -v 2>/dev/null | sed 's/v//')

    # Simple check if we are on a problematic version (21.x or old 20/22)
    # If node command fails or version is 21.*, try to switch
    if [[ -z "$current_version" ]] || [[ "$current_version" == 21.* ]]; then
        echo "Detected incompatible Node.js version ($current_version). Attempting to switch..."

        # Try to load nvm
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

        if command -v nvm &> /dev/null; then
            echo "Found nvm. Installing/Using Node version from .nvmrc..."
            nvm install
            nvm use
        else
            echo "Warning: nvm not found. Please install Node.js 22.12+ or 23 manually."
        fi
    fi
}

ensure_node_version

trap cleanup EXIT

echo "Starting Backend..."
cd backend
if command -v uv &> /dev/null; then
    uv run uvicorn main:app --reload --port 8000 &
else
    [ -f .venv/bin/activate ] && source .venv/bin/activate
    uvicorn main:app --reload --port 8000 &
fi
BACKEND_PID=$!
cd ..

echo "Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Irregular Metrics is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"

wait
