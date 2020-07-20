import { Response, Page } from 'puppeteer';
import * as fs from "fs";
import * as path from "path";
import dateFormat from 'dateformat';
import { BizResponse, ResponseRecorder } from "./ResponseRecorder";
import { UIRecorder } from "./UIRecorder";

export interface IsRecord {
    (response: Response): boolean
}
export class RecordManger {
    private isRecord: IsRecord = (response => true);
    private dirName: string;
    private page: Page;
    private responseRecorder: ResponseRecorder;
    private uiRecorder: UIRecorder;
    constructor(page: Page, isRecord: IsRecord) {
        this.dirName = `record/${dateFormat(new Date(), 'isoDateTime')}`;
        const baseDir = process.cwd();
        const recordDir = path.join(baseDir, 'record');
        if (!fs.existsSync(recordDir)) {
            fs.mkdirSync(recordDir)
        }

        this.isRecord = isRecord;
        fs.mkdirSync(path.join(baseDir, this.dirName));
        this.page = page;
        this.responseRecorder = new ResponseRecorder(path.join(baseDir, this.dirName, 'response.log'));
        this.uiRecorder = new UIRecorder(path.join(baseDir, this.dirName), page);
    }

    handle = async (response: Response) => {
        try {
            const url = response.url();
            // OPTIONS 没有body
            // if (url.startsWith('http://shangyang.dasouche-inc.net') && response.request().method() !== "OPTIONS") {
            if (this.isRecord(response) && response.request().method() !== "OPTIONS") {
                // WOO TAG unknown 学习
                // @ts-ignore
                const result: BizResponse = await response.json();

                // loggerRecord
                await this.responseRecorder.recordLog(url, result);

                // uiRecord
                if (!response.ok() || !result.success) {
                    await this.uiRecorder.recordUI()
                }
            }
        } catch (e) {
            console.log('------> response e', e);
        }
    }

}
