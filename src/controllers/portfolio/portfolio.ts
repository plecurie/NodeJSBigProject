import {client, index, type} from "../../utils/elasticsearch";
import {PortfolioService} from "../../services";

const portfolioService = PortfolioService.getInstance();

export class PortfolioController {
    async read(req, res) {
        try {
            const products = await portfolioService.getProducts(req.user_id);
            return res.status(200).json(products);
        } catch (err) {
            return res.status(500).json({reason: 'server error'});
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

    async addProducts(req, res) {
        const isinCodes = req.body.isincodes;
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
            }).then(async (response) => {
                const hits = response.body.hits.hits[0];
                const products = [
                    ...await portfolioService.handleProducts(hits._source.products),
                    ...isinCodes
                ];
                const mappedProducts = [...new Set(products)].map(isincode => ({ isincode }));
                await portfolioService.update(hits._id, mappedProducts);
                return res.sendStatus(200);
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({reason: 'server error'});
        }
    }

    async removeProducts(req, res) {
        const isinCodes = req.body.isincodes;
        if (isinCodes.length !== 0) {
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
                }).then(async (response) => {
                    const {_source: { products }, _id: id} = response.body.hits.hits[0];
                    const userProducts = await portfolioService.handleProducts(products);
                    const productsToSave = userProducts.filter(idProduct => !isinCodes.includes(idProduct));
                    const mapProducts = productsToSave.map(isincode => ({isincode}));
                    await portfolioService.update(id, mapProducts);
                    return res.status(200).json({removed: true})
                })
            } catch (err) {
                res.status(500).json({reason: 'server error'});
            }
        }
    }

}
