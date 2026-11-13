@echo off
cd /d "%~dp0"
title Server Video Tools

:: Открываем браузер (он откроется параллельно)
start http://localhost:3000

:: Запускаем сервер
node server.js