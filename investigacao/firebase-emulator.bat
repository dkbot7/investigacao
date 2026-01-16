@echo off
echo ========================================
echo FIREBASE EMULATOR - INVESTIGAREE
echo ========================================
echo.
echo Starting Firebase Auth Emulator...
echo - Auth Emulator: http://127.0.0.1:9099
echo - Emulator UI: http://127.0.0.1:4000
echo.
echo Press Ctrl+C to stop the emulator
echo ========================================
echo.

npx firebase emulators:start --only auth
