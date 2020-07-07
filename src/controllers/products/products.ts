import {client, index} from "../../utils/elasticsearch";
import {bulkindexService} from "../../services/request/bulkindex.service";

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
                if (await bulkindexService.getInstance().importContracts(req.body.contracts_filename, req.body.buylist_filename)
                    && await bulkindexService.getInstance().importProducts(req.body.products_filename)) {
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
                res.status(200).json({data: data.body.suggest.products.length != 0 ? data.body.suggest.products[0].options : []});
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }

    async findOne(req, res) {
        try {
            await client.search({
                index: index,
                body: {
                    query: {
                        bool: {
                            must: [
                                {match: {type: "contract"}},
                                {
                                    nested: {
                                        path: "products",
                                        query: {
                                            bool: {
                                                must: [
                                                    {
                                                        match: {
                                                            "products.isincode": req.params.isincode
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }).then(async (result) => {
                const contracts = [];
                if(result.body.hits.hits.length !== 0) {
                    for (let i = 0; i < result.body.hits.hits.length; i++) {
                        const euro_fees = result.body.hits.hits[i]._source.euro_fees;
                        const uc_fees = result.body.hits.hits[i]._source.uc_fees;
                        const name = result.body.hits.hits[i]._source.contract_name;

                        contracts.push({name: name, euro_fees: euro_fees, uc_fees: uc_fees})
                    }
                }
                await client.search({
                    index: index,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {match: {isincode: req.params.isincode}}
                                ]
                            }
                        }
                    }
                }).then((data)=> {
                    if (data.body.hits.hits.length != 0) {
                        data.body.hits.hits[0]._source['contracts'] = contracts;
                        res.status(200).json({found: true, data: data.body.hits.hits});
                    } else {
                        res.status(404).json({found: false, reason: "not found"});
                    }
                })
            });
        } catch (err) {
            console.log(err.meta.body.error);
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