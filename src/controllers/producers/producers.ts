import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import { Producer } from "../../models/Producer";
import {CrudUser} from "../../utils";

var producer : Producer;

export class ProducersController extends CrudUser {
    create(req, res): void {

        producer = new Producer(req.body.name, req.body.products);

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

        producer = new Producer(req.body.name, req.body.products);

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