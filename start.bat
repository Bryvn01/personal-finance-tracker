@echo off
echo Starting Finance Tracker Application...
echo.
echo Installing dependencies if needed...
call npm run install-all
echo.
echo Starting both backend and frontend servers...
echo Backend will run on http://localhost:5001
echo Frontend will run on http://localhost:3001
echo.
call npm run dev