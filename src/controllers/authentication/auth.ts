import {AuthService, GeneratorService, MailerService} from '../../services';
import * as jsonwebtoken from 'jsonwebtoken';
import {User} from "../../models/User";
import {client} from "../../utils/elasticsearch";

const mailerService = MailerService.getInstance();
let authService = AuthService.getInstance();
const generatorService = GeneratorService.getInstance();

export class AuthController {

    constructor() {}

    async signup(req, res) {

        const user: User = {
            firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate,
            email: req.body.email, password: req.body.password, username: req.body.username
        };

        try {
            const userExist = await authService.findByEmail({email: req.body.email})
                .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));

            if (userExist) {
                return res.status(409).json({created: false, reason: "email already exists"});
            } else {
                const mdpCrypted = await generatorService.hashPassword(req.body.password);
                return await client.index({
                    index: 'scala',
                    type: 'database',
                    body: {
                        type: "user",
                        firstname: user.firstname,
                        lastname: user.lastname,
                        username: user.username,
                        birthdate: user.birthdate,
                        email: user.email,
                        password: mdpCrypted
                    }
                }).then(() => {
                    return res.status(201).json({created: true});
                })
            }
        } catch (err) {
            return res.status(500).json({created: false, reason: 'server error'});
        }

    }

    async signin(req, res) {
        try {
            const user = await authService.findByEmail({email: req.body.email})
                .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));
            if (user) {
                const isValidPassword = await authService.checkValidPassword(
                    req.body.password,
                    user._source.password
                );
                if (isValidPassword) {
                    const token = await jsonwebtoken.sign({data: user._id}, process.env.JWT_KEY, {expiresIn: "7d"});
                    res.status(200).json({connect: true, token: token});
                    return true;
                } else {
                    res.status(403).json({connect: false, reason: "invalid password"});
                    return false;
                }
            } else {
                res.status(403).json({connect: false, reason: "invalid email"});
                return false;
            }
        } catch (err) {
            res.status(500).json({connect: false, reason: 'server error'});
            return false;
        }
    }

    async generateNewPassword(req, res) {
        try {
            if (req.user_id) {
                const newPassword = generatorService.randomPassword();
                const newPasswordCrypted = await generatorService.hashPassword(newPassword);
                const passwordUpdated = await authService.updateUserPassword({
                    id: req.user_id,
                    password: newPasswordCrypted
                });

                if (passwordUpdated._shards.failed == 0) {
                    await mailerService.sendEmail(req.body.email, newPassword);
                    res.status(200).json({updated: true});
                } else {
                    res.status(500).json({reason: 'server error'});
                }
            } else {
                res.status(403).json({reason: 'access refused'});
            }
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return;
        }
    }

    async checkToken(req, res, next): Promise<void> {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jsonwebtoken.verify(token, process.env.JWT_KEY, (err, user_id) => {
                if (err) {
                    return res.status(403).json({reason: 'access refused'});
                }
                req.user_id = user_id.data;
                next();
            });
        } else {
            res.sendStatus(401).json({reason: 'unidentified user'});
        }
    }

}