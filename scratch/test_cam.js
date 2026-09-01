const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://127.0.0.1:8080/games/03-dungeon-claw/', { waitUntil: 'networkidle0' });
  
  await page.waitForSelector('#btnStart');
  await page.click('#btnStart');
  
  // Wait a bit for game to start
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: 'scratch/claw_front.png' });
  
  // Toggle view
  await page.click('#btnToggleView');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scratch/claw_top.png' });
  
  await browser.close();
})();
