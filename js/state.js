// js/state.js

export const state = {
    ramLibrary: {},
    currentEditingChar: null
};

export function loadLibrary() {
    const saved = localStorage.getItem('lcd_ram_lib');
    if (saved) state.ramLibrary = JSON.parse(saved);
}

export function saveLibrary() {
    localStorage.setItem('lcd_ram_lib', JSON.stringify(state.ramLibrary));
}

export function clearLibrary() {
    if(confirm("Delete all custom glyphs?")) {
        state.ramLibrary = {};
        localStorage.removeItem('lcd_ram_lib');
        return true;
    }
    return false;
}