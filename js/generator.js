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

export function generateCppContent(ramLibrary) {
    const chars = Object.keys(ramLibrary);
    
    if (chars.length === 0) {
        return {
            arrayCode: "// No custom glyphs created yet.",
            usageCode: "// Generate characters first"
        };
    }

    let arrayCode = "";
    // ВИПРАВЛЕННЯ ТУТ: використовуємо <br> для HTML відображення
    let usageCode = "// Usage Example:<br>// Add inside setup():<br>"; 

    chars.forEach((char, idx) => {
        let safeName = "GLYPH_" + transliterate(char);
        let bytes = ramLibrary[char];
        
        // C++ Array code (для textarea \n працює добре)
        arrayCode += `// Symbol '${char}'\n`;
        arrayCode += `const uint8_t ${safeName}[] PROGMEM = {\n`;
        bytes.forEach((b, i) => {
            let bin = '0b' + b.toString(2).padStart(5, '0');
            arrayCode += `  ${bin}${i<7?',':''}\n`;
        });
        arrayCode += `};\n\n`;
        
        // Usage code (для div footer потрібен <br>)
        usageCode += `lcd.createChar(${idx}, ${safeName}); // Map '${char}' to index ${idx}<br>`;
    });

    return { arrayCode: arrayCode.trim(), usageCode };
}