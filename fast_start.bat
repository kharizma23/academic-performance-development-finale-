@echo off
echo Starting Student Academic Platform...

:: Start the Backend in a new window
start "Backend (FastAPI)" cmd /k "cd server && venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

:: Wait for backend to initialize (optional, but good for stability)
timeout /t 2 /nobreak >nul

:: Start the Frontend in a new window
start "Frontend (Next.js)" cmd /k "cd client && npm run dev"

echo All services are starting up!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Use Ctrl+C in the respective windows to stop the services.
pause
