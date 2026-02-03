// js/generator.js

export function transliterate(char) {
    const map = {
        'а':'a', 'б':'b', 'в':'v', 'г':'h', 'ґ':'g', 'д':'d', 'е':'e', 
        'є':'ye', 'ж':'zh', 'з':'z', 'и':'y', 'і':'i', 'ї':'yi', 'й':'j', 
        'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o', 'п':'p', 'р':'r', 
        'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'kh', 'ц':'ts', 'ч':'ch', 
        'ш':'sh', 'щ':'shch', 'ь':'soft', 'ю':'yu', 'я':'ya',
        'А':'A', 'Б':'B', 'В':'V', 'Г':'H', 'Ґ':'G', 'Д':'D', 'Е':'E',
        'Є':'YE', 'Ж':'ZH', 'З':'Z', 'И':'Y', 'І':'I', 'Ї':'YI', 'Й':'J',
        'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O', 'П':'P', 'Р':'R',
        'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Х':'KH', 'Ц':'TS', 'Ч':'CH',
        'Ш':'SH', 'Щ':'SHCH', 'Ь':'SOFT', 'Ю':'YU', 'Я':'YA'
    };
    
    let trans = map[char] || (char.match(/[a-z0-9]/i) ? char : 'SYM');
    return trans.toUpperCase();
}

// Helper to get UTF-8 HEX code (e.g., 'ч' -> 0xD187)
function getUtf8Hex(char) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(char);
    
    // Cyrillic chars in UTF-8 are usually 2 bytes
    if (bytes.length === 2) {
        // Merge bytes: High Byte << 8 | Low Byte
        const val = (bytes[0] << 8) | bytes[1];
        return "0x" + val.toString(16).toUpperCase();
    }
    // ASCII or single byte
    if (bytes.length === 1) {
         return "0x" + bytes[0].toString(16).toUpperCase();
    }
    return "0x0000"; // Fallback
}

export function generateCppContent(ramLibrary) {
    const chars = Object.keys(ramLibrary);
    
    if (chars.length === 0) {
        return {
            arrayCode: "// Create symbols to generate code.",
            usageCode: "// Table will appear here"
        };
    }

    // 1. Glyphs.h Header
    let fullCode = `#ifndef GLYPHS_H
#define GLYPHS_H

#include <Arduino.h>

// Struct for Mapping: Char Code -> Pixel Array
struct CustomGlyphMap {
    uint16_t code;      // UTF-8 code (e.g. 0xD187)
    const uint8_t* ptr; // Pointer to GLYPH_... array
};

// ==========================================
// GENERATED GLYPHS
// ==========================================
`;

    let mapEntries = "";

    chars.forEach((char, idx) => {
        let safeName = "GLYPH_" + transliterate(char);
        let bytes = ramLibrary[char];
        let hexCode = getUtf8Hex(char);
        
        // Generate byte array
        fullCode += `// Symbol '${char}' (UTF-8: ${hexCode})\n`;
        fullCode += `const uint8_t ${safeName}[] PROGMEM = {\n`;
        bytes.forEach((b, i) => {
            let bin = '0b' + b.toString(2).padStart(5, '0');
            fullCode += `  ${bin}${i<7?',':''}\n`;
        });
        fullCode += `};\n\n`;
        
        // Add entry to map
        mapEntries += `    { ${hexCode}, ${safeName} }, // ${char}\n`;
    });

    // 2. Add Automatic Mapping Table
    fullCode += `// ==========================================
// AUTOMATIC MAPPING TABLE
// ==========================================
const CustomGlyphMap CUSTOM_MAP[] = {
${mapEntries}};

// Map length for loops
const uint8_t CUSTOM_MAP_LEN = sizeof(CUSTOM_MAP) / sizeof(CUSTOM_MAP[0]);

#endif // GLYPHS_H`;

    let usageHint = `// Copy everything from the left panel to Glyphs.h\n// And use LcdStringParser in your sketch.`;

    return { arrayCode: fullCode, usageCode: usageHint };
}