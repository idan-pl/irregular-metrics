@echo off
setlocal

echo === Setting up Irregular Metrics ===

:: 1. Frontend Setup
echo.
echo --- Frontend Setup ---
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend node_modules already exists. Skipping install.
)
cd ..

:: 2. Backend Setup
echo.
echo --- Backend Setup ---
cd backend

where uv >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Found 'uv'. Syncing backend environment...
    call uv sync
) else (
    echo 'uv' not found. Falling back to standard Python venv...

    if not exist .venv (
        echo Creating .venv...
        python -m venv .venv
    )

    call .venv\Scripts\activate

    echo Installing dependencies using pip...
    :: Attempt pip install .
    pip install . 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Direct pip install failed. Installing dependencies manually...
        pip install "fastapi>=0.123.0" "sqlmodel>=0.0.27" "uvicorn>=0.38.0"
    )
)
cd ..

echo.
echo === Installation Complete! ===
echo You can now run the app using run.bat
endlocal
