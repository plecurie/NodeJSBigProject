import { CrudController } from "../../utils";
import { client, index, type } from "../../utils/elasticsearch";
import { User } from "../../models/User";
import { AuthService, GeneratorService } from "../../services";

const generatorService = GeneratorService.getInstance();
const authService = AuthService.getInstance();

export class UsersController extends CrudController {

    async findOneByEmail(req, res) :  Promise<void> {

        client.search({
            index: index,
            body : {
                query: {
                    match: {
                        email: req.body.email
                    }
                }
            }
        }, (err, response) => {
            if (err)
                res.status(500).json(err);
            else if (response.body.hits.hits) {
                res.status(200).json({found: true, user: response.body.hits.hits});
            }
            else {
                res.status(404).json({found: false, reason: "no user with this email"});
            }

        })
    }

    async update(req, res): Promise<void> {

        const user: User = { firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate, email: req.body.email, password: req.body.password, username: req.body.username };

        const newMail = req.body.newmail;

        const userExist = await authService.findByEmail({ email: req.body.email })
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

        const isUsed = await authService.findByEmail({ email: newMail })
            .then(response => response.body.hits.hits.find(user => user._source !== undefined && user._source.email === req.body.email));

        if (userExist && !isUsed) {

            const mdpCrypted = await generatorService.hashPassword(req.body.password);

            client.updateByQuery({
                index: index,
                type: type,
                body: {
                    query: {
                        match: { _id: userExist._id }
                    },
                    script: {
                        source:
                            "ctx._source.firstname ='"
                            + user.firstname + "';" +
                            "ctx._source.lastname = '"
                            + user.lastname + "';" +
                            "ctx._source.username ='"
                            + user.username + "';" +
                            "ctx._source.birthdate ='"
                            + user.birthdate + "';" +
                            "ctx._source.email = '"
                            + newMail + "';" +
                            "ctx._source.password ='"
                            + mdpCrypted + "';",
                        lang: "painless"
                    }
                }
            }, (err, response) => {
                if (err)
                    res.status(500).json(err);
                else
                    res.status(200).json({ updated: true });
            })
        }
        else if(!userExist) {
            res.status(404).json({updated: false, reason: "no user with this email"});
        }
        else if(isUsed) {
            res.status(409).json({updated: false, reason: "email already in use"});
        }

    }

    delete(req, res): void {

        client.deleteByQuery({
            index: index,
            body: {
                query: {
                    match: {
                        email: req.body.email
                    }
                }
            }
        }, (err, response) => {
            if (err)
                res.status(500).json(err);
            else if (response.body.deleted === 0) {
                res.status(404).json({deleted: false, reason: "no user with this email"});
            }
            res.status(200).json({deleted: true});
        });

    }

    create(req, res): void {}

    read(req, res): void {}
}