import { OcrService } from '../../services';

const ocrService = OcrService.getInstance();

export class OcrController {
    async ocr(req, res): Promise<void> {
        // const path = req.files[0].path;
        // console.log(data);
        // ocrService.removeImageOcr(path);
        const result = req.body.codeArray.length > 0 ? ocrService.filterOcr(req.body.codeArray) : [];
        return res.json({data: result});
    }
}