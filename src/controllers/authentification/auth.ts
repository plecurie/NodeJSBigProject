import { MailerService, AuthService, GeneratorService } from '../../services';
import * as jsonwebtoken from 'jsonwebtoken';

const mailerService = MailerService.getInstance();
const userService = AuthService.getInstance();
const generatorService = GeneratorService.getInstance();

export class AuthController {
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
                console.log('ss');
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
                res.json({valid: false});
                return;
            }
            res.json({valid: true});
        });
    }
}