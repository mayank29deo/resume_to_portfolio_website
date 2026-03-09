@echo off
cd /d "C:\Users\test\OneDrive\Desktop\resume-to-portfolio"
echo Installing dependencies...
npm install --no-audit --no-fund --legacy-peer-deps
echo Done. Exit code: %ERRORLEVEL%
