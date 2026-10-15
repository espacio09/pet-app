const { chromium } = require('playwright');

(async () => {

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Chrome\\Application\\msedge.exe',
    headless: false
  });

  const page = await browser.newPage();

  await page.goto('https://localhost:3002');

  await page.waitForTimeout(10000);

  await browser.close();

})();