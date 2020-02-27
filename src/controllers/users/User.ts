import { CrudController } from "../CrudController";
import { ELASTIC_CLIENT } from "../../elasticsearch";
import {ApiResponse, RequestParams} from "@elastic/elasticsearch";
import {exec} from "../../utils/exec";
import {codes} from "../../utils/country_code";

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

    async ocr(req, res): Promise<void> {
        const isinReg = /^[a-z]{2}[O0-9]+$/i;
        //const {path} = req.query;
        const path = 'Securities.png';
        const data = (<string>await exec(`tesseract ${path} stdout`))
            .split(' ')
            .filter(v => isinReg.test(v))
            .filter(v => codes.includes(v.substring(0, 2).toUpperCase()));
        //await exec(`rm ${path}`);
        return res.json({data});
    }
}
