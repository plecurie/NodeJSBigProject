import * as express from 'express'
import { usersRouter, producersRouter, productsRouter, authRouter, ocrRouter } from "./routes";
import { ES_PORT, HOST, PORT } from "./utils/constants";
import { ELASTIC_CLIENT } from "./utils/elasticsearch";

class Application {

    private app: express.Application;

    constructor() {
        require('dotenv').config();
        this.app = express();
        this.routes()
    }

    private routes (): void {
        this.app.use(express.json());
        this.app.use('/users', usersRouter);
        this.app.use('/producers', producersRouter);
        this.app.use('/products', productsRouter);
        this.app.use('/auth', authRouter);
        this.app.use('/ocr', ocrRouter);

    }

    start(): void {

        this.app.listen(PORT, () => {
            console.log('>>>> Node server is listening on', HOST + ":" + PORT)
        });
        
        ELASTIC_CLIENT.ping(((err, result) => {
            if (err) {
                throw new Error('>>>> Failed to connect to ' + HOST + ":" + ES_PORT)
            } else {
                console.log('>>>> ElasticSearch is listening on', HOST + ":" + ES_PORT)
            }
        }));
    }

}

export default Application;