import { Page } from 'puppeteer';
import * as path from "path";

export class UIRecorder {
    private dirName: string;
    private page: Page;
    constructor(dirName: string, page: Page) {
        this.dirName = dirName;
        this.page = page;
    }


    recordUI = async () => {
        const url = this.page.url();
        const filePathName = path.join(this.dirName, `${url.replace(/\//g, '@')}.png`);
        await this.page.screenshot({ path: filePathName })
    }
}
