import * as express from 'express'
import { usersRouter } from "./routes";
import { productsRouter } from "./routes";
import { producersRouter } from "./routes";
import { portfolioRouter } from "./routes";
import { profileRouter } from "./routes";
import { ES_PORT, HOST, PORT } from "./utils/constants";
import { ELASTIC_CLIENT } from "./utils/elasticsearch";
import { bulkindexService } from "./services/bulkindex.service";

class Application {

    private app: express.Application;

    constructor() {
        this.app = express();
        this.routes()
    }

    private routes (): void {
        this.app.use(express.json());
        this.app.use('/users', usersRouter);
        this.app.use('/producers', producersRouter);
        this.app.use('/products', productsRouter);
        this.app.use('/portfolio', portfolioRouter);
        this.app.use('/profile', profileRouter)
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

        bulkindexService.getInstance().bulk();
    }

}

export default Application;