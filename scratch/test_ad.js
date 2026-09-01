const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Need to serve locally or use the live url, but I'll serve locally so I can test my local changes
  // Let's use a simple static server. I'll just open the file directly since there's no fetch required.
  // Wait, index.html uses ES modules, so file:// protocol might fail with CORS.
  // Better to start an http-server.
