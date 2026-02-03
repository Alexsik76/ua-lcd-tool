# 🇺🇦 LCD 1602 Workbench

A professional web-based tool for creating custom Cyrillic (Ukrainian) characters for standard LCD 1602 displays based on the HD44780 controller.

🔴 **Live Demo:** [https://alexsik76.github.io/ua-lcd-tool/]

## ⚡ Features

* **Pixel-Perfect Emulation:** Uses the exact bitmap data from the **Hitachi HD44780 (ROM Code A00)** datasheet for accurate rendering.
* **RAM Management:** Simulates the real hardware limit of 8 custom characters (CGRAM).
* **C++ Code Generator:** Instantly generates optimized code arrays for Arduino/PlatformIO.
* **Visual Editor:** Click-to-draw interface with alignment guides for baseline and ascenders.
* **Local Storage:** Your work is saved automatically in the browser.

## 🛠️ Tech Stack

* **Vanilla JavaScript (ES Modules)** - No build steps required.
* **Pico.CSS** - For a clean, semantic, and responsive UI.
* **SVG Generation** - Dynamic favicons and icons.

## 📖 How to use

1. Type your text in the terminal input.
2. Click on any red-highlighted character (missing in ROM) to open the Editor.
3. Draw the glyph and click **Save to RAM**.
4. Go to the **C++ Code** tab and copy the generated arrays to your project.

## 🤝 Credits

* **Hitachi HD44780 Datasheet** for the ROM character patterns.
* **Pico CSS** for the minimalist UI framework.
* Developed for the Ukrainian engineering community.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
