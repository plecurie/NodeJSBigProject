import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import { Producer } from "../../models/Producer";
import {CrudController} from "../../utils";
import {Portfolio} from "../../models/Portfolio";

export class ProducersController extends CrudController {
    create(req, res): void {

        const producer : Producer = { name: req.body.name, products: req.body.products };

        ELASTIC_CLIENT.index({
            index: 'scala',
            type: 'database',
            body : {
                "type": "producer",
                "name": producer.name,
                "products": producer.products,
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

        const producer : Producer = { name: req.body.name, products: req.body.products };

        ELASTIC_CLIENT.update({
            index: 'scala',
            type: 'database',
            id: req.query.id,
            body: {
                doc: {
                    "type": "producer",
                    "name": producer.name,
                    "products": producer.products,
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