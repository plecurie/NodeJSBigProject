import { Profile } from "../../models/Profile";
import {client, index, type} from "../../utils/elasticsearch";
import {CrudController} from "../../utils";
import {Portfolio} from "../../models/Portfolio";

export class ProfileController extends CrudController {
    create(req, res): void {

        const profile : Profile = { username: req.body.username, criteria: req.body.criteria };

        client.index({
            index: index,
            type: type,
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

    update(req, res): void {

        const profile : Profile = { username: req.body.username, criteria: req.body.criteria };

        client.update({
            index: index,
            type: type,
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