import {client, index, type} from "../../utils/elasticsearch";

export class PortfolioController {

    async read(req, res) {
        try {
            await client.search({
                index: index,
                body: {
                    query: {
                        bool: {
                            must: [
                                {match: {id_user: req.user_id}},
                                {match: {type: "portfolio"}}
                            ]
                        }
                    }
                }
            }).then((data) => {
                if (data.body.hits.hits.length != 0) {
                    res.status(200).json({found: true, portfolios: data.body.hits.hits});
                    data.body.hits.hits._source;
                } else {
                    res.status(404).json({found: false, reason: "no portfolio found"});
                }
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }

    async update(req, res) {
        try {
            await client.search({
                index: index,
                body: {
                    query: {
                        bool: {
                            must: [
                                {match: {type: "portfolio"}},
                                {match: {id_user: req.user_id}},
                            ]
                        }
                    }
                }
            }).then(async data => {
                if (data.body.hits.hits.length != 0) {
                    await client.update({
                        index: index,
                        type: type,
                        id: data.body.hits.hits[0]._id,
                        body: {
                            doc: {
                                products: req.body.products
                            }
                        }
                    }).then(() => {
                        res.status(200).json({updated: true});
                    })
                } else {
                    res.status(404).json({updated: false, reason: "not found"});
                }
            });
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }

    async removeProduct(req, res) {
        const isinCodes = req.body.isincodes;

        if (isinCodes.length !== 0) {
            await client.search({
                index: index,
                type: type,
                body: {
                    query: {
                        bool: {
                            should: [
                                {match: {isincode: isinCodes[0]}},
                                {
                                    nested: {
                                        path: "products",
                                        query: {
                                            bool: {
                                                should: [
                                                    {match: {"products.isincode": isinCodes[0]}},
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
                console.log(response)
                // delete nested
            })
        }
    }

}