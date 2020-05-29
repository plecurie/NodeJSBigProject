import { Profile } from "../../models/Profile";
import { client } from "../../utils/elasticsearch";
import {CrudController} from "../../utils";
import {Portfolio} from "../../models/Portfolio";

export class ProfileController extends CrudController {
    create(req, res): void {

        const profile : Profile = { username: req.body.username, criteria: req.body.criteria };

        client.index({
            index: 'scala',
            type: 'database',
            body : {
                "type": "profile",
                "username": profile.username,
                "criteria": profile.criteria
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

        const profile : Profile = { username: req.body.username, criteria: req.body.criteria };

        client.update({
            index: 'scala',
            type: 'database',
            id: req.query.id,
            body: {
                doc: {
                    "type": "profile",
                    "username": profile.username,
                    "criteria": profile.criteria
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