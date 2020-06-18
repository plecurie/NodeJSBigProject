import { MailerService, AuthService, GeneratorService } from '../../services';
import * as jsonwebtoken from 'jsonwebtoken';
import { User } from "../../models/User";
import { client } from "../../utils/elasticsearch";

const mailerService = MailerService.getInstance();
const authService = AuthService.getInstance();
const generatorService = GeneratorService.getInstance();

export class AuthController {

    async signup(req, res): Promise<void> {

        const user: User = { firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate,
            email: req.body.email, password: req.body.password, username: req.body.username };

            try {
                const userExist = await authService.findByEmail({ email: req.body.email })
                    .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));
                if(userExist) {
                    res.status(409).json({created: false, reason: "email already exists"});
                }
                else {

                    const mdpCrypted = await generatorService.hashPassword(req.body.password);

                    client.index({
                        index: 'scala',
                        type: 'database',
                        body : {
                            type: "user",
                            firstname: user.firstname,
                            lastname: user.lastname,
                            username: user.username,
                            birthdate: user.birthdate,
                            email: user.email,
                            password: mdpCrypted
                        }
                    }, (err, response) => {
                        if (err) {
                            res.status(500).json(err);
                            return;
                        }
                        res.status(201).json({created: true});
                    });
                }
            }
            catch(err) {
                res.status(500).json(err);
            }

    }

    async signin(req, res): Promise<void> {
        try {
            const user = await authService.findByEmail({ email: req.body.email })
            .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));
            if(user) {
                const isValidPassword = await authService.checkValidPassword(
                    req.body.password,
                    user._source.password
                );
                if (isValidPassword) {
                    const token = jsonwebtoken.sign({data: user._id}, process.env.JWT_KEY, {expiresIn: "1d"});
                    res.status(200).json({connect: true, token: token});
                } else {
                    res.status(403).json({connect: false, reason: "access forbidden"});
                }
            } else {
                res.status(403).json({connect: false, reason: "access forbidden"})
            }
        }
        catch(err) {
            res.status(500).json({connect: false, error: err});
        }
    }

    async generateNewPassword(req, res): Promise<void> {
        try {
            const user = await authService.findByEmail({ email: req.body.email })
            .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));
            if (user) {
                const generatedPassword = generatorService.randomPassword();
                const newPasswordCrypted = await generatorService.hashPassword(generatedPassword);
                const passwordUpdated = await authService.updateUserPassword({id: user._id, password: newPasswordCrypted});

                if (passwordUpdated._shards.failed == 0) {
                    await mailerService.sendEmail(req.body.email, generatedPassword);
                    res.status(200).json({updated: true});
                }
            } else {
                res.status(404).json({updated: false, reason: "no user with this email"});
            }
        } catch(err) {
            res.status(500).json(err);
            return;
        }
    }

    async checkToken(req, res): Promise<void> {
        jsonwebtoken.verify(req.body.token, process.env.JWT_KEY, (err) => {
            if (err) {
                res.status(403).json({ valid: false, reason: "invalid token" });
                return;
            }
            res.status(200).json({ valid: true });
        });
    }
}