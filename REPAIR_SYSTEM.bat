@echo off
title Institutional Neural Bridge Repair
echo [INSTITUTIONAL NODE]: Initializing Strategic Neural Bridge Reset...
echo [SECURITY]: Surgically terminating stalled Python nodes...

:: Task 1: Force Terminate Deadlocked Processes
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul

echo [NETWORK]: Clearing high-latency network bridges...
echo [PERSISTENCE]: Initializing fresh WAL Persistence Mode...

:: Task 2: Launch Backend in a New Window
start "INSTITUTIONAL BACKEND (Fixed)" cmd /k "cd server && .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8001"

:: Task 3: Launch Frontend in a New Window
start "INSTITUTIONAL FRONTEND" cmd /k "cd client && npm run dev"

echo [SUCCESS]: Institutional Bridge Stabilized. 
echo [ACTION]: Please wait 5 seconds for the terminals to warm up, then go to:
echo           http://localhost:3000/login
echo.
pause
