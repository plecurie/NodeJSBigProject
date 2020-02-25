import { CrudController } from "../CrudController";
import { ELASTIC_CLIENT } from "../../elasticsearch";
import {ApiResponse, RequestParams} from "@elastic/elasticsearch";

export class UserController extends CrudController {

    create(req, res): void {
        res.json({message: 'POST /users request received'});
    }

    delete(req, res): void {
        res.json({message: 'DELETE /users request received'});
    }

    read(req, res): void {
        res.json({message: 'GET /users request received'});
    }

    test(req, res): Promise<void> {

        res.json({message: 'GET /users/test received'});

        const params: RequestParams.Search = {
            index: 'toto',
            body: {
                query: {
                    match: {
                        quote: 'toto'
                    }
                }
            }
        };

        return ELASTIC_CLIENT
            .search(params)
            .then((result: ApiResponse) => {
                console.log(result.body.hits.hits)
            })
            .catch((err: Error) => {
                console.log(err)
            })
    }

    update(req, res): void {
        res.json({message: 'UPDATE /users request received'});
    }

}