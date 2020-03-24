import { Crudcontroller } from "../crudcontroller";
import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import {User} from "../../models/User";
import { OcrService } from '../../services';
const ocrService = OcrService.getInstance();

export class UsersController extends Crudcontroller {

    create(req, res) : void {

        const user = new User(req.body.firstname, req.body.lastname, req.body.email);

        ELASTIC_CLIENT.index({
            index: 'scala',
            type: 'users',
            body : {
                "firstname": user.firstname,
                "lastname": user.lastname,
                "email": user.email
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

    async ocr(req, res): Promise<void> {
        const path = req.files[0].path;
        const data = await ocrService.processOcr(path);
        ocrService.removeImageOcr(path);
        return res.json({data});
    }


}