export function setupFileInput(inputId, nameId) {
    const input = document.getElementById(inputId);
    const nameSpan = document.getElementById(nameId);

    if (!input || !nameSpan) return;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            nameSpan.textContent = e.target.files[0].name;
            nameSpan.style.color = "var(--text-main)";
        } else {
            nameSpan.textContent = "Файл не выбран";
            nameSpan.style.color = "var(--text-muted)";
        }
    });
}