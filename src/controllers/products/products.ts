import {client, index} from "../../utils/elasticsearch";
import {bulkindexService} from "../../services/request/bulkindex.service";
import {ProductsService} from "../../services";

const productsService = ProductsService.getInstance();

export class ProductsController {

    async update_db(req, res): Promise<boolean> {
        try {
            return await client.deleteByQuery({
                index: index,
                body: {
                    query: {
                        bool: {
                            must: [
                                {match: {type: "product"}},
                                {match: {type: "contract"}}
                            ]
                        }
                    }
                }
            }).then(async () => {
                if (await bulkindexService.getInstance().importContracts(req.body.contracts_filename, req.body.buylist_filename)
                && await bulkindexService.getInstance().importProducts(req.body.products_filename)) {
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

    async suggest(req, res) {
        try {
            await client.search({
                index: index,
                body: {
                    suggest: {
                        products: {
                            prefix: req.params.input,
                            completion: {
                                field: "suggest",
                                skip_duplicates: true
                            }
                        }
                    }
                }
            }).then(async (data) => {
                const formatted = await productsService.mapProductCriteria({
                    products: data.body.suggest.products[0].options,
                    isincodes: null
                })
                for (const mIC of formatted) {
                    //const morningCriteria = mIC._source.criteria.find(item => item.name == 'morningstarSustainabilityRating');
                    mIC._source['criteriaCategorieAverage'] = productsService.valuesComputed(mIC._source.criteria);
                }
                console.log(formatted.length);
                res.json({data: formatted})
            })
        }
        catch (err) {
            console.log(err.meta.body.error)
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
                    res.status(200).json({found: true, data: formatted[0]._source});
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

    async findAll(req, res) {
        try {
            let pname = "";
            if (req.body.product_name) pname = req.body.product_name;
            const response = await client.search({
                index: index,
                body: {
                    from: 0,
                    size: 20,
                    query: {
                        match: {type: "product"},
                    },
                    sort: [{product_name: "asc"}],
                    search_after: [pname]
                }
            });

            let formatted = await productsService.mapProductCriteria({
                products: response.body.hits.hits,
                isincodes: null,
            });
            for (const mIC of formatted) {
                //const morningCriteria = mIC._source.criteria.find(item => item.name == 'morningstarSustainabilityRating');
                mIC._source['criteriaCategorieAverage'] = productsService.valuesComputed(mIC._source.criteria);;
                
            }
            res.status(200).json({found: true, data: formatted});
            return formatted;

        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return;
        }
    }

    async search(req, res): Promise<boolean> {
        try {
            let pname = "";
            if (req.body.product_name) pname = req.body.product_name;

            return await client.search({
                index: index,
                body: {
                    size: 20,
                    query: {
                        bool: {
                            must: [
                                {match: {type: "product"}},
                                req.body.matches
                            ]
                        }
                    },
                    sort: [{product_name: "asc"}],
                    search_after: [pname]
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
                    res.status(200).json({found: true, data: products});
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