import {AuthService, GeneratorService, MailerService, UserService, PortfolioService} from '../../services';
import * as jsonwebtoken from 'jsonwebtoken';
import {User} from "../../models/User";
import {client} from "../../utils/elasticsearch";

const mailerService = MailerService.getInstance();
let authService = AuthService.getInstance();
const generatorService = GeneratorService.getInstance();
const userService = UserService.getInstance();
const portfolioService = PortfolioService.getInstance();

export class AuthController {
    constructor() {}

    async signup(req, res) {
        const user: User = userService.userValidatorSignUp(req.body);
        if(!user) return res.status(404).json({created: false, reason: "email or password incorrect"});
        try {
            const userExist = await authService.findByEmail({email: user.email})
                .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === user.email));

            if (userExist) return res.status(403).json({created: false, reason: "email already exists"});
            const mdpCrypted = await generatorService.hashPassword(user.password);
            const createdUser =  await client.index({
                index: 'scala',
                type: 'database',
                body: {
                    type: "user",
                    email: user.email,
                    password: mdpCrypted
                }
            });
            if (createdUser) {
                await portfolioService.create(createdUser.body._id);
                return res.status(200).json({created: true})
            }
            return res.status(500).json({created: false})
        } catch (err) {
            console.log(err);
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
            const user: User = userService.userValidatorForgotPassword(req.body);
            if(!user) return res.status(404).json({updated: false, reason: "emai malformed"});
            const findUser = await authService.findByEmail({email: req.body.email})
                .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));
            if(!findUser) return res.status(403).json({updated: false, reason: 'user not found'});
            const newPassword = generatorService.randomPassword();
            const newPasswordCrypted = await generatorService.hashPassword(newPassword);
            await authService.updateUserPassword({
                id: findUser._id,
                password: newPasswordCrypted
            }).then(async ()=>{
                const test = await mailerService.sendEmail(findUser._source.email, newPassword);
                res.status(200).json({updated: true});
            });
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
