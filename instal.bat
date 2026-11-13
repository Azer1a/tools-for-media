@echo off
cd /d "%~dp0"
title Installing dependencies

echo Проверка наличия Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ОШИБКА] Node.js не найден!
    echo Пожалуйста, установите Node.js с официального сайта: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js найден. Установка зависимостей...
call npm install

if %errorlevel% equ 0 (
    echo.
    echo [УСПЕХ] Все зависимости установлены!
    echo Теперь вы можете запустить проект через start.bat
) else (
    echo.
    echo [ОШИБКА] Не удалось установить зависимости.
)

pause