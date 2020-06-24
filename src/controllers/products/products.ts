import {client, index} from "../../utils/elasticsearch";
import {bulkindexService} from "../../services/request/bulkindex.service";
import {ProductsService} from "../../services";

const productsService = ProductsService.getInstance();
const sizeMax = 10_000;

export class ProductsController {

    async update_db(req, res): Promise<boolean> {
        try {
            return await client.deleteByQuery({
                index: index,
                body: {
                    query: {match: {type: "product"}}
                }
            }).then(async () => {
                if (await bulkindexService.getInstance().importExcel()) {
                    res.status(200).json({updated: true});
                    return true;
                } else {
                    res.status(500).json({reason: 'server error'});
                    return false
                }
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return false;
        }
    }

    async findOne(req, res): Promise<boolean> {
        try {
            return await client.search({
                index: index,
                body: {
                    query: {
                        bool: {
                            must: [
                                {match: {type: "product"}},
                                {match: {isincode: req.params.isincode}}
                            ]
                        }
                    }
                }
            }).then(async data => {
                if (data.body.hits.hits.length != 0) {
                    const formatted = await productsService.mapProductCriteria({
                        products: data.body.hits.hits,
                        isincodes: null
                    });
                    res.status(200).json({found: true, products: formatted[0]._source});
                    return data.body.hits.hits[0]._source;
                } else {
                    res.status(404).json({found: false, reason: "not found"});
                    return
                }
            });
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return
        }
    }

    async findAll(req, res): Promise<boolean> {
        try {
            return await client.search({
                index: index,
                body: {
                    size: sizeMax,
                    query: {
                        term: {type: "product"}
                    }
                }
            }).then(async data => {
                if (data.body.hits.hits.length != 0) {
                    const products = [];
                    const formatted = await productsService.mapProductCriteria({
                        products: data.body.hits.hits,
                        isincodes: null,
                    });
                    for (let i = 0; i < data.body.hits.hits.length; i++) {
                        products.push(formatted[i]._source);
                    }
                    res.status(200).json({found: true, products: products});
                    return data.body.hits.hits[0]._source;
                } else {
                    res.status(404).json({found: false, reason: "not found"});
                    return;
                }
            });
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return;
        }
    }

    async search(req, res): Promise<boolean> {
        try {
            return await client.search({
                index: index,
                body: {
                    size: sizeMax,
                    query: {
                        bool: {
                            must: [
                                {match: {type: "product"}},
                                req.body.matches
                            ]
                        }
                    }
                }
            }).then(async data => {
                if (data.body.hits.hits.length != 0) {
                    const products = [];
                    const formatted = await productsService.mapProductCriteria({
                        products: data.body.hits.hits,
                        isincodes: null
                    });
                    for (let i = 0; i < data.body.hits.hits.length; i++) {
                        products.push(formatted[i]._source);
                    }
                    res.status(200).json({found: true, products: products});
                    return data.body.hits.hits[0]._source;
                } else {
                    res.status(404).json({found: false, reason: "not found"});
                    return;
                }
            });
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return;
        }
    }

}