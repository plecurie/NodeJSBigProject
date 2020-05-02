import { OcrService } from '../../services';
import { CrudOcr } from '../../utils';

const ocrService = OcrService.getInstance();

export class OcrController extends CrudOcr {
    async ocr(req, res): Promise<void> {
        // const path = req.files[0].path;
        // console.log(data);
        // ocrService.removeImageOcr(path);
        const result = ocrService.filterOcr(req.body.codeArray);
        return res.json({data: result});
    }
}