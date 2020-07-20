import * as puppeteer from 'puppeteer'

export class LogicTable {
    page: puppeteer.Page;
    flow = [
        {
            action: [
                // 点击tab
                this.page.click("a[href='#/modelCst']"),
                // 点击展开按钮
                this.page.click(".ant-tree-switcher"),
                //
            ],
            result: this.page.click(".ant-tree-switcher")
        }
    ]
    constructor(page: puppeteer.Page) {
        this.page = page;
    }

    start = async () => {
        // 模型tab
        await this.page.click("a[href='#/modelCst']")
    }


}
