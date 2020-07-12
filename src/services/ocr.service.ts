import {codes} from "../utils/country_code";

const fs = require('fs');

export class OcrService {
    private static instance: OcrService;
    //private regExOcr = /^[a-zA-Z]{2}[O0-9]+$/i;
    private regExOcr = /\b([A-Z]{2})((?![A-Z]{10}\b)[A-Z0-9]{10})\b/g;

    //private regExOcr = /([A-Z]{2})([A-Z0-9]{9})([0-9]{1})/g;

    public static getInstance(): OcrService {
        if (!OcrService.instance) {
            OcrService.instance = new OcrService();
        }
        return OcrService.instance;
    }

    public filterOcr(array: Array<string>): Array<string> {
        return array.filter(d => d.toUpperCase().match(this.regExOcr))
            .filter(v => codes.includes(v.substring(0, 2).toUpperCase()));
    }

    public removeImageOcr(path: any): void {
        fs.unlink(path, (err) => {
            if (err) {
                console.error(err);
                return
            }
        });
    }
}