const XLSX = require('xlsx');

export class excelToJsonService {
    private static instance: excelToJsonService;

    public static getInstance(): excelToJsonService {
        if(!excelToJsonService.instance) {
            excelToJsonService.instance = new excelToJsonService();
        }
        return excelToJsonService.instance;
    }

    public processXlsxToJson(filename = 'Base-Projet-IT-v5.xlsx'): Object {
        const workbook = XLSX.readFile(filename);
        return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    }
}
