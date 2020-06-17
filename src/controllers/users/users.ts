import { CrudController } from "../../utils";
import { client, index, type } from "../../utils/elasticsearch";
import { User } from "../../models/User";
import { GeneratorService } from "../../services";

const generatorService = GeneratorService.getInstance();

export class UsersController extends CrudController {

    async findOneByEmail(req, res): Promise<void> {

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
            else
                res.status(200).json({user: response.body.hits.hits});
        })
    }

    async update(req, res): Promise<void> {

        const user: User = { firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate, email: req.body.email, password: req.body.password, username: req.body.username };

        const mdpCrypted = await generatorService.hashPassword(req.body.password);

        client.updateByQuery({
            index: index,
            type: type,
            body: {
                query: {
                    match: {email: user.email}
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
                        + user.email + "';" +
                        "ctx._source.password ='"
                        + mdpCrypted + "';",
                    lang: "painless"
                }
            }
        }, (err, response) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json({updated: true});
        })
    }

    delete(req, res): void {
        client.deleteByQuery({
            index: index,
            type: type,
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
            else
                res.status(200).json({deleted: true});
        });
    }

    create(req, res): void {}

    read(req, res): void {}
}