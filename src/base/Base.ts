import puppeteer, { ClickOptions, LaunchOptions } from 'puppeteer'
import { trimAll } from "./util/string";
import { RecordManger } from "./RecordManger";
import * as os from "os";
import { Readline } from "./util/readline";

interface BaseSelectorInterface {
    displayName: string;
    valid: string;
    selectorCode: string;
}

export enum BaseSelectorType {
    BUTTON = ".ant-btn",
    BUTTON_DETAIL = "button.ant-btn span",

    ICON_MORE = ".anticon.anticon-more",
    ICON_DOWN = ".anticon.anticon-down",
    ICON_CLOSE = ".anticon.anticon-close",

    ANT_BREADCRUMB_LINK = ".ant-breadcrumb-link",
    ANT_DROPDOWN_LINK = ".ant-dropdown-link",
    ANT_DROPDOWN_MENU = ".ant-dropdown-menu",
    ANT_MENU_SUBMENU = ".ant-menu-submenu",
    ANT_MENU_ITEM = ".ant-menu-item",
    ANT_PAGINATION_ITEM = ".ant-pagination-item",
    ANT_PAGINATION_ITEM_LINK = ".ant-pagination-item-link",
    ANT_CHECKBOX_INPUT = ".ant-checkbox-input",
    ANT_CASCADER_PICKER = ".ant-cascader-picker",
    ANT_CASCADER_MENU_ITEM = ".ant-cascader-menu-item",
    ANT_CALENDAR_PICKER_INPUT = ".ant-calendar-picker-input",
    ANT_CALENDAR_PICKER_ICON = ".ant-calendar-picker-icon",
    ANT_CALENDAR_DATE = ".ant-calendar-date",
    ANT_CALENDAR_TODAY_BTN = ".ant-calendar-today-btn",
    ANT_CALENDAR_NEXT_MONTH_BTN = ".ant-calendar-next-month-btn",
    ANT_CALENDAR_PREV_MONTH_BTN = ".ant-calendar-prev-month-btn",
    ANT_CALENDAR_NEXT_YEAR_BTN = ".ant-calendar-next-year-btn",
    ANT_CALENDAR_PREV_YEAR_BTN = ".ant-calendar-prev-year-btn",
    ANT_CALENDAR_MONTH_PANEL_MONTH = ".ant-calendar-month-panel-month",
    ANT_CALENDAR_MONTH_PANEL_PREV_YEAR_BTN = ".ant-calendar-month-panel-prev-year-btn",
    ANT_CALENDAR_MONTH_PANEL_NEXT_YEAR_BTN = ".ant-calendar-month-panel-next-year-btn",
    ANT_CALENDAR_RANGE_PICKER_INPUT = ".ant-calendar-range-picker-input",
    ANT_INPUT =".ant-input",
    ANT_INPUT_NUMBER_INPUT = ".ant-input-number-input",
    ANT_INPUT_NUMBER_HANDLER_UP = ".ant-input-number-handler-up",
    ANT_INPUT_NUMBER_HANDLER_DOWN = ".ant-input-number-handler-down",
    ANT_RADIO = ".ant-radio",
    ANT_RADIO_BUTTON_WRAPPER = ".ant-radio-button-wrapper",
    ANT_SELECT_SELECTION = ".ant-select-selection",
    ANT_SELECT_TREE_TREENODE_SWITCHER_CLOSE = '.ant-select-tree-treenode-switcher-close',
    ANT_SELECT_TREE_TREENODE_SWITCHER_OPEN = '.ant-select-tree-treenode-switcher-open',
    ANT_SELECT_DROPDOWN_MENU_ITEM = ".ant-select-dropdown-menu-item",
    ANT_SELECT_SELECTION__CHOICE__REMOVE = ".ant-select-selection__choice__remove",
    ANT_SELECT_SELECTION__CLEAR = ".ant-select-selection__clear",
    ANT_SELECT_TREE_SWITCHER = ".ant-select-tree-switcher",
    ANT_SELECT_TREE_NODE_CONTENT_WRAPPER = ".ant-select-tree-node-content-wrapper",
    ANT_TIME_PICKER_INPUT = ".ant-time-picker-input",
    ANT_TIME_PICKER_CLOSE = ".ant-time-picker > .anticon",

    ANT_COLLAPSE_HEADER = ".ant-collapse-header",
    ANT_TABS_TAB = ".ant-tabs-tab",
    ANT_TABS_CLOSE_X = ".ant-tabs-close-x",
    ANT_TABS_NEW_TAB = ".ant-tabs-new-tab",
    ANT_ALERT_CLOSE_ICON = ".ant-alert-close-icon",
    ANT_MODAL_CLOSE_X = ".ant-modal-close-x",



