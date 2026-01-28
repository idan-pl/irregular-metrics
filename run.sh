#!/bin/bash

# Change to the script's directory
cd "$(dirname "$0")"

# Function to kill background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p)
}

# Load nvm and use the correct node version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22.12.0

trap cleanup EXIT

echo "Starting Backend..."
cd backend
uv run uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

echo "Starting Frontend..."
cd frontend
npm run dev -- --host &
FRONTEND_PID=$!
cd ..

echo "Irregular Metrics is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"

wait
