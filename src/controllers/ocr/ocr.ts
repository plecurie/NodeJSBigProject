import {OcrService} from '../../services';
import {client, index} from "../../utils/elasticsearch";
const ocrService = OcrService.getInstance();

export class OcrController {

    async recognize(req, res) {
        try {

            let result = req.body.codeArray.length > 0 ? ocrService.filterOcr(req.body.codeArray) : [];
            result.forEach((item, i) => result[i] = item.replace(/O/g, "0"));

            return await client.search({
                index: index,
                body: {
                    size: 50,
                    query: {
                        terms: {
                            isincode: result
                        }
                    }
                }
            }).then(async data => {
                if (data.body.hits.hits.length != 0) {
                    return res.status(200).json({recognized: true, data: data.body.hits.hits});
                } else {
                    return res.status(404).json({recognized: false, reason: "not found"});
                }
            });
        } catch (err) {
            return res.status(400).json({recognized: false, reason: "server error"});
        }
    }
}