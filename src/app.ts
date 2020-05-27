import * as express from 'express'
import { usersRouter, producersRouter, productsRouter, authRouter, ocrRouter, 
profileRouter, portfolioRouter } from "./routes";
import { APP_HOST, APP_PORT, ES_URL } from "./utils/constants";
import { ELASTIC_CLIENT, errors } from "./utils/elasticsearch";
import { bulkindexService } from "./services/request/bulkindex.service";

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
        this.app.use('/portfolio', portfolioRouter);
        this.app.use('/profile', profileRouter);
        this.app.use('/auth', authRouter);
        this.app.use('/ocr', ocrRouter);

    }

    start(): void {

        let es_started = false;

        function delay(ms: number) {
            return new Promise( resolve => setTimeout(resolve, ms) );
        }

        (async () => {
            while(!es_started) {
                await delay(5000);
                ELASTIC_CLIENT.ping( (err, result) => {
                    if(result.statusCode != null) es_started = true;
                    else console.log(">>>> Waiting for Elasticsearch to Start...");
                });
            }
            console.log(">>>> Elasticsearch started on ", ES_URL);
            this.app.listen(APP_PORT, () => {
                console.log('>>>> Node server is listening on', APP_HOST + ":" + APP_PORT)
            });
            //bulkindexService.getInstance().importExcel();
        })();

    }

}

export default Application;