@echo off
echo Starting Portfolio System...

start cmd /k "echo Starting Backend... && cd backend && npm run dev"
start cmd /k "echo Starting Admin Panel... && cd admin && npm run dev"
start cmd /k "echo Starting Portfolio Site... && npm run develop"

echo All systems are booting up!
echo Backend: http://localhost:3001
echo Admin: http://localhost:5173
echo Portfolio: http://localhost:8000
