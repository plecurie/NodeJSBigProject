import { client, index, type } from "../../utils/elasticsearch";
import { Portfolio } from "../../models/Portfolio";
import { CrudController } from "../../utils";
import { AuthService } from "../../services";

const authService = AuthService.getInstance();

export class PortfolioController extends CrudController{

    async create(req, res): Promise<void> {

        const user = await authService.findByEmail({email: req.body.email})
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

        if (user) {

            const portfolio: Portfolio = {id_user: user._id, products: req.body.products};

            client.index({
                index: index,
                type: type,
                body: {
                    type: "portfolio",
                    id_user: portfolio.id_user,
                    products: portfolio.products
                }
            }, (err, response) => {
                if (err)
                    res.status(500).json(err);
                else
                    res.status(200).json({ created: true });
            })
        }
        else {
            res.status(404).json({created: false, reason: "no user with this email"});
        }

    }

    async read(req, res): Promise<void> {

        const user = await authService.findByEmail({email: req.body.email})
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

        if (user) {
            client.search({
                index: index,
                body : {
                    query: {
                        match: {
                            id_user: user.id_user
                        }
                    }
                }
            }, (err, response) => {
                if (err)
                    res.status(500).json(err);
                else if (response.body.hits.hits) {
                    res.status(200).json({found: true, portfolio: response.body.hits.hits});
                }
                else {
                    res.status(404).json({found: false, reason: "no portfolio found"});
                }

            });
        }
    }

    async update(req, res): Promise<void> {

        const user = await authService.findByEmail({email: req.body.email})
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

        if (user) {

            const portfolio: Portfolio = {id_user: user._id, products: req.body.products};

            client.updateByQuery({
                index: index,
                type: type,
                body: {
                    query: {
                        match: {id_user: portfolio.id_user}
                    },
                    script: {
                        source:
                            "ctx._source.products ='"
                            + portfolio.products + "';",
                        lang: "painless"
                    }
                }
            }, (err, response) => {
                if (err)
                    res.status(500).json(err);
                else
                    res.status(200).json({updated: true});
            })
        }

    }

    async delete(req, res): Promise<void> {

        const user = await authService.findByEmail({email: req.body.email})
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

        if (user) {
            client.deleteByQuery({
                index: index,
                type: type,
                body: {
                    query: {
                        match: {
                            id_user: user._id
                        }
                    }
                }
            }, (err, response) => {
                if (err)
                    res.status(500).json(err);
                else if (response.body.deleted === 0) {
                    res.status(404).json({deleted: false, reason: "no portfolio found"});
                }
                res.status(200).json({deleted: true});
            });
        }
    }

}