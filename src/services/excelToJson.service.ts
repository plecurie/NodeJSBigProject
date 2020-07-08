const XLSX = require('xlsx');

export class excelToJsonService {
    private static instance: excelToJsonService;

    public static getInstance(): excelToJsonService {
        if (!excelToJsonService.instance) {
            excelToJsonService.instance = new excelToJsonService();
        }
        return excelToJsonService.instance;
    }

    public processXlsxToJson(filename): Object {
        const workbook = XLSX.readFile(filename, {cellDates:true});
        return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {raw: false});
    }
}