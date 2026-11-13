import { removeBackground } from "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm";
import { setupFileInput } from './common.js';

// Инициализация инпута
setupFileInput('fileInput', 'fileName');

const fileInput = document.getElementById("fileInput");
const removeBtn = document.getElementById("removeBtn");
const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("status");

removeBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
        statusDiv.textContent = "Сначала выберите изображение.";
        return;
    }

    resultDiv.innerHTML = "";
    statusDiv.textContent = "Загрузка модели и обработка... (первый раз может занять время)";

    try {
        const blob = await removeBackground(file, {
            publicPath: window.location.origin + "/public/isnet/",
            model: "isnet_fp16",
            progress: (key, current, total) => {
                if (total > 0) {
                    const percent = Math.round((current / total) * 100);
                    statusDiv.textContent = `Загрузка: ${key} — ${percent}%`;
                }
            }
        });

        const url = URL.createObjectURL(blob);
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Результат без фона";
        resultDiv.appendChild(img);

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "no-bg.png";
        downloadLink.textContent = "Скачать PNG";
        downloadLink.className = "btn-download";
        resultDiv.appendChild(downloadLink);

        statusDiv.textContent = "Готово.";
    } catch (error) {
        console.error(error);
        statusDiv.textContent = "Ошибка: " + error.message;
    }
});