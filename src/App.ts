import * as express from 'express'
import { userRouter } from "./routes";
import {ES_PORT, HOST, PORT} from "./utils/constants";
import { ELASTIC_CLIENT } from "./elasticsearch";

class Application {

    private app: express.Application;

    constructor() {
        this.app = express();
        this.routes()
    }

    private routes (): void {
        this.app.use(express.json());
        this.app.use('/users', userRouter);
    }

    start(): void {

        this.app.listen(PORT, () => {
            console.log('>>>> Node server is listening on', HOST + ":" + PORT)
        });
        
        ELASTIC_CLIENT.ping(((err, result) => {
            if (err) {
                console.error(err)
            } else {
                console.log('>>>> ElasticSearch is listening on', HOST + ":" + ES_PORT)
            }
        }));
    }

}

export default Application;