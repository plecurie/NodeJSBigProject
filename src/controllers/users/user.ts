import { Crudcontroller } from "../crudcontroller";
import { ELASTIC_CLIENT } from "../../utils/elasticsearch";

export class UserController extends Crudcontroller {

    create(req, res) : void {
        ELASTIC_CLIENT.index({
            index: 'user',
            type: '_doc',
            body : {
                "firstname": req.body.firstname,
                "lastname": req.body.lastname,
                "email": req.body.email
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
                index: 'user',
                id: req.query.id
            }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        })
    }

    update(req, res): void {
        // ELASTIC_CLIENT.update({
        //     index: 'user',
        //     id: req.query.id,
        //     body: {
        //         doc: {
        //             "firstname": req.body.firstname,
        //             "lastname": req.body.lastname,
        //             "email": req.body.email
        //         }
        //     }
        // }, (err, response) => {
        //     if (err)
        //         res.send(err);
        //     else
        //         res.json(response)
        // })
    }

    delete(req, res): void {
        ELASTIC_CLIENT.delete({
            index: 'user',
            id: req.query.id,
            type: '_doc'
        }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        });
    }

}