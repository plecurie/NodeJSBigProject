import {client, index, type} from "../../utils/elasticsearch";
import {BulkProductsService, ProductsService} from "../../services";

const bulkProductsService = BulkProductsService.getInstance();
const productsService = ProductsService.getInstance();

export class ProductsController {

    async update_db(req, res) {
        try {
            await client.deleteByQuery({
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
                if (await bulkProductsService.importProducts(
                    req.body.products_filename,
                    req.body.contracts_filename,
                    req.body.buylist_filename)) {
                    res.status(200).json({updated: true});
                } else {
                    res.status(400).json({reason: 'malformed exception'});
                }
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
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
                if (data.body.suggest) {
                    return res.status(200).json({data: data.body.suggest.products[0].options});
                } else {
                    return res.status(200).json({data: []});
                }
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }

    async findOne(req, res) {
        try {
            await client.search({
                index: index,
                type: type,
                body: {
                    query: {
                        bool: {
                            should: [
                                {match: {isincode: req.params.isincode}},
                                {
                                    nested: {
                                        path: "products",
                                        query: {
                                            bool: {
                                                should: [
                                                    {match: {"products.isincode": req.params.isincode}},
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then((response) => {

                if (response.body.hits.hits.length !== 0) {

                    const contracts = [];
                    let product = [];

                    for (let i = 0; i < response.body.hits.hits.length; i++) {
                        switch (response.body.hits.hits[i]._source.type) {
                            case "contract":
                                contracts.push({
                                    name: response.body.hits.hits[i]._source.contract_name,
                                    euro_fees: response.body.hits.hits[i]._source.euro_fees,
                                    uc_fees: response.body.hits.hits[i]._source.uc_fees
                                });
                                break;
                            case "product":
                                product.push(response.body.hits.hits[i]);
                                break;
                            default:
                                break
                        }
                    }
                    if (product.length !== 0) {
                        product[0]._source['contracts'] = contracts.length != 0 ? contracts : [];
                        res.status(200).json({found: true, data: product});
                    } else {
                        res.status(404).json({found: false, reason: "not found"});
                    }
                } else {
                    res.status(404).json({found: false, reason: "not found"});
                }
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }

    async findProductsList(req, res) {
        const isinCodes = req.body.isincodes;
        if (!isinCodes) return res.status(400).json({reason: 'bad request'});
        if (!isinCodes.length) return res.status(200).json([]);
        try {
            const products = await productsService.findProducts(isinCodes);
            return res.status(200).json(products);
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }

    async getProductsByCriteria(req, res) {
        try {
            const { allExclusions, isScoring, percentages, scoringMethod } = req.body;
            if(!allExclusions) return res.status(400).json({reason: 'No exclusions'});
            const products = await productsService.getProductsByCriteria(allExclusions);
            if(!isScoring) return res.status(200).json(products.map(({_source: { isincode }}) => isincode));
            const scoringProducts = productsService[scoringMethod](products, percentages);
            return res.status(200).json(scoringProducts);
        } catch (err) {
            console.log(err);
            res.status(500).json({reason: 'server error'});
        }
    }


    async findAll(req, res) {
        try {
            let pname = "";
            if (req.body.product_name) pname = req.body.product_name;
            await client.search({
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
            }).then(async data => {
                if (data.body.hits.hits.length != 0) {
                    res.status(200).json({found: true, data: data.body.hits.hits});
                } else {
                    res.status(404).json({found: false, reason: "not found"});
                }
            });
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }

    async search(req, res) {
        try {
            let pname = "";
            if (req.body.product_name) pname = req.body.product_name;

            await client.search({
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
                    res.status(200).json({found: true, data: data.body.hits.hits});
                } else {
                    res.status(404).json({found: false, reason: "not found"});
                }
            });
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }
}
