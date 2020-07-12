import {AuthService, GeneratorService, MailerService, PortfolioService} from '../../services';
import * as jsonwebtoken from 'jsonwebtoken';
import {User} from "../../models/User";
import {client} from "../../utils/elasticsearch";

const mailerService = MailerService.getInstance();
let authService = AuthService.getInstance();
const generatorService = GeneratorService.getInstance();
const portfolioService = PortfolioService.getInstance();

export class AuthController {

    constructor() {
    }

    async signup(req, res) {

        const user: User = {
            email: req.body.email,
            password: req.body.password
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
                        email: user.email,
                        password: mdpCrypted
                    }
                }).then((response) => {
                    portfolioService.create(response.body._id);
                    res.status(201).json({created: true});
                })
            }
        } catch (err) {
            res.status(500).json({created: false, reason: 'server error'});
        }

    }

    async signin(req, res) {
        const user: User = {
            email: req.body.email,
            password: req.body.password
        };
        try {
            const foundUser = await authService.findByEmail({email: user.email})
                .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === user.email));
            if (foundUser) {
                const isValidPassword = await authService.checkValidPassword(
                    user.password,
                    foundUser._source.password
                );
                if (isValidPassword) {
                    const token = await jsonwebtoken.sign({data: foundUser._id}, process.env.JWT_KEY, {expiresIn: "7d"});
                    res.status(200).json({connect: true, token: token});
                } else {
                    res.status(403).json({connect: false, reason: "invalid password"});
                }
            } else {
                res.status(403).json({connect: false, reason: "invalid email"});
            }
        } catch (err) {
            res.status(500).json({connect: false, reason: 'server error'});
        }
    }

    async generateNewPassword(req, res) {
        try {
            if (req.user_id) {

                const foundUser = await authService.findById({_id: req.user_id})
                    .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._id === req.user_id));

                const newPassword = generatorService.randomPassword();
                const newPasswordCrypted = await generatorService.hashPassword(newPassword);
                await authService.updateUserPassword({
                    id: req.user_id,
                    password: newPasswordCrypted
                }).then(async () => {
                    await mailerService.sendEmail(foundUser._source.email, newPassword);
                    res.status(200).json({updated: true});
                });

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
            if (authHeader.split(' ')[1]) {
                token = authHeader.split(' ')[1];
            }
            try {
                jsonwebtoken.verify(token, process.env.JWT_KEY, (err, user_id) => {
                    if (err) {
                        res.status(401).json({reason: 'unidentified user'});
                        return
                    }
                    req.user_id = user_id.data;
                    next();
                });
            } catch (err) {
                res.status(500).json({reason: 'server error'})
            }

        } else {
            res.status(403).json({reason: 'access refused'});
        }
    }

}