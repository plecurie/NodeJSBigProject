import {OcrService, ProductsService} from '../../services';

const ocrService = OcrService.getInstance();
const criteriaService = ProductsService.getInstance();

export class OcrController {
    async recognize(req, res): Promise<boolean> {
        // const path = req.files[0].path;
        // console.log(data);
        // ocrService.removeImageOcr(path);
        try {
            const result = req.body.codeArray.length > 0 ? ocrService.filterOcr(req.body.codeArray) : [];
            result.forEach((item, i) => result[i] = item.replace(/O/g, "0"));
            //console.log(result);
            const assWithDCat = await criteriaService.mapProductCriteria();
            const matchIsinCode = assWithDCat.filter(item => result.includes(item._source.isincode));
            console.log(matchIsinCode);
            for (const mIC of matchIsinCode) {
                const morningCriteria = mIC._source.criteria.find(item => item.name == 'morningstarSustainabilityRating');
                mIC._source['criteriaCategorieAverage'] = morningCriteria ? morningCriteria.value : 0;
            }
            res.status(200).json({recognized: true, data: matchIsinCode});

            return true

        } catch (err) {
            res.status(400).json({recognized: false});
            return false
        }
    }
}