import { OcrService } from '../../services';

const ocrService = OcrService.getInstance();

export class OcrController {
    async recognize(req, res): Promise<void> {
        // const path = req.files[0].path;
        // console.log(data);
        // ocrService.removeImageOcr(path);
        try {
            const result = req.body.codeArray.length > 0 ? ocrService.filterOcr(req.body.codeArray) : [];
            return res.status(200).json({recognized: true, data: result});
        }
        catch (e) {
            return res.status(400).json({recognized: false});
        }

    }
}