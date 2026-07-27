import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'c:\\Users\\ertu9\\projeler\\BITBIT\\design\\screenshot-desktop.png', fullPage: true });
await browser.close();
console.log('Screenshot saved');
