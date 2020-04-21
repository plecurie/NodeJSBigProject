import { Crudcontroller } from "../crudcontroller";
import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import { User } from "../../models/User";
import { OcrService } from '../../services';
const ocrService = OcrService.getInstance();

var user : User;

export class UsersController extends Crudcontroller {

    create(req, res) : void {

        user = new User(req.body.firstname, req.body.lastname, req.body.birthdate, req.body.email, req.body.password, req.body.username);

        ELASTIC_CLIENT.index({
            index: 'scala',
            type: 'database',
            body : {
                "type": "user",
                "firstname": user.firstname,
                "lastname": user.lastname,
                "birthdate": user.birthdate,
                "email": user.email,
                "password": user.password,
                "username": user.username
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

        user = new User(req.body.firstname, req.body.lastname, req.body.birthdate, req.body.email, req.body.password, req.body.username);

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

    async ocr(req, res): Promise<void> {
        const path = req.files[0].path;
        const data = await ocrService.processOcr(path);
        ocrService.removeImageOcr(path);
        return res.json({data});
    }


}