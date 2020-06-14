import { MailerService, AuthService, GeneratorService } from '../../services';
import * as jsonwebtoken from 'jsonwebtoken';
import {User} from "../../models/User";
import {client, index, type} from "../../utils/elasticsearch";

const mailerService = MailerService.getInstance();
const userService = AuthService.getInstance();
const generatorService = GeneratorService.getInstance();

export class AuthController {
    
    constructor() {}

    async signup(req, res) {

        const user: User = { firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate,
            email: req.body.email, password: req.body.password, username: req.body.username };
        const mdpCrypted = await generatorService.hashPassword(req.body.password);

        return client.index({
            index: index,
            type: type,
            body : {
                "type": "user",
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                birthdate: user.birthdate,
                email: user.email,
                password: mdpCrypted
            }
        }, (err, response) => {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.status(201).json(response);
        });
    }

    async signin(req, res): Promise<void> {
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
                console.log('ss');
                res.status(403).json({updated: false});
            }
        } catch(err) {
            console.error(err);
            return;
        }
    }

    async checkToken(req, res): Promise<void> {
        jsonwebtoken.verify(req.body.token, process.env.JWT_KEY, (err) => {
            if (err) {
                res.json({valid: false});
                return;
            }
            res.json({valid: true});
        });
    }
}