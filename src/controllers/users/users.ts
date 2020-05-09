import { CrudController } from "../../utils";
import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import { User } from "../../models/User";
import { GeneratorService } from '../../services';
const generatorService = GeneratorService.getInstance();

export class UsersController extends CrudController {

    async create(req, res) {

        const user : User = { firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate,
            email: req.body.email, password: req.body.password, username: req.body.username };
        const mdpCrypted = await generatorService.hashPassword(req.body.password);
        
        ELASTIC_CLIENT.index({
            index: 'scala',
            type: 'database',
            body : {
                "type": "user",
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                birthday: user.birthdate,
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

        const user : User = { firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate,
            email: req.body.email, password: req.body.password, username: req.body.username };

         ELASTIC_CLIENT.update({
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