    SELECT = ".ant-select.ant-select-enabled .ant-select-selection__rendered",
    DIRECT_TREE_ORIGIN = ".ant-tree-node-content-wrapper",
    DIRECT_TREE = "span.ant-tree-title span",
    TREE_NODE_TITLE = ".ant-select-tree-title",
    TREE_NODE_SWITCHER = ".ant-select-tree-switcher.ant-select-tree-switcher_close",
    TABLE_ITEM = "td.ant-table-row-cell-break-word",
    DROPDOWN_LINK = "a.ant-dropdown-link.ant-dropdown-trigger",
    DROPDOWN_SELECT_MENU_ITEM = ".ant-dropdown-menu-item",
}

export const BaseSelectorList: BaseSelectorInterface[] = [
    // WOO TAG 按钮的顺序问题
    {
        displayName: '按钮group',
        valid: '.ant-btn-group',
        selectorCode: '.ant-btn-group > .ant-btn',
    },
    {
        displayName: '按钮',
        valid: BaseSelectorType.BUTTON,
        selectorCode: BaseSelectorType.BUTTON,
    },
//    ------> icon
    {
        displayName: '更多icon',
        valid: BaseSelectorType.ICON_MORE,
        selectorCode: BaseSelectorType.ICON_MORE,
    },
    {
        displayName: '下icon',
        valid: BaseSelectorType.ICON_DOWN,
        selectorCode: BaseSelectorType.ICON_DOWN,
    },
    {
        displayName: '关闭icon',
        valid: BaseSelectorType.ICON_CLOSE,
        selectorCode: BaseSelectorType.ICON_CLOSE,
    },
]

export const NavTypeSelectorList: BaseSelectorInterface[] = [
    //    ------> 面包屑导航
    {
        displayName: '面包屑',
        valid: BaseSelectorType.ANT_BREADCRUMB_LINK,
        selectorCode: BaseSelectorType.ANT_BREADCRUMB_LINK,
    },
    //    ------> Dropdown下拉菜单
    {
        displayName: '下拉菜单',
        valid: BaseSelectorType.ANT_DROPDOWN_LINK,
        selectorCode: BaseSelectorType.ANT_DROPDOWN_LINK,
    },
    {
        displayName: '下拉菜单选项',
        valid: BaseSelectorType.ANT_DROPDOWN_MENU,
        selectorCode: BaseSelectorType.ANT_DROPDOWN_MENU,
    },
    //    ------> Menu导航菜单
    {
        displayName: '导航菜单Group',
        valid: BaseSelectorType.ANT_MENU_SUBMENU,
        selectorCode: BaseSelectorType.ANT_MENU_SUBMENU,
    },
    {
        displayName: '导航菜单Item',
        valid: BaseSelectorType.ANT_MENU_ITEM,
        selectorCode: BaseSelectorType.ANT_MENU_ITEM,
    },
    //    ------> Pagination分页
    {
        displayName: '分页器上下页',
        valid: '.ant-pagination-item-link',
        selectorCode: 'ant-pagination-item-link',
    },
    {
        displayName: '分页项',
        valid: '.ant-pagination-item',
        selectorCode: '.ant-pagination-item',
    },
]

