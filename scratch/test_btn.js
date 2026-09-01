const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8080/games/04-cyber-slacker/', {waitUntil: 'networkidle2'});

  // Trigger game start
  await page.evaluate(() => {
    window.game.startShift();
    window.game.handleBustedByBoss();
  });
  
  // Check if btnAdRevive is visible
  const btnVisible = await page.evaluate(() => {
    const btn = document.getElementById('btnAdRevive');
    if (!btn) return 'NOT_FOUND';
    return {
      display: btn.style.display,
      text: btn.innerText,
      width: btn.style.width,
      flex: btn.parentElement.style.flexDirection
    };
  });
  
  console.log('Button State:', btnVisible);
  await browser.close();
})();
