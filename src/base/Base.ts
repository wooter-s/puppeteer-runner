import puppeteer, { ClickOptions, LaunchOptions } from 'puppeteer'
import { trimAll } from "./util/string";
import { RecordManger } from "./RecordManger";

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

/**
 * TODO
 * 1.调度机制 ok
 * 2.数据验证
 * 3.错误报告生成 ok
 */
export abstract class Base {
    // @ts-ignore
    page: puppeteer.Page;
    // @ts-ignore
    browser: puppeteer.Browser;
    isInitFinish: boolean = false;
    runner?: Function;
    timeout: number = 5000;
    recordManger: RecordManger | undefined;
    protected constructor(launchOptions?:LaunchOptions) {
        this.init(launchOptions)
    }

    private init = async (launchOptions?:LaunchOptions) => {

        if (launchOptions?.timeout) {
            this.timeout = launchOptions.timeout;
        }
        const browser = await puppeteer.launch({
            defaultViewport: null, // view适配到浏览器窗口大小
            headless: false,
            args: [
                '--process-per-site',
                // '--start-fullscreen', // 这个是全屏
                // '--whitelisted-extension-id=pcpjhakpbojbpcmlcmaefndlnfmdhifj', // TODO 插件支持
            ],
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            userDataDir: '/Users/dasouche/Library/Application\\ Support/Google/Chrome/', // 设置缓存文件
            // devtools: true,
            timeout: this.timeout,
            devtools: true,
            ...launchOptions,
        });


        this.browser = browser;
        this.page = await browser.newPage();
        this.isInitFinish = true;
        this.runner && this.runner();
    }

    public run = async (cb: Function) => {
        if (this.isInitFinish) {
            cb();
        } else {
            console.info('初始化完成后启动浏览器');
            this.runner = cb;
        }
    };

    public nodeRunners = async (nodes: ((base: Base) => Promise<void>)[]) => {
        for(const n of nodes) {
            try {
                await n(this)
            } catch (e) {
                this.recordManger?.record(['流程错误', n.name, e])
            }
        }
    }

    public closePage = async () => {
        await this.page?.close({ runBeforeUnload: true });
    }

    public closeBrowser = async () => {
        await this.closePage();
        await this.browser?.close()
    }

    public query = async (query: string) : Promise<puppeteer.ElementHandle<Element> | null> => {
        await this.page!.waitForSelector(query, { timeout: this.timeout, visible: true });
        if (this.page) {
            return await this.page.$(query);
        }
        return null;
    }

    public click = async (query: string, options?:ClickOptions): Promise<void> => {
        await this.page.waitFor(300);
        const target = await this.query(query);
        if (target) {
            await target.click(options);
        }
    }

    public queryWithText = async (query: string, text: string, timeout:number = this.timeout, interval:number = 200): Promise<puppeteer.ElementHandle<Element> | null> => {
        await this.page!.waitFor(interval);
        await this.page!.waitForSelector(query, { timeout: this.timeout });
        // 超时
        if (timeout < 0) {
            // TODO 记录现场
            console.error('------> 超时');
            return null;
        }
        const elements = await this.page!.$$(query);
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

        return new Promise<puppeteer.ElementHandle<Element> | null>( async(res, rej) => {
            const result = await this.queryWithText(query, text, timeout - interval, interval);
            res(result);
        })
    }

    // 查询 唯一的父节点,在获取子节点；子节点设计成没有标识，因为如果有唯一标识，应该直接调用 queryWithText
    public queryChildWithParentText = async (parentQuery: string, parentText: string, query: string, ): Promise<puppeteer.ElementHandle<Element> | null> => {
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
