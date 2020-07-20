import * as fs from "fs";
import * as tracer from 'tracer';

export interface BizResponse {
    code: number;
    msg: string;
    data: any;
    success: boolean;
}

export class ResponseRecorder {
    private fileName: string;
    private logger: tracer.Tracer.Logger;
    constructor(fileName: string) {
        this.fileName = fileName;
        this.logger = tracer.console({
            transport: (data) => {
                console.log(data.output);
                fs.appendFile((fileName), data.rawoutput + '\n', err => {
                    if (err) throw err
                })
            }
        })
    }

    recordLog = async (url: string, result: BizResponse) => {
        if (result.success) {
            // this.logger.log(url, JSON.stringify(result));
        } else {
            this.logger.error(url, JSON.stringify(result));
        }
    }
}
