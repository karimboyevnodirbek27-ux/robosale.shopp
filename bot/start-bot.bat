@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   RoboSale Telegram bot
echo ========================================
echo.

if not exist node_modules (
    echo node_modules topilmadi, npm install bajarilmoqda...
    call npm install
)

node bot.js

echo.
echo Bot to'xtadi. Qayta ishga tushirish uchun istalgan tugmani bosing.
pause >nul
