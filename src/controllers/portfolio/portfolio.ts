import { client } from "../../utils/elasticsearch";
import { Portfolio } from "../../models/Portfolio";
import {CrudController} from "../../utils";

export class PortfolioController extends CrudController{

    create(req, res): void {

        const portfolio : Portfolio = { username: req.body.username, products: req.body.products };

        client.index({
            index: 'scala',
            type: 'database',
            body : {
                "type": "portfolio",
                "username": portfolio.username,
                "products": portfolio.products
            }
        }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        })

    }

    read(req, res): void {

        client.get({
            index: 'scala',
            type: 'database',
            id: req.query.id
        }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        })

    }

    update(req, res): void {

        const portfolio : Portfolio = { username: req.body.username, products: req.body.products };

        client.update({
            index: 'scala',
            type: 'database',
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
            index: 'scala',
            type: 'database',
            id: req.query.id,
        }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        });

    }

}