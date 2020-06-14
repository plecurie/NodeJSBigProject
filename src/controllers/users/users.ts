import { CrudController } from "../../utils";
import {client, index, type} from "../../utils/elasticsearch";
import { User } from "../../models/User";
import {TransportRequestCallback} from "@elastic/elasticsearch/lib/Transport";

export class UsersController extends CrudController {

    read(req, res): void {
        client.get({
                index: 'scala',
                type: 'database',
                id: req.query.email
            }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        })
    }

    search(req, res): TransportRequestCallback {
        let matches = req.body.matches;
        let fields = req.body.fields;

        return client.search({
            index,
            type,
            body : {
                query: {
                    match: {
                        matches
                    }
                },
                aggs: {
                    tags: {
                        terms: {
                            fields
                        }
                    }
                }
            }
        }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        })
    }

    update(req, res): void {

        const user : User = { firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate,
            email: req.body.email, password: req.body.password, username: req.body.username };

         client.update({
             index: 'scala',
             type: 'database',
             id: req.query.id,
             body: {
                 doc: {
                     "type": "user",
                     "firstname": user.firstname,
                     "lastname": user.lastname,
                     "birthdate": user.birthdate,
                     "email": user.email,
                     "password": user.password,
                     "username": user.username
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

    create(req, res): void {}
}