export const DataInputTypeSelectorList: BaseSelectorInterface[] = [
    //    ------> Checkbox多选框
    {
        displayName: 'Checkbox多选框',
        valid: 'input.ant-checkbox-input',
        selectorCode: 'input.ant-checkbox-input',
    },
    //    ------> Cascader级联选择
    {
        displayName: 'Cascader级联选择',
        valid: '.ant-cascader-picker',
        selectorCode: '.ant-cascader-picker',
    },
    {
        displayName: 'Cascader选项',
        valid: '.ant-cascader-menu-item',
        selectorCode: '.ant-cascader-menu-item',
    },
    //    ------> DatePicker日期选择框
    {
        displayName: '日期选择框',
        valid: '.ant-calendar-picker-input',
        selectorCode: '.ant-calendar-picker-input',
    },
    {
        displayName: '日期选择框 -> 右边图标',
        valid: '.ant-calendar-picker-icon',
        selectorCode: '.ant-calendar-picker-icon',
    },
    {
        displayName: '日期选择框 -> 日期',
        valid: '.ant-calendar-date',
        selectorCode: '.ant-calendar-date',
    },
    {
        displayName: '日期选择框 -> 今天',
        valid: '.ant-calendar-today-btn',
        selectorCode: '.ant-calendar-today-btn',
    },
    {
        displayName: '日期选择框 -> 下月',
        valid: '.ant-calendar-next-month-btn',
        selectorCode: '.ant-calendar-next-month-btn',
    },
    {
        displayName: '日期选择框 -> 上月',
        valid: '.ant-calendar-prev-month-btn',
        selectorCode: '.ant-calendar-prev-month-btn',
    },
    {
        displayName: '日期选择框 -> 下年',
        valid: '.ant-calendar-next-year-btn',
        selectorCode: '.ant-calendar-next-year-btn',
    },
    {
        displayName: '日期选择框 -> 上年',
        valid: '.ant-calendar-prev-year-btn',
        selectorCode: '.ant-calendar-prev-year-btn',
    },
    {
        displayName: '月选择框 -> 月份',
        valid: '.ant-calendar-month-panel-month',
        selectorCode: '.ant-calendar-month-panel-month',
    },
    {
        displayName: '月选择框 -> 上年',
        valid: '.ant-calendar-month-panel-prev-year-btn',
        selectorCode: '.ant-calendar-month-panel-prev-year-btn',
    },
    {
        displayName: '月选择框 -> 下年',
        valid: '.ant-calendar-month-panel-next-year-btn',
        selectorCode: '.ant-calendar-month-panel-next-year-btn',
    },
    {
        displayName: '连续日期选择框',
        valid: '.ant-calendar-range-picker-input',
        selectorCode: '.ant-calendar-range-picker-input',
    },
    //    ------> InputNumber数字输入框
    {
        displayName: '数字输入框',
        valid: '.ant-input-number-input',
        selectorCode: '.ant-input-number-input',
    },
    // FIXME 要先hover在click
    {
        displayName: '数字输入框 -> 增加',
        valid: '.ant-input-number-handler-up',
        selectorCode: '.ant-input-number-handler-up',
    },
    // FIXME 要先hover在click
    {
        displayName: '数字输入框 -> 减少',
        valid: '.ant-input-number-handler-down',
        selectorCode: '.ant-input-number-handler-down',
    },
    //    ------> Form表单
    {
        displayName: '输入框',
        valid: '.ant-input',
        selectorCode: 'input.ant-input',
    },
    //    ------> Radio单选框
    {
        displayName: '按钮Radio',
        valid: '.ant-radio-button-wrapper',
        selectorCode: '.ant-radio-button-wrapper',
    },
    {
        displayName: 'Radio单选框',
        valid: '.ant-radio',
        selectorCode: '.ant-radio',
    },
    //    ------> Switch开关
    {
        displayName: 'Switch开关',
        valid: '.ant-switch',
        selectorCode: '.ant-switch',
    },
    //    ------> Select选择器
    {
        displayName: 'Select选择器 -> 删除选项',
        valid: '.ant-select-selection__choice__remove',
        selectorCode: '.ant-select-selection__choice__remove',
    },
    //    ------> TreeSelect树选择
    {
        displayName: '树选择 -> 删除选项',
        valid: '.ant-select-selection__clear',
        selectorCode: '.ant-select-selection__clear',
    },
    {
        displayName: 'Select选择器',
        valid: '.ant-select-selection',
        selectorCode: '.ant-select-selection',
    },
    {
        displayName: 'Select选择器 -> 选项',
        valid: '.ant-select-dropdown-menu-item',
        selectorCode: '.ant-select-dropdown-menu-item',
    },
    {
        displayName: '树选择 -> 选项展开器',
        valid: '.ant-select-tree-switcher',
        selectorCode: '.ant-select-tree-switcher',
    },
    {
        displayName: '树选择 -> 选项',
        valid: '.ant-select-tree-node-content-wrapper',
        selectorCode: '.ant-select-tree-node-content-wrapper',
    },
    {
        displayName: '树选择 -> 选项开',
        valid: BaseSelectorType.ANT_SELECT_TREE_TREENODE_SWITCHER_OPEN,
        selectorCode: BaseSelectorType.ANT_SELECT_TREE_TREENODE_SWITCHER_OPEN,
    },
    {
        displayName: '树选择 -> 选项关',
        valid: BaseSelectorType.ANT_SELECT_TREE_TREENODE_SWITCHER_CLOSE,
        selectorCode: BaseSelectorType.ANT_SELECT_TREE_TREENODE_SWITCHER_CLOSE,
    },
    //    ------> TimePicker时间选择框
    {
        displayName: '时间选择框',
        valid: '.ant-time-picker-input',
        selectorCode: '.ant-time-picker-input',
    },
    {
        displayName: '时间选择框 -> 删除选项',
        valid: '.ant-time-picker > .anticon',
        selectorCode: '.ant-time-picker > .anticon',
    },
    // TODO 确认时间选择器能正常选择
];


