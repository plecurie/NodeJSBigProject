import { Profile } from "../../models/Profile";
import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import {CrudController} from "../../utils";
import {Portfolio} from "../../models/Portfolio";

export class ProfileController extends CrudController {
    create(req, res): void {

        const profile : Profile = { username: req.body.username, criteria: req.body.criteria };

        ELASTIC_CLIENT.index({
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

        const profile : Profile = { username: req.body.username, criteria: req.body.criteria };

        ELASTIC_CLIENT.update({
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