// js/app.js
import { ROM_DATA, ROM_MAP } from './rom.js';
import { switchToTab, renderMiniGrid, updateMetrics } from './ui.js';
import { generateCppContent } from './generator.js';
import { state, loadLibrary, saveLibrary, clearLibrary } from './state.js';

// --- INIT ---
function init() {
    loadLibrary();
    setupEventListeners();
    setupMatrix();
    if (!document.getElementById('userInput').value) {
    };
    analyzeText(); // First run
}

function setupEventListeners() {
    document.getElementById('userInput').addEventListener('input', analyzeText);
    
    document.getElementById('debugToggle').addEventListener('change', (e) => {
        document.body.classList.toggle('debug-mode', e.target.checked);
    });

    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            // Передаємо колбек, що робити при перемиканні
            switchToTab(tab.dataset.target, (tabId) => {
                if (tabId === 'tab-code') updateCodeView();
            });
        });
    });
    
    // Глобальний доступ до кнопок (бо onclick в HTML не бачить модулі)
    window.clearMatrix = clearMatrix;
    window.invertMatrix = invertMatrix;
    window.saveGlyph = saveGlyph;
    window.clearLibraryAction = clearLibraryAction;
    window.copyCode = copyCode;
}

// --- LOGIC ---

function analyzeText() {
    const text = document.getElementById('userInput').value;
    const display = document.getElementById('display');
    display.innerHTML = '';
    
    let usedRamChars = new Set();
    
    for (let char of text) {
        let wrapper = document.createElement('div');
        let mappedChar = ROM_MAP[char]; 
        let isRom = !!mappedChar && ROM_DATA[mappedChar];
        let isRam = !!state.ramLibrary[char];
        
        if (isRom) {
            wrapper.className = 'char-box char-rom';
            wrapper.title = `Built-in: ${mappedChar}`;
            wrapper.appendChild(renderMiniGrid(ROM_DATA[mappedChar]));
        }
        else if (isRam) {
            wrapper.className = 'char-box char-custom';
            wrapper.title = `Custom RAM: ${char}`;
            wrapper.onclick = () => editChar(char);
            wrapper.appendChild(renderMiniGrid(state.ramLibrary[char]));
            usedRamChars.add(char);
        }
        else {
            // Missing/Error
            let code = char.charCodeAt(0);
            if (code < 128 && !isRom) {
                 wrapper.className = 'char-box char-rom'; 
                 wrapper.innerText = char; 
            } else {
                wrapper.className = 'char-box char-missing';
                wrapper.innerText = char;
                wrapper.onclick = () => createChar(char);
                usedRamChars.add(char);
            }
        }
        display.appendChild(wrapper);
    }

    updateMetrics(usedRamChars.size);
    generateLibraryView();
}

// --- EDITOR ACTIONS ---

function createChar(char) {
    switchToTab('tab-editor');
    state.currentEditingChar = char;
    updatePreviewTitle(char);
    clearMatrix();
}

function editChar(char) {
    switchToTab('tab-editor');
    state.currentEditingChar = char;
    updatePreviewTitle(char);

    const data = state.ramLibrary[char];
    if (!data) { clearMatrix(); return; }

    const pixels = document.querySelectorAll('.pixel');
    for (let row = 0; row < 8; row++) {
        let byte = data[row];
        for (let col = 0; col < 5; col++) {
            let isSet = (byte >> (4 - col)) & 1;
            let pxIndex = row * 5 + col;
            if (pixels[pxIndex]) {
                pixels[pxIndex].classList.toggle('active', isSet);
            }
        }
    }
}

function saveGlyph() {
    if (!state.currentEditingChar) {
        alert("Select a character first!");
        return;
    }

    let bytes = [];
    const pixels = document.querySelectorAll('.pixel');

    for (let row = 0; row < 8; row++) {
        let byte = 0;
        for (let col = 0; col < 5; col++) {
            let pxIndex = row * 5 + col;
            if (pixels[pxIndex] && pixels[pxIndex].classList.contains('active')) {
                byte |= (1 << (4 - col));
            }
        }
        bytes.push(byte);
    }

    state.ramLibrary[state.currentEditingChar] = bytes;
    saveLibrary();
    analyzeText();
    
    // Feedback animation
    const btn = document.querySelector('.editor-sidebar .primary');
    const oldText = btn.innerText;
    btn.innerText = "Saved!";
    setTimeout(() => btn.innerText = oldText, 800);
}

// --- HELPERS ---

function updatePreviewTitle(char) {
    const el = document.getElementById('editorCharPreview');
    if (el) {
        el.innerText = char;
        el.classList.remove('highlight-char');
        void el.offsetWidth;
        el.classList.add('highlight-char');
    }
}

function setupMatrix() {
    const matrix = document.getElementById('pixelMatrix');
    matrix.innerHTML = '';
    for (let i = 0; i < 40; i++) {
        let px = document.createElement('div');
        px.className = 'pixel';
        px.onclick = function() { this.classList.toggle('active'); };
        matrix.appendChild(px);
    }
}

function clearMatrix() { 
    document.querySelectorAll('.pixel').forEach(p => p.classList.remove('active')); 
}

function invertMatrix() { 
    document.querySelectorAll('.pixel').forEach(p => p.classList.toggle('active')); 
}

function updateCodeView() {
    const content = generateCppContent(state.ramLibrary);
    document.getElementById('cppOutput').value = content.arrayCode;
    document.getElementById('codeFooter').innerHTML = content.usageCode;
}

function copyCode() {
    document.getElementById('cppOutput').select();
    document.execCommand('copy');
    alert("Copied!");
}

function clearLibraryAction() {
    if (clearLibrary()) analyzeText();
}

function generateLibraryView() {
    const grid = document.getElementById('libraryGrid');
    const chars = Object.keys(state.ramLibrary);
    
    if (chars.length === 0) {
        grid.innerHTML = '<p style="color:#666">Library is empty.</p>';
        return;
    }
    
    grid.innerHTML = '';
    chars.forEach(char => {
        let container = document.createElement('div');
        container.style.cursor = 'pointer';
        container.style.display = 'inline-block';
        container.style.margin = '5px';
        container.onclick = () => editChar(char);
        
        let visual = document.createElement('div');
        visual.className = 'char-box char-custom';
        visual.style.width = '20px'; visual.style.height = '32px';
        visual.appendChild(renderMiniGrid(state.ramLibrary[char]));
        
        container.appendChild(visual);
        grid.appendChild(container);
    });
}

// Start app
init();