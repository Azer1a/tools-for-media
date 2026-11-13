import { setupFileInput } from './common.js';

// Инициализация инпута
setupFileInput('convertInput', 'convertName');

const convertInput = document.getElementById("convertInput");
const convertFormat = document.getElementById("convertFormat");
const convertBtn = document.getElementById("convertBtn");
const convertStatus = document.getElementById("convertStatus");
const convertResult = document.getElementById("convertResult");

convertBtn.addEventListener("click", () => {
    const file = convertInput.files[0];
    if (!file) {
        convertStatus.textContent = "Сначала выберите изображение.";
        return;
    }

    convertResult.innerHTML = "";
    convertStatus.textContent = "Обработка...";
    convertBtn.disabled = true;

    const targetFormat = convertFormat.value;
    const extension = targetFormat === "image/png" ? "png" : "jpg";

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (targetFormat === "image/jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            convertResult.innerHTML = `
                <img src="${url}" style="max-height: 200px; margin-bottom: 1rem; display: block;"><br>
                <a href="${url}" download="converted_image.${extension}" class="btn-download">Скачать ${extension.toUpperCase()}</a>
            `;
            convertStatus.textContent = "Готово!";
            convertBtn.disabled = false;
            URL.revokeObjectURL(objectUrl);
        }, targetFormat, 0.92);
    };

    img.onerror = () => {
        convertStatus.textContent = "Ошибка: Не удалось прочитать файл. Возможно, формат не поддерживается браузером.";
        convertBtn.disabled = false;
        URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
});