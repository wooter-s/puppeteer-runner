import { Response, Page, Request, ScreenshotOptions } from 'puppeteer';
import * as fs from "fs";
import * as path from "path";
import dateFormat from 'dateformat';
import { BizResponse, ResponseRecorder } from "./ResponseRecorder";
import { UIRecorder } from "./UIRecorder";

export interface IsRecord {
    (response: Response): boolean
}

export interface IsRecordRequest {
    (request: Request): boolean
}
export class RecordManger {
    private isRecord: IsRecord = (response => true);
    private isRecordRequest: IsRecordRequest = (request => false);
    private dirName: string;
    private page: Page;
    private responseRecorder: ResponseRecorder;
    private uiRecorder: UIRecorder;
    constructor(page: Page, isRecord?: IsRecord, isRecordRequest?: IsRecordRequest) {
        this.dirName = `record/${dateFormat(new Date(), 'isoDateTime')}`;
        const baseDir = process.cwd();
        const recordDir = path.join(baseDir, 'record');
        if (!fs.existsSync(recordDir)) {
            fs.mkdirSync(recordDir)
        }

        if (isRecord) {
            this.isRecord = isRecord;
        }

        if (isRecordRequest) {
            this.isRecordRequest = isRecordRequest
        }

        fs.mkdirSync(path.join(baseDir, this.dirName));
        this.page = page;
        this.responseRecorder = new ResponseRecorder(path.join(baseDir, this.dirName, 'response.log'));
        this.uiRecorder = new UIRecorder(path.join(baseDir, this.dirName), page);
    }

    handleResponse = async (response: Response) => {
        try {
            const url = response.url();
            const method = response.request().method();
            const postData = response.request().postData();
            // OPTIONS 没有body
            if (this.isRecord(response) && method !== "OPTIONS") {
                // WOO TAG unknown 学习
                // @ts-ignore
                const result: BizResponse = await response.json();
                // loggerRecord

                if (postData) {
                    await this.responseRecorder.recordLog(
                        result,
                        method + '\n',
                        url + '\n',
                        postData + '\n',
                    );
                } else {
                    await this.responseRecorder.recordLog(
                        result,
                        method,
                        url,
                    );
                }


                // uiRecord
                if (!response.ok() || !result.success) {
                    await this.uiRecorder.recordUI()
                }
            }
        } catch (e) {
            console.log('------> response e', e);
        }
    }

    handleRequest = async (request: Request) => {
        try {
            const url = request.url();
            const method = request.method();
            if (this.isRecordRequest(request) && method !== "OPTIONS") {
                const result = await request.headers();
                await this.responseRecorder.recordLog(result, method, url);
            }
        } catch (e) {
            console.log('------> response e', e);
        }
    }

    record = async (arg: any[]) => {
        await this.responseRecorder.recordLog({}, arg)
    }

    screenshot = async (name?: string, option?:ScreenshotOptions) => {
        await this.page.screenshot({
            path: path.join(this.dirName, (name || Math.random()) + '.jpeg'),
            ...option,
        })
    }
}
