import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import { Portfolio } from "../../models/Portfolio";
import {CrudUser} from "../../utils";

var portfolio : Portfolio;

export class PortfolioController extends CrudUser{

    create(req, res): void {

        portfolio = new Portfolio(req.body.username,req.body.products);

        ELASTIC_CLIENT.index({
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

        ELASTIC_CLIENT.get({
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

        portfolio = new Portfolio(req.body.username,req.body.products);

        ELASTIC_CLIENT.update({
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

        ELASTIC_CLIENT.delete({
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