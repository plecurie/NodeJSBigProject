import {client, index, type} from "../../utils/elasticsearch";
import { Portfolio } from "../../models/Portfolio";
import {CrudController} from "../../utils";
import {AuthService} from "../../services";

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
                    res.send(err);
                else
                    res.json(response)
            })
        }
        else {
            res.status(404).json({created: false, reason: "no user with this email"});
        }

    }

    read(req, res): void {

        client.get({
            index: index,
            type: type,
            id: req.query.id
        }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        })

    }

    update(req, res): void {

        const portfolio: Portfolio = { username: req.body.username, products: req.body.products };

        client.update({
            index: index,
            type: type,
            id: req.query.id,
            body: {
                doc: {
                    "type": "portfolio",
                    "username": portfolio.username,
                    "products": portfolio.products
                }
            }
        }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        })
    }

    delete(req, res): void {

        client.delete({
            index: index,
            type: type,
            id: req.query.id,
        }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        });

    }

}