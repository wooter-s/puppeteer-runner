import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: null, // view适配到浏览器窗口大小
        headless: false,
        args: [
            '--process-per-site',
            // '--start-fullscreen', // 这个是全屏
        ],
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        userDataDir: '/Users/dasouche/Library/Application\\ Support/Google/Chrome/', // 设置缓存文件
        // devtools: true,
        timeout: 50000,
        devtools: true,
    })
    const page = await browser.newPage()

    await page.goto('https://juejin.im/post/5e0f2d16f265da5d674ed919')

    await page.setViewport({ width: 1440, height: 766 })

    await page.waitForSelector('.nav-list > .main-nav-list > .phone-hide > .nav-item:nth-child(1) > a')
    await page.click('.nav-list > .main-nav-list > .phone-hide > .nav-item:nth-child(1) > a')

    await page.waitForSelector('.nav-list > .main-nav-list > .phone-hide > .activities > a')
    await page.click('.nav-list > .main-nav-list > .phone-hide > .activities > a')

    await page.waitForSelector('.nav-list > .main-nav-list > .phone-hide > .nav-item:nth-child(3) > a')
    await page.click('.nav-list > .main-nav-list > .phone-hide > .nav-item:nth-child(3) > a')

    await page.waitForSelector('.nav-list > .main-nav-list > .phone-hide > .book > a')
    await page.click('.nav-list > .main-nav-list > .phone-hide > .book > a')

    await page.waitForSelector('.nav-list > .main-nav-list > .phone-hide > .nav-item:nth-child(5) > a')
    await page.click('.nav-list > .main-nav-list > .phone-hide > .nav-item:nth-child(5) > a')

    // await browser.close()
})()

export {}
