import { OcrService, ProductService } from '../../services';

const ocrService = OcrService.getInstance();
const productService = ProductService.getInstance();

export class OcrController {
    async ocr(req, res): Promise<void> {
        // const path = req.files[0].path;
        // console.log(data);
        // ocrService.removeImageOcr(path);
        const result = req.body.codeArray.length > 0 ? ocrService.filterOcr(req.body.codeArray) : [];
        result.forEach((item, i) => result[i] = item.replace(/O/g, "0"));
        //console.log(result);
        const assWithDCat = await productService.associateDataDbWithCategorie();
        const matchIsinCode = assWithDCat.filter(item => result.includes(item._source.isincode));
        console.log(matchIsinCode);
        for (const mIC of matchIsinCode) {
            const morningCriteria = mIC._source.criteria.find(item => item.name == 'morningstarSustainabilityRating');
            mIC._source['criteriaCategorieAverage'] = morningCriteria ? morningCriteria.value : 0;
        }
        return res.json({data: matchIsinCode});
    }
}