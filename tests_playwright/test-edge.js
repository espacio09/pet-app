console.log("Inicio");

const { chromium } = require('playwright');

(async () => {
    console.log("Antes de launch");

    const browser = await chromium.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: false
    });

    console.log("Browser abierto");

    const page = await browser.newPage();

    console.log("Página creada");

    await page.goto('https://www.google.com');

    console.log("Google abierto");

    await page.waitForTimeout(10000);

    await browser.close();

    console.log("Fin");
})();