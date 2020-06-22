import { MailerService, AuthService, GeneratorService } from '../../services';
import * as jsonwebtoken from 'jsonwebtoken';
import { User } from "../../models/User";
import { client } from "../../utils/elasticsearch";

const mailerService = MailerService.getInstance();
const authService = AuthService.getInstance();
const generatorService = GeneratorService.getInstance();

export class AuthController {

    async signup(req, res) {

        const user: User = { firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate,
            email: req.body.email, password: req.body.password, username: req.body.username };

            try {
                const userExist = await authService.findByEmail({ email: req.body.email })
                    .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));
                if(userExist) {
                    res.status(409).json({ created: false, reason: "email already exists" });
                    return false;
                }
                else {
                    const mdpCrypted = await generatorService.hashPassword(req.body.password);
                    return await client.index({
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
                    }).then(() => {
                        res.status(201).json({created: true});
                        return true;
                    })
                }
            }
            catch(err) {
                res.status(500).json(err);
                return false;
            }

    }

    async signin(req, res) {
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
                    return true;
                } else {
                    res.status(403).json({connect: false, reason: "access forbidden"});
                    return false;
                }
            } else {
                res.status(403).json({connect: false, reason: "access forbidden"});
                return false;
            }
        }
        catch(err) {
            res.status(500).json({connect: false, error: err});
            return false;
        }
    }

    async generateNewPassword(req, res) {
        try {
            const searchedUser = await authService.findByEmail({ email: req.body.email })
                .then(su => su.body.hits.hits.find(u => u._source !== undefined && u._source.email === req.body.email));
            if (searchedUser) {
                const newPassword = generatorService.randomPassword();
                const newPasswordCrypted = await generatorService.hashPassword(newPassword);
                const passwordUpdated = await authService.updateUserPassword({id: searchedUser._id, password: newPasswordCrypted});

                if (passwordUpdated._shards.failed == 0) {
                    await mailerService.sendEmail(req.body.email, newPassword);
                    res.status(200).json({updated: true});
                } else {
                    res.status(404).json({updated: false})
                }
            } else {
                res.status(403).json({updated: false});
            }
        } catch(err) {
            res.status(500).json({updated: false, error: err});
            return;
        }
    }

    async checkToken(req, res): Promise<void> {
        jsonwebtoken.verify(req.body.token, process.env.JWT_KEY, (err, _) => {
            if (err) {
                res.json({valid: false});
                return;
            }
            res.json({valid: true});
        });
    }

}