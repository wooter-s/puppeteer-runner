import * as puppeteer from 'puppeteer'
import { trimAll } from "../util/string";

export enum BaseSelectorType {
    INPUT = "input.ant-input",

    BUTTON = "button.ant-btn",
    BUTTON_DETAIL = "button.ant-btn span",

    SELECT = ".ant-select.ant-select-enabled .ant-select-selection__rendered",
    SELECT_ITEM = ".ant-select-dropdown-menu-item",

    MENU_ITEM = ".ant-menu-item",

    DIRECT_TREE_ORIGIN = ".ant-tree-node-content-wrapper",
    DIRECT_TREE = "span.ant-tree-title span",

    TREE_NODE_TITLE = ".ant-select-tree-title",
    TREE_NODE_SWITCHER = ".ant-select-tree-switcher.ant-select-tree-switcher_close",
    TABLE_ITEM = "td.ant-table-row-cell-break-word",

    DROPDOWN_LINK = "a.ant-dropdown-link.ant-dropdown-trigger",
    DROPDOWN_SELECT_MENU_ITEM = ".ant-dropdown-menu-item",

    ICON_MORE = ".anticon.anticon-more",
    ICON_DOWN = ".anticon.anticon-down",
    ICON_CLOSE = ".anticon.anticon-close",

    TAB = ".ant-tabs-tab[role='tab']"
}

// TODO extends 深度学习
/**
 * TODO 1.调度机制（包含流程控制） 2.数据验证 3.错误报告生成
 */
export abstract class Base {
    page: puppeteer.Page;
    browser: puppeteer.Browser;
    isInitFinish: boolean = false;
    isStartBeforeInit: boolean = false;
    protected constructor() {
        // this.init()
    }

    public init = async (cb: Function) => {
        const browser = await puppeteer.launch({
            defaultViewport: null, // view适配到浏览器窗口大小
            headless: false,
            args: [
                '--process-per-site',
                // '--start-fullscreen', // 这个是全屏
            ],
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            userDataDir: '/Users/dasouche/Library/Application\\ Support/Google/Chrome', // 设置缓存文件
            // devtools: true,
            timeout: 50000,
        });
        this.browser = browser;
        this.page = await browser.newPage();
        // this.addEventListener();
        this.isInitFinish = true;
        if (this.isStartBeforeInit) {
            cb()
        }
    }
    //
    // private addEventListener() {
    //     this.page.on("response", async (response) => {
    //         response.
    //         const result = await response.text();
    //         console.log('------> result', result);
    //     })
    // }

    public _start = async () => {
        if (!this.isInitFinish) {
            console.info('初始化完成后启动浏览器');
            this.isStartBeforeInit = true;
            return;
        }
    }

    public queryWithText = async (query: string, text: string, timeout:number = 10000, interval:number = 200): Promise<puppeteer.ElementHandle<Element>> => {
        await this.page.waitFor(interval);
        await this.page.waitForSelector(query);

        // 超时
        if (timeout < 0) {
            // TODO 记录现场
            console.error('------> 超时');
            return null;
        }
        const elements = await this.page.$$(query);
        if (!elements || elements.length === 0) {
            console.log('------> 没有查找到元素', query, text);
        }

        for (let element of elements) {
            // https://github.com/puppeteer/puppeteer/issues/3051
            // @ts-ignore
            const textContent: string = await (await element.getProperty('textContent')).jsonValue();
            // FIXME 这里最好使用trim，但是antd里有好多组件因为其他原因，加一些空格
            if (textContent === text || trimAll(textContent) === text) {
                // makesure element visible
                const size = await element.boundingBox();
                if (size === null) {
                    continue;
                }
                return element
            }
        }

        return new Promise<puppeteer.ElementHandle<Element>>( async(res, rej) => {
            const result = await this.queryWithText(query, text, timeout - interval, interval);
            res(result);
        })
    }

    // 查询 唯一的父节点,在获取子节点；子节点设计成没有标识，因为如果有唯一标识，应该直接调用 queryWithText
    public queryChildWithParentText = async (parentQuery: string, parentText: string, query: string, ): Promise<puppeteer.ElementHandle<Element>> => {
        const parentElements = await this.queryWithText(parentQuery, parentText);
        if (parentElements) {
            const targetElement = await parentElements.$(query);
            console.log('------> 找到子元素', query);
            return targetElement;
        }
        return null
    }

    public hoverQueryWithText = async (query: string, text: string) => {
        const element = await this.queryWithText(query, text);
        if (element) {
            await element.hover()
        }
    }

    public hoverChildWithText = async (parentQuery: string, parentText: string, query: string) => {
        const element = await this.queryChildWithParentText(parentQuery, parentText, query);
        if (element) {
            await element.hover()
        }
    }

    public clickQueryWithText = async (query: string, text: string) => {
        const element = await this.queryWithText(query, text);
        if (element) {
            await element.click()
        }
    }

    public clickChildWithText = async (parentQuery: string, parentText: string, query: string) => {
        const element = await this.queryChildWithParentText(parentQuery, parentText, query);
        if (element) {
            await element.click()
        }
    }

    public typeQueryWithText = async (query: string, text: string, input: string) => {
        const element = await this.queryWithText(query, text);
        if (element) {
            await element.type(input)
        }
    }

    public typeChildWithText = async (parentQuery: string, parentText: string, query: string, input: string) => {
        const element = await this.queryChildWithParentText(parentQuery, parentText, query);
        if (element) {
            await element.type(input)
        }
    }
}
