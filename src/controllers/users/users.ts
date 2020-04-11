import { Crudcontroller } from "../crudcontroller";
import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import {User} from "../../models/User";
import { OcrService, MailerService, UserService, GeneratorService } from '../../services';
import * as jsonwebtoken from 'jsonwebtoken';

const ocrService = OcrService.getInstance();
const mailerService = MailerService.getInstance();
const userService = UserService.getInstance();
const generatorService = GeneratorService.getInstance();

export class UsersController extends Crudcontroller {

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

    async ocr(req, res): Promise<void> {
        const path = req.files[0].path;
        const data = await ocrService.processOcr(path);
        ocrService.removeImageOcr(path);
        return res.json({data});
    }

    async login(req, res): Promise<void> {
        try {
            const searchUser = await userService.searchUser({ email: req.body.email })
            .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));
            if(searchUser) {
                const verifyPassword = await userService.checkValidPassword(
                    req.body.password,
                    searchUser._source.password
                );
                if (verifyPassword) {
                    const token = jsonwebtoken.sign({data: searchUser._id}, process.env.JWT_KEY, {expiresIn: "1d"});
                    res.status(200).json({connect: true, token: token});
                } else {
                    res.status(403).json({connect: false});
                }
            } else {
                res.status(403).json({connect: false})
            }
        }
        catch(err) {
            res.status(500).json({connect: false, error: err});
        }
    }

    async forgotPassword(req, res): Promise<void> {
        try {
            const searchUser = await userService.searchUser({ email: req.body.email })
            .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));
            if (searchUser) {
                const randomPassword = generatorService.randomPassword();
                const newPasswordCrypted = await generatorService.hashPassword(randomPassword);
                const passwordUpdated = await userService.updateUserPassword({id: searchUser._id, password: newPasswordCrypted});
                
                if (passwordUpdated._shards.failed == 0) {
                    await mailerService.sendEmail(req.body.email, randomPassword);
                    res.status(200).json({updated: true});
                } else {
                    res.status(404).json({updated: false})
                }
            } else {
                console.log('ss')
                res.status(403).json({updated: false});
            }
        } catch(err) {
            console.error(err);
            return;
        }
    }

    async checkToken(req, res): Promise<void> {
        jsonwebtoken.verify(req.body.token, process.env.JWT_KEY, (err, _) => {
            if (err) {
                res.status(403).json({valid: false});
                return;
            }
            res.status(200).json({valid: true});
        });
    }
}