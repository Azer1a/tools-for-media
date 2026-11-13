import { setupFileInput } from './common.js';

// Инициализация инпута
setupFileInput('eraserInput', 'eraserName');

const eraserInput = document.getElementById("eraserInput");
const eraserCanvas = document.getElementById("eraserCanvas");
const eraserMode = document.getElementById("eraserMode");
const brushSize = document.getElementById("brushSize");
const saveEraserBtn = document.getElementById("saveEraserBtn");
const eraserStatus = document.getElementById("eraserStatus");
const canvasContainer = document.getElementById("canvasContainer");
const brushCursor = document.getElementById("brushCursor");
const colorTools = document.getElementById("colorTools");
const pickerBtn = document.getElementById("pickerBtn");
const colorPicker = document.getElementById("colorPicker");

let ctxEraser = eraserCanvas.getContext("2d");
let isDrawing = false;
let originalImage = null;
let isPickingColor = false;
let customColor = "#ff0000";

function updateBrushCursor() {
    if (!brushCursor) return;
    const size = brushSize.value;
    brushCursor.style.width = size + "px";
    brushCursor.style.height = size + "px";
}
updateBrushCursor();
brushSize.addEventListener("input", updateBrushCursor);

eraserMode.addEventListener("change", () => {
    if (eraserMode.value === "custom") {
        colorTools.style.display = "flex";
    } else {
        colorTools.style.display = "none";
        isPickingColor = false;
        pickerBtn.style.backgroundColor = "";
    }
});

pickerBtn.addEventListener("click", () => {
    isPickingColor = !isPickingColor;
    if (isPickingColor) {
        pickerBtn.style.backgroundColor = "#ccc";
        eraserStatus.textContent = "Пипетка активна. Кликните по картинке, чтобы взять цвет.";
    } else {
        pickerBtn.style.backgroundColor = "";
        eraserStatus.textContent = "Пипетка выключена.";
    }
});

colorPicker.addEventListener("input", (e) => {
    customColor = e.target.value;
    isPickingColor = false;
    pickerBtn.style.backgroundColor = "";
    setBrush();
});

eraserInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
        eraserCanvas.width = img.width;
        eraserCanvas.height = img.height;
        ctxEraser.clearRect(0, 0, eraserCanvas.width, eraserCanvas.height);
        ctxEraser.drawImage(img, 0, 0);
        originalImage = img;
        saveEraserBtn.disabled = false;
        eraserStatus.textContent = "Картинка загружена. Зажмите мышь и водите по лишним местам.";
    };
    img.src = URL.createObjectURL(file);
});

function setBrush() {
    ctxEraser.lineWidth = brushSize.value;
    ctxEraser.lineCap = "round";
    ctxEraser.lineJoin = "round";

    if (eraserMode.value === "transparent") {
        ctxEraser.globalCompositeOperation = "destination-out";
        ctxEraser.strokeStyle = "rgba(0,0,0,1)";
    } else if (eraserMode.value === "white") {
        ctxEraser.globalCompositeOperation = "source-over";
        ctxEraser.strokeStyle = "#FFFFFF";
    } else if (eraserMode.value === "custom") {
        ctxEraser.globalCompositeOperation = "source-over";
        ctxEraser.strokeStyle = customColor;
    }
}

canvasContainer.addEventListener("mousemove", (e) => {
    if (!originalImage && eraserInput.files.length === 0) return;
    if (eraserMode.value === "custom" && isPickingColor) {
        brushCursor.style.display = "none";
        eraserCanvas.style.cursor = "crosshair";
        return;
    }
    eraserCanvas.style.cursor = "none";
    brushCursor.style.display = "block";
    const rect = canvasContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    brushCursor.style.left = (x - brushSize.value / 2) + "px";
    brushCursor.style.top = (y - brushSize.value / 2) + "px";
});

canvasContainer.addEventListener("mouseleave", () => {
    brushCursor.style.display = "none";
});

eraserCanvas.addEventListener("click", (e) => {
    if (eraserMode.value === "custom" && isPickingColor) {
        const rect = eraserCanvas.getBoundingClientRect();
        const scaleX = eraserCanvas.width / rect.width;
        const scaleY = eraserCanvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        const pixel = ctxEraser.getImageData(x, y, 1, 1).data;
        
        customColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        colorPicker.value = "#" + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
        
        eraserStatus.textContent = `Выбран цвет: ${customColor}. Пипетка выключена, можете рисовать.`;
        isPickingColor = false;
        pickerBtn.style.backgroundColor = "";
        eraserCanvas.style.cursor = "none";
        setBrush();
    }
});

eraserCanvas.addEventListener("mousedown", (e) => {
    if (eraserMode.value === "custom" && isPickingColor) return; 
    isDrawing = true;
    setBrush();
    const rect = eraserCanvas.getBoundingClientRect();
    const scaleX = eraserCanvas.width / rect.width;
    const scaleY = eraserCanvas.height / rect.height;
    ctxEraser.beginPath();
    ctxEraser.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctxEraser.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctxEraser.stroke();
});

eraserCanvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const rect = eraserCanvas.getBoundingClientRect();
    const scaleX = eraserCanvas.width / rect.width;
    const scaleY = eraserCanvas.height / rect.height;
    ctxEraser.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctxEraser.stroke();
});

eraserCanvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctxEraser.beginPath();
});

eraserCanvas.addEventListener("mouseleave", () => {
    isDrawing = false;
    ctxEraser.beginPath();
});

saveEraserBtn.addEventListener("click", () => {
    const url = eraserCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited_image.png";
    a.click();
});