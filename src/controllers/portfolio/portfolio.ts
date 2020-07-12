import {client, index, type} from "../../utils/elasticsearch";
import {PortfolioService} from "../../services";

const portfolioService = PortfolioService.getInstance();

const getProducts = (source) => {
    if (!source.products) return [];
    if (source.products instanceof Object) return [source.products.isincode];
    if(source.products.length) return source.products.map(({isincode}) => isincode);
    return [];
};

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
                const source = data.body.hits.hits[0]._source;
                return res.status(200).json({products: getProducts(source)});
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

                    const products = response.body.hits.hits[0]._source.products;
                    const id = response.body.hits.hits[0]._id;

                    if (products.length != 0) {
                        for (let i = 0; i < products.length; i++) {
                            for (let isincode of isinCodes) {

                                if (products[i].isincode === isincode) {
                                    products.splice(products[i], 1)
                                }
                            }
                        }
                        await portfolioService.update(id, products).then(() =>
                            res.status(200).json({removed: true}));

                    } else {
                        res.status(404).json({removed: false, reason: "no products to remove"});
                    }
                })
            } catch (err) {
                res.status(500).json({reason: 'server error'});
            }
        }
    }

}
