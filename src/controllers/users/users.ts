import { Crudcontroller } from "../crudcontroller";
import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import {User} from "../../models/User";
import { OcrService, MailerService } from '../../services';
import * as jsonwebtoken from 'jsonwebtoken';

const ocrService = OcrService.getInstance();
const mailerService = MailerService.getInstance();

export class UsersController extends Crudcontroller {

    create(req, res) : void {

        const user = new User(req.body.firstname, req.body.lastname, req.body.email, req.body.password);
        const mdpCrypted = jsonwebtoken.sign(user.password, process.env.JWT_KEY);
        
        ELASTIC_CLIENT.index({
            index: 'scala',
            type: 'users',
            body : {
                firstname: user.firstname,
                lastname: user.lastname,
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

    async ocr(req, res): Promise<void> {
        const path = req.files[0].path;
        const data = await ocrService.processOcr(path);
        ocrService.removeImageOcr(path);
        return res.json({data});
    }

    async forgotPassword(req, res): Promise<void> {
        try {
            const searchUser = await ELASTIC_CLIENT.search({
                index: 'scala',
                type: 'users',
                body: { query: { match: { email: req.body.email }}}
            }).then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));
            if (searchUser) {
                const randomPassword = String.fromCodePoint(...Array.from({length: 16}, () => Math.floor(Math.random() * 57) + 65))
                const newPasswordCrypted = jsonwebtoken.sign(randomPassword, process.env.JWT_KEY);
                const passwordUpdated = await ELASTIC_CLIENT.update({
                    index: 'scala',
                    type: 'users',
                    id: searchUser._id,
                    body: { doc: { password: newPasswordCrypted }}
                }).then(pu => pu.body);
                
                if (passwordUpdated._shards.failed == 0) {
                    await mailerService.sendEmail(req.body.email, randomPassword);
                    res.json({updated: true, message: `email send to ${searchUser._source.email}`});
                } else {
                    res.json({updated: false})
                }
            } else {
                res.json({user: {}});
            }
        } catch(err) {
            console.error(err);
        }
    }


}