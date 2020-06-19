import { client, index, type } from "../../utils/elasticsearch";
import { Portfolio } from "../../models/Portfolio";
import { CrudController } from "../../utils";
import { AuthService } from "../../services";

const authService = AuthService.getInstance();

export class PortfolioController extends CrudController {

    async create(req, res) {

        try {
            const user = await authService.findByEmail({ email: req.body.email })
                .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

            if (user) {
                const portfolio: Portfolio = { id_user: user._id, name: req.body.portfolio_name, productnames: req.body.productnames };

                return await client.index({
                    index: index,
                    type: type,
                    body: {
                        type: "portfolio",
                        id_user: portfolio.id_user,
                        portfolio_name: portfolio.name,
                        productnames: portfolio.productnames
                    }
                }).then(() => {
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

    async findAll(req, res) {

        try {
            const user = await authService.findByEmail({ email: req.body.email })
                .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

            if (user) {

                return await client.search({
                    index: index,
                    body: {
                        query: {
                            match: {type: "portfolio", id_user: user.id_user}
                        }
                    }
                }).then((data) => {
                    if (data.body.hits.hits.length != 0) {
                        res.status(200).json({found: true, portfolios: data.body.hits.hits[0]._source});
                        return data.body.hits.hits[0]._source;
                    } else {
                        res.status(404).json({found: false, reason: "no portfolio found"});
                        return
                    }
                })
            } else {
                res.status(404).json({created: false, reason: "no user with this email"});
                return ;
            }
        } catch (err) {
            res.status(500).json(err);
            return ;
        }

    }

    async findOne(req, res) {

        try {
            const user = await authService.findByEmail({email: req.body.email})
                .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

            if (user) {

                const portfolio: Portfolio = { id_user: user._id, name: req.body.portfolio_name, productnames: req.body.productnames };

                return await client.search({
                    index: index,
                    body: {
                        query: {
                            match: {
                                type: "portfolio",
                                id_user: user.id_user,
                                portfolioname: portfolio.name
                            }
                        }
                    }
                }).then((data) => {
                    if (data.body.hits.hits.length != 0) {
                        res.status(200).json({found: true, portfolio: data.body.hits.hits[0]._source});
                        return data.body.hits.hits[0]._source;
                    } else {
                        res.status(404).json({found: false, reason: "not found"});
                        return
                    }
                })
            }
            else {
                res.status(404).json({found: false, reason: "no user with this email"});
                return ;
            }
        } catch (err) {
            res.status(500).json(err);
            return
        }
    }


    async update(req, res) {

        try {
            const user = await authService.findByEmail({email: req.body.email})
                .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

            if (user) {

                const portfolio: Portfolio = {
                    id_user: user._id,
                    name: req.body.portfolio_name,
                    productnames: req.body.productnames
                };

                return await client.updateByQuery({
                    index: index,
                    type: type,
                    body: {
                        query: [
                            { match: { type: "portfolio"}},
                            { match: { id_user: portfolio.id_user}},
                            { match: { portfolio_name: portfolio.name }}
                        ],
                        script: {
                            source: "ctx._source.productnames ='" + portfolio.productnames + "';"
                            + "ctx._source.portfolio_name ='" + req.body.new_portfolio_name + "';",
                            lang: "painless"
                        }
                    }
                }).then((response) => {
                    if (response.body.updated === 0) {
                        res.status(404).json({updated: false, reason: "no portfolio found"});
                        return false
                    } else {
                        res.status(200).json({updated: true});
                        return true;
                    }
                })
            } else {
                res.status(404).json({updated: false, reason: "no user with this email"});
                return ;
            }
        } catch (err) {
            res.status(500).json(err);
            return
        }
    }

    async delete(req, res) {

        try {
            const user = await authService.findByEmail({email: req.body.email})
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

            if (user) {

                return await client.deleteByQuery({
                    index: index,
                    type: type,
                    body: {
                        query: [
                            { match: { type: "portfolio"}},
                            { match: { id_user: user._id}},
                            { match: { portfolio_name: req.body.portfolio_name }}
                        ]
                    }
                }).then((response) => {
                    if (response.body.deleted === 0) {
                        res.status(404).json({deleted: false, reason: "not found"});
                        return false ;
                    } else {
                        res.status(200).json({deleted: true});
                        return true ;
                    }
                })
            }
            else {
                res.status(404).json({deleted: false, reason: "no user with this email"});
                return false ;
            }
        } catch (err) {
            res.status(500).json(err);
            return false;
        }
    }

    read(req, res) {}

}