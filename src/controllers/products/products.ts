import { client, index, type } from "../../utils/elasticsearch";
import {CrudController} from "../../utils";
import {bulkindexService} from "../../services/request/bulkindex.service";

export class ProductsController extends CrudController {

    async update(req, res): Promise<void> {

        await client.deleteByQuery({
            index: index,
            body: {
                query: {
                    match: {
                        type: "product",
                    }
                }
            }
        }, async (err, response) => {
            if (err)
                res.status(500).json(err);

            try {
                await bulkindexService.getInstance().importExcel();
                res.status(200).json({updated: true})
            }
            catch (err) {
                res.status(500).json({updated: false, error: err})
            }
        });


    }

    findOne(req, res): void {

        client.search({
            index: index,
            type: type,
            body : {
                query: {
                    bool: {
                        must: {
                            match: {
                                isincode: req.params.isincode
                            }
                        }
                    }
                }
            }
        }, (err, response) => {
            if (err)
                res.status(500).json(err);
            else if (response.body.hits.hits.length != 0) {
                res.status(200).json({found: true, product: response.body.hits.hits._source});
            }
            else {
                res.status(404).json({found: false, reason: "not found"});
            }

        });

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
                let list_product = [];
                for (let i=0; i < response.body.hits.hits.length; i++) {
                    list_product.push(response.body.hits.hits[i]._source)
                }
                res.status(200).json({ found: true, products: list_product });
            }
            else {
                res.status(404).json({ found: false, reason: "no products found" });
            }

        });

    }

    async search(req, res): Promise<void>{

        client.msearch({
            index: index,
            type: type,
            body : [
                {
                    query: {
                        bool: {
                            must: [
                                {
                                    match: { type: "product" }
                                }
                            ],
                            filter: [req.body.filter1]
                        }
                    }
                },
                {
                    query: {
                        bool: {
                            must: [
                                {
                                    match: { type: "product" }
                                }
                            ],
                            filter: [req.body.filter2]
                        }
                    }
                }
            ]
        }, (err, response) => {
            if (err)
                res.status(500).json(err);

            else if (response.body.responses[0].hits.hits.length != 0) {
                let list_product = [];
                for (let i=0; i < response.body.responses[0].hits.hits.length; i++) {
                    list_product.push(response.body.responses[0].hits.hits[i]._source)
                }
                res.status(200).json({ found: true, products: list_product });
            }
            else {
                res.status(404).json({ found: false, reason: "no products found" });
            }

        });

    }

    read(req, res): void {}

    delete(req, res): void {}

    create(req, res): void {}

}