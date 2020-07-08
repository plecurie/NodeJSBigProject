import {OcrService} from '../../services';
import {client, index} from "../../utils/elasticsearch";

const ocrService = OcrService.getInstance();

export class OcrController {

    async recognize(req, res) {
        try {

            let result = req.body.codeArray.length > 0 ? ocrService.filterOcr(req.body.codeArray) : [];
            result.forEach((item, i) => result[i] = item.replace(/O/g, "0"));

            await client.search({
                index: index,
                body: {
                    size: 50,
                    query: {
                        terms: {
                            isincode: result
                        }
                    }
                }
            }).then(data => {
                if (data.body.hits.hits.length != 0) {
                    res.status(200).json({recognized: true, data: data.body.hits.hits});
                } else {
                    res.status(404).json({recognized: false, reason: "not found"});
                }
            });
        } catch (err) {
            res.status(400).json({recognized: false, reason: "server error"});
        }
    }
}