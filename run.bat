@echo off
echo Starting Backend...
start "Backend" cmd /k "cd backend && call .venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo Meh-trics is running!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
