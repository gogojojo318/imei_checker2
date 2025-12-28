const { chromium } = require('playwright');

async function checkRakuten(imei) {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
      'https://network.mobile.rakuten.co.jp/restriction/',
      { waitUntil: 'domcontentloaded' }
    );

    await page.waitForSelector('#imei', { timeout: 10000 });
    await page.fill('#imei', imei);
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return /利用.*でき/.test(text)
          || /利用.*制限/.test(text)
          || /確認中/.test(text);
    }, { timeout: 15000 });

    const text = await page.textContent('body');

    if (/利用可能/.test(text)) return '〇';
    if (/代金債務不履行等/.test(text)) return '×';
    if (/確認中/.test(text)) return '△';

    return '－';

  } catch (e) {
    return '－';
  } finally {
    if (browser) await browser.close();
  }
}

// CLI 実行
if (require.main === module) {
  const imei = process.argv[2];
  checkRakuten(imei).then(r => {
    console.log(r);
    process.exit(0);
  });
}

module.exports = checkRakuten;
