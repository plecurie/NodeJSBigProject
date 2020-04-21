import { Crudcontroller } from "../crudcontroller";
import { Profile } from "../../models/Profile";
import { ELASTIC_CLIENT } from "../../utils/elasticsearch";

var profile : Profile;

export class ProfileController extends Crudcontroller {
    create(req, res): void {

        profile = new Profile(req.body.username, req.body.criteria);

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

        profile = new Profile(req.body.username, req.body.criteria);

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