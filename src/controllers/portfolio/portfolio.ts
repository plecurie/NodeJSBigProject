import {client, index, type} from "../../utils/elasticsearch";

export class PortfolioController {

    async create(req, res): Promise<boolean> {
        try {
            return await client.index({
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
                return true;
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return false;
        }
    }

    async findAll(req, res): Promise<boolean> {
        try {
            return await client.search({
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
                    return data.body.hits.hits._source;
                } else {
                    res.status(404).json({found: false, reason: "no portfolio found"});
                    return
                }
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return;
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
                    return data.body.hits.hits;
                } else {
                    res.status(404).json({found: false, reason: "not found"});
                    return
                }
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return
        }
    }

    async update(req, res): Promise<boolean> {
        try {
            await client.search({
                index: index,
                body: {
                    query: {
                        bool: {
                            must: [
                                {match: {type: "portfolio"}},
                                {match: {id_user: req.user_id}},
                                {
                                    match: {name: req.params.name}
                                }]
                        }
                    }
                }
            }).then(async data => {
                if (data.body.hits.hits.length != 0) {
                    return await client.update({
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
                        return true;
                    })
                }
                else {
                    res.status(404).json({found: false, reason: "not found"});
                    return;
                }
            });
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return false
        }
    }

    async delete(req, res): Promise<boolean> {
        try {
            return await client.deleteByQuery({
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
                    return false;
                } else {
                    res.status(200).json({deleted: true});
                    return true;
                }
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return false;
        }
    }
}