import { client, index, type } from "../../utils/elasticsearch";
import { User } from "../../models/User";
import { AuthService, GeneratorService } from "../../services";

const generatorService = GeneratorService.getInstance();
const authService = AuthService.getInstance();

export class UsersController {

    async findOneByEmail(req, res): Promise<boolean> {

        try {
            return await client.search({
                index: index,
                body : {
                    query: {
                        bool: {
                            must: [
                                {match: {type: "user"}},
                                {match: {email: req.body.email}}
                            ]
                        }
                    }
                }
            }).then((data)=> {
                if (data.body.hits.hits.length != 0) {
                    res.status(200).json({found: true, user: data.body.hits.hits[0]._source});
                    return true;
                }
                else {
                    res.status(404).json({found: false, reason: "no user with this email"});
                    return false;
                }
            })
        } catch (err) {
            res.status(500).json(err);
            return false;
        }
    }

    async update(req, res): Promise<boolean> {

        const user: User = { firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate, email: req.body.email, password: req.body.password, username: req.body.username };

        const newMail = req.body.newmail;

        const userExist = await authService.findByEmail({ email: req.body.email })
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

        const isUsed = await authService.findByEmail({ email: newMail })
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

        if (userExist && !isUsed) {

            const mdpCrypted = await generatorService.hashPassword(req.body.password);

            try {
                return await client.updateByQuery({
                    index: index,
                    type: type,
                    body : {
                        query: {
                            bool: {
                                must: [
                                    { match: { type: "user" }},
                                    { match: { _id: userExist._id }}
                                ]
                            }
                        },
                        script: {
                            source:
                                "ctx._source.firstname ='" + user.firstname + "';"
                                + "ctx._source.lastname = '" + user.lastname + "';"
                                + "ctx._source.username ='" + user.username + "';"
                                + "ctx._source.birthdate ='" + user.birthdate + "';"
                                + "ctx._source.email = '" + newMail + "';"
                                + "ctx._source.password ='" + mdpCrypted + "';",
                            lang: "painless"
                        }
                    }
                }).then(() => {
                    res.status(200).json({ updated: true });
                    return true;
                })

            } catch (err) {
                res.status(500).json(err);
                return false;
            }
        }
        else if(!userExist) {
            res.status(404).json({updated: false, reason: "no user with this email"});
            return false;
        }
        else if(isUsed) {
            res.status(409).json({updated: false, reason: "email already in use"});
            return false;
        }

    }

    async delete(req, res): Promise<boolean> {

        try {
            return await client.deleteByQuery({
                index: index,
                body: {
                    query: {
                        bool: {
                            must: [
                                { match: { type: "user" }},
                                { match: { email: req.body.email }}
                            ]
                        }
                    }
                }
            }).then((response) => {
                if (response.body.deleted === 0) {
                    res.status(404).json({deleted: false, reason: "no user with this email"});
                    return false;
                } else {
                    res.status(200).json({deleted: true});
                    return true;
                }
            })
        } catch (err) {
            res.status(500).json(err);
            return false;
        }

    }

}