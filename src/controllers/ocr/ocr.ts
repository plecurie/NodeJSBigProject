import { OcrService, ProductService } from '../../services';

const ocrService = OcrService.getInstance();
const productService = ProductService.getInstance();

export class OcrController {
    async ocr(req, res): Promise<void> {
        // const path = req.files[0].path;
        // console.log(data);
        // ocrService.removeImageOcr(path);
        const result = req.body.codeArray.length > 0 ? ocrService.filterOcr(req.body.codeArray) : [];
        const assWithDCat = await productService.associateDataDbWithCategorie();
        const matchIsinCode = assWithDCat.filter(item => result.includes(item._source.isincode));
        
        for (const mIC of matchIsinCode) {
            // const average = mIC._source.criteria.reduce((a, b) => a + b.value, 0) / mIC._source.criteria.length;
            // console.log(mIC._source)
            // mIC._source['criteriaCategorieAverage'] = average;
            const morningCriteria = mIC._source.criteria.find(item => item.name == 'morningstarSustainabilityRating');
            mIC._source['criteriaCategorieAverage'] = morningCriteria.value;
        }
        return res.json({data: matchIsinCode});
    }
}