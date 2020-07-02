const puppeteer = require('puppeteer');

(async () => {
    // 配置Chromium 应用地址
    const pathToExtension = require('path').join(__dirname, '../chrome-mac/Chromium.app/Contents/MacOS/Chromium');
    console.log('------> pathToExtension',pathToExtension );
    try {
        // const browser = await puppeteer.launch({
        //     executablePath: '/Users/dasouche/workspace/nodePro/auto-e2e-test/node_modules/puppeteer/.local-chromium/mac-737027/chrome-mac/Chromium.app',
        // })
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('http://f2e.souche.com/projects/data-fe/data-standard-center/index.html');
        await page.setViewport({ width: 1000, height: 500})
        await page.screenshot({ path: 'example.png'})
        // await browser.close()
    } catch (e) {
        console.log('------> e', e);
    }

})().catch(console.error)
