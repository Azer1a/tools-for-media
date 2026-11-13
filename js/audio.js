import { FFmpeg } from "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/+esm";
import { fetchFile, toBlobURL } from "https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.2/+esm";
import { setupFileInput } from './common.js';

// Инициализация инпута
setupFileInput('videoInput', 'videoName');

const videoInput = document.getElementById("videoInput");
const extractBtn = document.getElementById("extractBtn");
const videoStatus = document.getElementById("videoStatus");
const videoResult = document.getElementById("videoResult");
const audioFormatSelect = document.getElementById("audioFormat");

let ffmpeg = null;

async function loadFFmpeg() {
    if (ffmpeg) return ffmpeg;
    videoStatus.textContent = "Загрузка FFmpeg (первый раз может занять время)...";
    ffmpeg = new FFmpeg();
    const baseURL = window.location.origin + '/public/ffmpeg';
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        classWorkerURL: `${baseURL}/worker.js`
    });
    videoStatus.textContent = "FFmpeg готов к работе.";
    return ffmpeg;
}

extractBtn.addEventListener("click", async () => {
    const file = videoInput.files[0];
    if (!file) {
        videoStatus.textContent = "Сначала выберите видеофайл.";
        return;
    }

    videoResult.innerHTML = "";
    extractBtn.disabled = true;
    const format = audioFormatSelect.value;

    try {
        const ff = await loadFFmpeg();
        videoStatus.textContent = "Чтение видеофайла...";
        await ff.writeFile('input.mp4', await fetchFile(file));
        videoStatus.textContent = "Извлечение аудио...";

        let outputFileName = '';
        let mimeType = '';
        if (format === 'mp3') {
            outputFileName = 'output.mp3';
            mimeType = 'audio/mpeg';
            await ff.exec(['-i', 'input.mp4', '-vn', '-acodec', 'libmp3lame', '-q:a', '2', outputFileName]);
        } else {
            outputFileName = 'output.m4a';
            mimeType = 'audio/mp4';
            await ff.exec(['-i', 'input.mp4', '-vn', '-acodec', 'copy', outputFileName]);
        }
        
        videoStatus.textContent = "Создание файла...";
        const data = await ff.readFile(outputFileName);
        const blob = new Blob([data.buffer], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        videoResult.innerHTML = `
            <audio controls src="${url}" style="margin-bottom: 1rem;"></audio><br>
            <a href="${url}" download="extracted_audio.${format}" class="btn-download">Скачать аудиофайл (.${format})</a>
        `;
        videoStatus.textContent = "Готово!";
    } catch (error) {
        console.error(error);
        videoStatus.textContent = "Ошибка: " + error.message;
    } finally {
        extractBtn.disabled = false;
    }
});