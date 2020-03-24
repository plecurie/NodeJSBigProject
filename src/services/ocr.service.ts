import {exec} from "../utils/exec";
import {codes} from "../utils/country_code";
const fs = require('fs');

export class OcrService {
    private static instance: OcrService;
    private regExOcr = /^[a-z]{2}[O0-9]+$/i;

    public static getInstance(): OcrService {
        if(!OcrService.instance) {
            OcrService.instance = new OcrService();
        }
        return OcrService.instance;
    }

    public async processOcr(path: any): Promise<Array<string>>{
        return (<string>await exec(`tesseract ${path} stdout`))
            .split(' ')
            .filter(v => this.regExOcr.test(v))
            .filter(v => codes.includes(v.substring(0, 2).toUpperCase()));
    }

    public removeImageOcr(path: any): void {
        fs.unlink(path, (err) => {
            if(err) {
                console.error(err);
                return
            }
            console.log('file removed')
        });
    }
}