import {client, index, type} from "../../utils/elasticsearch";
import {User} from "../../models/User";
import {AuthService, GeneratorService} from "../../services";

const generatorService = GeneratorService.getInstance();
const authService = AuthService.getInstance();

export class UsersController {

    async findOne(req, res) {
        try {
            await client.get({
                index: index,
                type: type,
                id: req.user_id
            }).then((data) => {
                res.status(200).json({found: true, user: data.body._source});
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }

    async update(req, res) {

        const user: User = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthdate: req.body.birthdate,
            email: req.body.newmail,
            password: req.body.password,
            username: req.body.username
        };
        const isUsed = await authService.findByEmail({email: user.email})
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === user.email));

        if (req.user_id.length != 0 && !isUsed) {
            const mdpCrypted = await generatorService.hashPassword(req.body.password);
            try {
                await client.update({
                    index: index,
                    type: type,
                    id: req.user_id,
                    body: {
                        query: {
                            doc: {
                                firstname: user.firstname,
                                lastname: user.lastname,
                                username: user.username,
                                birthdate: user.birthdate,
                                email: user.email,
                                password: mdpCrypted
                            }
                        }
                    }
                }).then(() => {
                    res.status(200).json({updated: true});
                })
            } catch (err) {
                res.status(500).json({reason: 'server error'});
            }
        } else if (!req.user_id) {
            res.sendStatus(401).json({reason: 'unidentified user'});
        } else if (isUsed) {
            res.status(409).json({updated: false, reason: "email already in use"});
        }
    }

    async delete(req, res) {
        try {
            await client.delete({
                index: index,
                type: type,
                id: req.user_id
            }).then(() => {
                res.status(200).json({deleted: true});
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
        }
    }

}