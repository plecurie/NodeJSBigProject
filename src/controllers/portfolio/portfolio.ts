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

                    let products = [];
                    const id = response.body.hits.hits[0]._id;
                    if (response.body.hits.hits.length != 0 && response.body.hits.hits[0]._source.products != undefined)
                        products.push(response.body.hits.hits[0]._source.products);

                    for (let isincode of isinCodes) {
                        products.push({isincode: isincode});
                    }

                    await portfolioService.update(id, products).then(() =>
                        res.status(200).json({added: true}));

                })
            } catch (err) {
                res.status(500).json({reason: 'server error'});
            }

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
                    await portfolioService.update(id, productsToSave);
                    return res.status(200).json({removed: true})
                })
            } catch (err) {
                res.status(500).json({reason: 'server error'});
            }
        }
    }

}
