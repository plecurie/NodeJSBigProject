import { client, index, type } from "../../utils/elasticsearch";
import {CrudController} from "../../utils";
import { Product } from "../../models/Product";

var product: Product;


export class ProductsController extends CrudController {
    create(req, res): void {

        product = new Product(req.body.isin_code, req.body.name, req.body.category, req.body.criteria);

        client.index({
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

/*    find(req, res): void {
        const body = {
            from: req.query.offset,
            query: { match: {
                    text: {
                        query: req.query.term,
                        operator: 'and',
                        fuzziness: 'auto'
                    } } },
            highlight: { fields: { text: {} } }
        };
        client.search({
            index,
            type,
            body
        }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        })
    }*/

    update(req, res): void {

        product = new Product(req.body.isin_code, req.body.name, req.body.category, req.body.criteria);

        client.update({
            index,
            type,
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