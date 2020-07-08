import {client, index, type} from "../../utils/elasticsearch";

export class PortfolioController {

    async create(req, res) {
        try {
            await client.index({
                index: index,
                type: type,
                body: {
                    id_user: req.user_id,
                    type: "portfolio",
                    name: req.body.name,
                    products: req.body.products
                }
            }).then(() => {
                res.status(200).json({created: true});
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({reason: 'server error'});
        }
    }

    async findAll(req, res) {
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

    async findOne(req, res) {
        try {
            await client.search({
                index: index,
                body: {
                    query: {
                        bool: {
                            must: [
                                {match: {id_user: req.user_id}},
                                {match: {name: req.params.name}},
                                {match: {type: "portfolio"}}
                            ]
                        }
                    }
                }
            }).then((data) => {
                if (data.body.hits.hits.length != 0) {
                    res.status(200).json({found: true, portfolio: data.body.hits.hits});
                    data.body.hits.hits;
                } else {
                    res.status(404).json({found: false, reason: "not found"});
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
                                {match: {name: req.params.name}}
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
                                name: req.body.newname,
                                products: req.body.products
                            }
                        }
                    }).then(() => {
                        res.status(200).json({updated: true});
                    })
                }
                else {
                    res.status(404).json({updated: false, reason: "not found"});
                }
            });
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }

    async delete(req, res) {
        try {
            await client.deleteByQuery({
                index: index,
                type: type,
                body: {
                    query: {
                        bool: {
                            must: [
                                {match: {type: "portfolio"}},
                                {match: {id_user: req.user_id}},
                                {match: {name: req.params.name}}
                            ]
                        }
                    }
                }
            }).then((response) => {
                if (response.body.deleted === 0) {
                    res.status(404).json({deleted: false, reason: "not found"});
                } else {
                    res.status(200).json({deleted: true});
                }
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }
}