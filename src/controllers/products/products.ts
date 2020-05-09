import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import {CrudController} from "../../utils";
import { Product } from "../../models/Product";

var product: Product;


export class ProductsController extends CrudController {
    create(req, res): void {

        product = new Product(req.body.isin_code, req.body.name, req.body.category, req.body.criteria);

        ELASTIC_CLIENT.index({
            index: 'scala',
            type: 'database',
            body : {
                "type": "product",
                "isin_code": product.isin_code,
                "name": product.name,
                "category": product.category,
                "criteria": product.criteria
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

        product = new Product(req.body.isin_code, req.body.name, req.body.category, req.body.criteria);

        ELASTIC_CLIENT.update({
            index: 'scala',
            type: 'database',
            id: req.query.id,
            body: {
                doc: {
                    "type": "product",
                    "isin_code": product.isin_code,
                    "name": product.name,
                    "category": product.category,
                    "criteria": product.criteria
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