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
                res.status(409).json({created: false, reason: "email already exists"});
            } else {
                const mdpCrypted = await generatorService.hashPassword(req.body.password);
                await client.index({
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
                    res.status(201).json({created: true});
                })
            }
        } catch (err) {
            res.status(500).json({created: false, reason: 'server error'});
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
                    true;
                } else {
                    res.status(403).json({connect: false, reason: "invalid password"});
                    false;
                }
            } else {
                res.status(403).json({connect: false, reason: "invalid email"});
                false;
            }
        } catch (err) {
            res.status(500).json({connect: false, reason: 'server error'});
            false;
        }
    }

    async generateNewPassword(req, res) {
        try {
            if (req.user_id) {

                const user = await authService.findById({_id: req.user_id})
                    .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._id === req.user_id));

                if (user) {
                    const newPassword = generatorService.randomPassword();
                    const newPasswordCrypted = await generatorService.hashPassword(newPassword);
                    await authService.updateUserPassword({
                        id: req.user_id,
                        password: newPasswordCrypted
                    }).then(async ()=>{
                        await mailerService.sendEmail(user._source.email, newPassword);
                        res.status(200).json({updated: true});
                    });
                }
                else {
                    res.status(403).json({updated: false, reason: 'access refused'});
                }
            } else {
                res.status(403).json({updated: false, reason: 'access refused'});
            }
        } catch (err) {
            res.status(500).json({updated: false, reason: 'server error'});

        }
    }

    async checkToken(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            let token = authHeader;
            if(authHeader.split(' ')[1]) {
                token = authHeader.split(' ')[1];
            }
            try {
                jsonwebtoken.verify(token, process.env.JWT_KEY, (err, user_id) => {
                    if (err) {
                        res.status(403).json({reason: 'access refused'});
                    }
                    req.user_id = user_id.data;
                    next();
                });
            } catch (err) {
                res.status(500).json({reason: 'server error'})
            }

        } else {
            res.status(401).json({reason: 'unidentified user'});
        }
    }

}