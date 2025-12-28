const { chromium } = require('playwright');

async function checkSoftBank(imei) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://ct99.my.softbank.jp/WBF/icv', { waitUntil: 'domcontentloaded' });

  // IMEI入力
  await page.fill('input[name="imei"]', imei);

  // フォーム送信してページ遷移を待つ
  await Promise.all([
    page.click('input[name="ACT_TE001"]'),
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  ]);

  // ページ内のテキストから〇/×/△/－ を抽出
  const result = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const match = bodyText.match(/[〇○×△－]/);
    return match ? match[0] : '不明';
  });

  await browser.close();
  return result;
}

// CLI用
if (require.main === module) {
  const imei = process.argv[2];
  checkSoftBank(imei).then(r => {
    console.log(r);
    process.exit(0);
  });
}

module.exports = checkSoftBank;
