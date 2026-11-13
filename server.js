const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Разрешаем браузеру использовать SharedArrayBuffer (для FFmpeg)
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

// Отдаём все статические файлы из корня проекта и папки public
app.use(express.static(__dirname));

// Если запрос не найден, отдаём index.html
// ВНИМАНИЕ: Синтаксис зависит от версии Express!
// Для Express 5 (Node.js 24+): app.get('/*splat', ...)
// Для Express 4 (Node.js 20-): app.get('*', ...)
// Закомментировано, так как для локального проекта это не критично.
//app.get('/*splat', (req, res) => {
//    res.sendFile(path.join(__dirname, 'index.html'));
//});

// Запускаем сервер
app.listen(port, () => {
    console.log(`Сервер запущен! Откройте в браузере: http://localhost:${port}`);
});