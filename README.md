# Irregular Metrics

A full-stack metrics dashboard application built with FastAPI (Backend) and React/Vite (Frontend).

## Prerequisites

- **Node.js**: Version `22.12.0` or higher.
- **Python**: Version `3.13` or higher.
- **uv** (Optional but recommended): An extremely fast Python package installer and resolver.

## Quick Start

The easiest way to run the application is using the provided helper scripts which handle starting both the backend and frontend servers.

### macOS / Linux
```bash
# First time setup
./install.sh

# Run the app
./run.sh
```

### Windows
```bash
:: First time setup
install.bat

:: Run the app
run.bat
```

Once running, you can access:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)

---

## Database Management

The application uses a SQLite database (`backend/metrics.db`) which is not committed to git. Instead, we use a JSON seed file (`backend/seed_data.json`) to track database state and share data between environments.

### Auto-Seeding
When the application starts, it checks if the database is empty. If it is, it automatically populates the database from `backend/seed_data.json`.

### Managing Data
You can manually export your local database to the seed file or import from it using the CLI tool.

**Export current DB to seed file:**
Use this before committing changes if you've added important data you want to share.
```bash
cd backend
python manage_db.py export
```

**Import seed file to DB:**
Use this to reset your local DB to the state in the seed file.
```bash
cd backend
python manage_db.py import
```

---

## Manual Setup

If you prefer to run services individually or encounter issues with the scripts:

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and run using `uv`:
   ```bash
   uv run uvicorn main:app --reload --port 8000
   ```

   *Alternatively, if using standard pip/venv:*
   ```bash
   # Create and activate virtual environment
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt # (You may need to generate this from pyproject.toml if not present)

   # Run server
   uvicorn main:app --reload --port 8000
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
