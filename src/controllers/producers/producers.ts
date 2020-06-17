import {client, index, type} from "../../utils/elasticsearch";
import { Firm } from "../../models/Firm";
import {CrudController} from "../../utils";
import {Portfolio} from "../../models/Portfolio";

export class ProducersController extends CrudController {
    create(req, res): void {

        const producer : Firm = { name: req.body.name, products: req.body.products };

        client.index({
            index: index,
            type: type,
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

        const producer : Firm = { name: req.body.name, products: req.body.products };

        client.update({
            index: index,
            type: type,
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