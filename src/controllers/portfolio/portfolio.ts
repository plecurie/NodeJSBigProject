import { client, index, type } from "../../utils/elasticsearch";
import { AuthService } from "../../services";

const authService = AuthService.getInstance();

export class PortfolioController {

    async create(req, res): Promise<boolean> {

        try {
            const user = await authService.findByEmail({ email: req.body.email })
                .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

            if (user) {

                return await client.index({
                    index: index,
                    type: type,
                    body: {
                        id_user: user._id,
                        type: "portfolio",
                        name: req.body.name,
                        products: req.body.products
                    }
                }).then((data) => {
                    res.status(200).json({created: true});
                    return true;
                })}
            else {
                res.status(404).json({created: false, reason: "no user with this email"});
                return false;
            }
        } catch (err) {
            res.status(500).json(err);
            return false;
        }

    }

    async findAll(req, res): Promise<boolean> {

        try {
            const user = await authService.findByEmail({ email: req.body.email })
                .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

            if (user) {
                return await client.search({
                    index: index,
                    type: type,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    { match: { id_user: user._id }},
                                    { match: { type: "portfolio" }}
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
            } else {
                res.status(404).json({found: false, reason: "no user with this email"});
                return ;
            }
        } catch (err) {
            res.status(500).json(err);
            return ;
        }

    }

    async findOne(req, res): Promise<boolean> {
        try {
            const user = await authService.findByEmail({email: req.body.email})
                .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

            if (user) {
                return await client.search({
                    index: index,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    { match: { id_user: user._id }},
                                    { match: { name: req.params.name }},
                                    { match: { type: "portfolio" }}
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
            } else {
                res.status(404).json({found: false, reason: "no user with this email"});
                return ;
            }
        } catch (err) {
            res.status(500).json(err);
            return
        }
    }

    async update(req, res): Promise<boolean> {

        try {
            const user = await authService.findByEmail({email: req.body.email})
                .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

            if (user) {

                const portfolio = await client.search({
                    index: index,
                    type: type,
                    body: {
                        query: {
                            bool: {
                                must: [{match: {type: "portfolio"}}, {match: {id_user: user._id}}, {match: {name: req.params.name}}]
                            }
                        }
                    }
                }).then(data => data.body.hits.hits[0]);

                if (portfolio) {
                    return await client.update({
                        index: index,
                        type: type,
                        id: portfolio._id,
                        body: {
                            doc: {
                                name: req.body.newname,
                                products: req.body.products
                            }
                        }
                    }).then(() => {
                        res.status(200).json({ updated: true });
                        return true;
                    })
                }
                else {
                    res.status(404).json({updated: false, reason: "no portfolio with this name"});
                    return false;
                }

            } else {
                res.status(404).json({updated: false, reason: "no user with this email"});
                return false;
            }
        } catch (err) {
            res.status(500).json(err);
            return false
        }
    }

    async delete(req, res): Promise<boolean> {

        try {
            const user = await authService.findByEmail({email: req.body.email})
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

            if (user) {
                return await client.deleteByQuery({
                    index: index,
                    type: type,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    { match: { type: "portfolio" }},
                                    { match: { id_user: user._id }},
                                    { match: { name: req.params.name }}
                                ]
                            }
                        }
                    }
                }).then((response) => {
                    if (response.body.deleted === 0) {
                        res.status(404).json({ deleted: false, reason: "not found"});
                        return false ;
                    } else {
                        res.status(200).json({ deleted: true});
                        return true ;
                    }
                })
            } else {
                res.status(404).json({ deleted: false, reason: "no user with this email"});
                return false ;
            }
        } catch (err) {
            res.status(500).json(err);
            return false;
        }
    }

}