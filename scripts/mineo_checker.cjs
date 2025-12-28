const { chromium } = require('playwright');

async function checkMineo(imei) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    'https://my.mineo.jp/info/GNS010101GNS010101_Init.action',
    { waitUntil: 'domcontentloaded' }
  );

  await page.waitForSelector('input[name="imei"]');
  await page.fill('input[name="imei"]', imei);

  await page.click('input[type="submit"]');

  // 結果が出るまで待つ（body null対策済み）
  await page.waitForFunction(() => {
    if (!document.body) return false;
    const text = document.body.innerText;
    return /〇|○|×|△|－|-/.test(text);
  }, { timeout: 30000 });

  const result = await page.evaluate(() => {
    if (!document.body) return '不明';
    const text = document.body.innerText.replace(/[ー-]/g, '－');
    return text.match(/[〇○×△－]/)?.[0] || '不明';
  });

  await browser.close();
  return result;
}

// CLI用
if (require.main === module) {
  const imei = process.argv[2];
  checkMineo(imei).then(result => {
    console.log(result);
    process.exit(0);
  });
}

module.exports = checkMineo;
