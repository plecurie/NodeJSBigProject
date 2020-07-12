import {client, index, type} from "../../utils/elasticsearch";
import {User} from "../../models/User";
import {AuthService, GeneratorService} from "../../services";

const generatorService = GeneratorService.getInstance();
const authService = AuthService.getInstance();

export class UsersController {

    async findOne(req, res): Promise<boolean> {
        try {
            return await client.get({
                index: index,
                type: type,
                id: req.user_id
            }).then((data) => {
                res.status(200).json({found: true, user: data.body._source});
                return true;
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return false;
        }
    }

    async update(req, res): Promise<boolean> {

        const user: User = {
            email: req.body.newmail,
            password: req.body.password,
        };
        const isUsed = await authService.findByEmail({email: user.email})
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === user.email));

        if (req.user_id.length != 0 && !isUsed) {
            const mdpCrypted = await generatorService.hashPassword(req.body.password);
            try {
                return await client.update({
                    index: index,
                    type: type,
                    id: req.user_id,
                    body: {
                        query: {
                            doc: {
                                email: user.email,
                                password: mdpCrypted
                            }
                        }
                    }
                }).then(() => {
                    res.status(200).json({updated: true});
                    return true;
                })
            } catch (err) {
                res.status(500).json({reason: 'server error'});
                return false;
            }
        } else if (!req.user_id) {
            res.sendStatus(401).json({reason: 'unidentified user'});
            return false;
        } else if (isUsed) {
            res.status(409).json({updated: false, reason: "email already in use"});
            return false;
        }
    }

    async delete(req, res): Promise<boolean> {
        try {
            return await client.delete({
                index: index,
                type: type,
                id: req.user_id
            }).then(() => {
                res.status(200).json({deleted: true});
                return true;
            })
        } catch (err) {
            res.status(500).json({reason: 'server error'});
            return false;
        }
    }

}