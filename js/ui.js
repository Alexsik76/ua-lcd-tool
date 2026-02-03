// js/ui.js

/**
 * Перемикання вкладок
 */
export function switchToTab(tabId, callback) {
    document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    const link = document.querySelector(`[data-target="${tabId}"]`);
    const content = document.getElementById(tabId);
    
    if (link) link.classList.add('active');
    if (content) content.classList.add('active');

    // Якщо треба виконати дію після перемикання (наприклад, згенерувати код)
    if (callback) callback(tabId);
}

/**
 * Створює DOM-елемент міні-сітки 5x8 для відображення
 */
export function renderMiniGrid(bytes) {
    let grid = document.createElement('div');
    grid.className = 'mini-grid';
    
    for (let row = 0; row < 8; row++) {
        let byte = bytes[row];
        for (let col = 0; col < 5; col++) {
            let px = document.createElement('div');
            px.className = 'mini-pixel';
            
            // Читаємо біт
            let isSet = (byte >> (4 - col)) & 1;
            if (isSet) px.classList.add('on');
            
            grid.appendChild(px);
        }
    }
    return grid;
}

/**
 * Оновлює прогрес-бар RAM
 */
export function updateMetrics(count) {
    const bar = document.getElementById('ramBar');
    const txt = document.getElementById('ramText');
    const msg = document.getElementById('statusMsg');
    
    bar.value = count;
    txt.innerText = `${count}/8`;
    
    if (count > 8) {
        msg.innerText = "OVERFLOW";
        msg.style.color = "var(--error-color)"; // Червоний
    } else {
        msg.innerText = "RAM OK"; // Трохи більш технічний текст
        msg.style.color = "#4caf50"; // Яскравий зелений (активний стан)
    }
}