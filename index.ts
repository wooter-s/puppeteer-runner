import * as puppeteer from 'puppeteer'
import { Readline } from "./src/process/readline";


class Start {
    page: puppeteer.Page;
    isInitFinish: boolean = false;
    isStartBeforeInit: boolean = false;
    constructor() {
        this.init()
    }

    private init = async () => {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--process-per-site'],
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            devtools: true,
        });
        this.page = await browser.newPage();
        await this.page.setViewport({ width: 1000, height: 500});
        this.isInitFinish = true;
        if (this.isStartBeforeInit) {
            this.start()
        }
    }

    public start = async () => {
        if (!this.isInitFinish) {
            console.info('初始化未完成，初始化完成后启动浏览器');
            this.isStartBeforeInit = true;
            return;
        }
        // await this.page.goto('http://sso.souche-inc.com/login.htm?s=aHR0cHM6Ly9kYXRhc3RhbmRhcmQuc291Y2hlLWluYy5jb20vIy9zdGFuZGFyZA==');
        await this.page.goto('http://sso.dasouche-inc.net/phoneCheck.htm?s=aHR0cDovL2YyZS5zb3VjaGUuY29tL3Byb2plY3RzL2RhdGEtZmUvZGF0YS1zdGFuZGFyZC1jZW50ZXIvaW5kZXguaHRtbCMvbW9kZWxDc3Q=');
        const canPasswordLogin = await this.getCanPasswordLogin();
        console.log('------> canPasswordLogin', canPasswordLogin);

        // 不用密码登录了
        await this.verificationCodeLogin();

        // 等待加载左侧导航
        await this.page.waitForSelector(".ant-tree-node-content-wrapper")

        await this.page.click(".ant-tree-node-content-wrapper")

        // await this.page.click(".ant-tree-node-content-wrapper")

    }

    private getCanPasswordLogin = async(): Promise<boolean> => {
        // const firstATag = await this.page.$("a[href='/phoneCheck.htm?s=aHR0cDovL2YyZS5zb3VjaGUuY29tL3Byb2plY3RzL2RhdGEtZmUvZGF0YS1zdGFuZGFyZC1jZW50ZXIvaW5kZXguaHRtbCMvc3RhbmRhcmQ=']");
        const aTagsInnerHTML = await this.page.$$eval("a", aTags => aTags.map((aTag => aTag.innerHTML)));
        console.log('------> aTagsInnerHTML', aTagsInnerHTML);
        // 如果有忘记密码，说明在密码登录页面
        const isContainerPassword = aTagsInnerHTML.includes("忘记密码?")
        if (isContainerPassword) {
            return true;
        }
        return false;
    }

    private passwordLogin = async () => {

    }

    private verificationCodeLogin = async () => {
        // 输入用户名
        await this.page.type("#fg-username", "15067422155");
        // 勾选发送验证码到钉钉
        await this.page.click("#beleive-ckb");
        // 点击获取验证码
        await this.page.click("#msg_code");

        const answer = await Readline.question("请输入验证码");

        // 输入验证码
        await this.page.type("#fg-code-verify", answer);
        // 点击确认按钮
        await this.page.click("#fgpwd-submit-btn");
    }
}

const start = new Start();
start.start();
