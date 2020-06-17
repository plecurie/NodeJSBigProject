import { client, index, type } from "../../utils/elasticsearch";
import {CrudController} from "../../utils";
import { Product } from "../../models/Product";
import {bulkindexService} from "../../services/request/bulkindex.service";

export class ProductsController extends CrudController {

    async create(req, res): Promise<void> {

        try {
            await bulkindexService.getInstance().importExcel();
            res.status(200).json({created: true})
        }
        catch (err) {
            res.status(500).json({created: false, error: err})
        }
    }

    findAll(req, res): void {

        client.search({
            index: index,
            type: type,
            body : {
                query: {
                    match: {
                        type: "product"
                    }
                }
            }
        }, (err, response) => {
            if (err)
                res.status(500).json(err);
            else if (response.body.hits.hits.length != 0) {
                res.status(200).json({found: true, products: response.body.hits.hits});
            }
            else {
                res.status(404).json({found: false, reason: "no products found"});
            }

        });

    }

    async search(req, res): Promise<void>{

        client.search({
            index: index,
            type: type,
            body : {
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    type: "product"
                                }
                            }
                        ],
                        filter: [
                            {
                                term:  req.body.filter
                            },
                        ]
                    }
                }
            }
        }, (err, response) => {
            if (err)
                res.status(500).json(err);
            else if (response.body.hits.hits.length != 0) {
                res.status(200).json({found: true, products: response.body.hits.hits});
            }
            else {
                res.status(404).json({found: false, reason: "no products found"});
            }

        });

    }

    read(req, res): void {}

    update(req, res): void {}

    delete(req, res): void {}

}