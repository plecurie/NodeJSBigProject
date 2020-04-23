import { CrudUser } from "../../utils";
import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import {User} from "../../models/User";
import { GeneratorService } from '../../services';

const generatorService = GeneratorService.getInstance();

export class UsersController extends CrudUser {

    async create(req, res) {

        const user = new User(req.body.firstname, req.body.lastname, req.body.birthday, req.body.email, req.body.password);
        const mdpCrypted = await generatorService.hashPassword(req.body.password);
        
        ELASTIC_CLIENT.index({
            index: 'scala',
            type: 'users',
            body : {
                firstname: user.firstname,
                lastname: user.lastname,
                birthday: user.birthday,
                email: user.email,
                password: mdpCrypted
            }
        }, (err, response) => {
            if (err) {
                res.status(404).send(err);
                return;
            }
            res.status(200).json(response);
        });
    }

    read(req, res): void {
        ELASTIC_CLIENT.get({
                index: 'scala',
                type: 'users',
                id: req.query.id
            }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        })
    }

    update(req, res): void {
         ELASTIC_CLIENT.update({
             index: 'scala',
             type: 'users',
             id: req.query.id,
             body: {
                 doc: {
                     "firstname": req.body.firstname,
                     "lastname": req.body.lastname,
                     "email": req.body.email
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
            type: 'users',
            id: req.query.id,
        }, (err, response) => {
            if (err)
                res.send(err);
            else
                res.json(response)
        });
    }
}