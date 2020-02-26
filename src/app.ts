import * as express from 'express'
import { userRouter } from "./routes";
import { ES_PORT, HOST, PORT } from "./utils/constants";
import { ELASTIC_CLIENT } from "./utils/elasticsearch";

class Application {

    app: express.Application;

    constructor() {
        this.app = express();
        this.routes()
    }

    private routes (): void {
        this.app.use(express.json());
        this.app.use('/users', userRouter);
    }

    start(): void {

        this.app.listen(PORT, (err) => {

            if (err) {
                return console.log(err)
            }

            return console.log('>>>> Node server is listening on', HOST + ":" + PORT)
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