export const DataDisplayTypeSelectorList: BaseSelectorInterface[] = [
    //    ------> Collapse折叠面板
    {
        displayName: 'Collapse折叠面板',
        valid: '.ant-collapse-header',
        selectorCode: '.ant-collapse-header',
    },
    //    ------> tab
    {
        displayName: 'tab',
        valid: '.ant-tabs-tab',
        selectorCode: ".ant-tabs-tab",
    },
    {
        displayName: 'tab -> 关闭',
        valid: '.ant-tabs-close-x',
        selectorCode: ".ant-tabs-close-x",
    },
    {
        displayName: 'tab -> 新开',
        valid: '.ant-tabs-new-tab',
        selectorCode: ".ant-tabs-new-tab",
    },
]

export const FeedBackTypeSelectorList: BaseSelectorInterface[] = [
    //    ------> Alert警告提示
    {
        displayName: 'Alert警告提示 -> 关闭按钮',
        valid: '.ant-alert-close-icon',
        selectorCode: '.ant-alert-close-icon',
    },
    //    ------> Modal对话框
    {
        displayName: 'Modal对话框 -> 右上角关闭',
        valid: '.ant-modal-close-x',
        selectorCode: '.ant-modal-close-x',
    },
];


export const SelectorList: BaseSelectorInterface[] = [
    ...BaseSelectorList,
    ...NavTypeSelectorList,
    ...DataInputTypeSelectorList,
    ...DataDisplayTypeSelectorList,
    ...FeedBackTypeSelectorList,
]



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
        const homedir = os.homedir()
        const browser = await puppeteer.launch({
            defaultViewport: null, // view适配到浏览器窗口大小
            headless: false,
            args: [
                '--process-per-site',
                // '--start-fullscreen', // 这个是全屏
                // '--whitelisted-extension-id=pcpjhakpbojbpcmlcmaefndlnfmdhifj', // TODO 插件支持
            ],
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            userDataDir: `${homedir}/Library/Application\\ Support/Google/Chrome/`, // 设置缓存文件
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
        const cookie = await this.page.cookies();
        if (cookie) {
            const token = cookie.find((c) => c.name === '_security_token_inc');
            if (!token) {
                await this.verificationCodeLogin()
            }
        } else {
            await this.verificationCodeLogin()
        }

        for(const n of nodes) {
            try {
                await n(this)
            } catch (e) {
                console.warn('------> 流程错误', n.name, e);
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

    public hover = async (query: string ): Promise<void> => {
        await this.page.waitFor(300);
        const target = await this.query(query);
        if (target) {
            await target.hover();
        }
    }

    public queryWithText = async (query: string, text: string, timeout:number = this.timeout, interval:number = 200): Promise<puppeteer.ElementHandle<Element> | null> => {
        await this.page!.waitFor(interval);
        await this.page!.waitForSelector(query, { timeout: this.timeout });
        // 超时
        if (timeout < 0) {
            // TODO 记录现场
            console.error('------> 超时', query);
            return null;
        }
        const elements = await this.page!.$$(query);
        if (!elements || elements.length === 0) {
            console.log('------> 没有查找到元素', query, text);
        }

        for (let element of elements) {
            // https://github.com/puppeteer/puppeteer/issues/3051
            // @ts-ignore
            const innerText: string = await (await element.getProperty('innerText')).jsonValue();
            // FIXME 这里最好使用trim，但是antd里有好多组件因为其他原因，加一些空格
            if (innerText === text || trimAll(innerText) === text || trimAll(innerText) === trimAll(text)) {
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

    public verificationCodeLogin = async () => {

        const verificationLoginA = await this.queryWithText('a', '验证码登录');
        await verificationLoginA?.click();
        await this.page.waitForNavigation();

        // 输入用户名
        const mobile = await Readline.question("请输入获取验证码手机号: ");

        await this.page.type("#fg-username", mobile);
        // 勾选发送验证码到钉钉
        await this.page.click("#beleive-ckb");
        // 点击获取验证码
        await this.page.click("#msg_code");

        const answer = await Readline.question("请输入验证码: ");
        // 输入验证码
        await this.page.type("#fg-code-verify", answer);

        // 点击确认按钮
        await this.page.click("#fgpwd-submit-btn");
    }
}
