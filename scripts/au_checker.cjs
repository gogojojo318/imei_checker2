const { chromium } = require('playwright');

async function checkAu(imei) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    'https://my.au.com/cmn/WCV009001/WCE009001.hc',
    { waitUntil: 'domcontentloaded' }
  );

  await page.type('#imei', imei);
  await page.click('.btnPrimary');

  await page.waitForFunction(() => {
    const items = Array.from(document.querySelectorAll('.list_item'));
    return items.some(li => {
      const h = li.querySelector('.list_heading');
      const d = li.querySelector('.list_details');
      return h && /状態/.test(h.textContent) &&
             d && /[〇○×△－ー-]/.test(d.textContent);
    });
  }, { timeout: 60000 });

  const result = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.list_item'));
    for (const li of items) {
      const h = li.querySelector('.list_heading');
      const d = li.querySelector('.list_details');
      if (h && /状態/.test(h.textContent) && d) {
        const text = d.textContent.trim().replace(/[ー-]/g, '－');
        return text.match(/[〇○×△－]/)?.[0] || '不明';
      }
    }
    return '不明';
  });

  await browser.close();
  return result;
}

// CLI 実行用
if (require.main === module) {
  const imei = process.argv[2];
  checkAu(imei).then(result => {
    console.log(result);
    process.exit(0);
  });
}

module.exports = checkAu;
