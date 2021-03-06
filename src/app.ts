import * as express from 'express'
import {authRouter, ocrRouter, productsRouter, usersRouter} from "./routes";
import {APP_HOST, APP_PORT} from "./utils/constants";
import {checkConnection} from "./utils/elasticsearch"

class Application {

    public app: express.Application;

    constructor() {
        require('dotenv').config();
        this.app = express();
        this.routes()
    }

    async start() {
        await checkConnection();

        this.app.listen(APP_PORT, () => {
            console.log('>>>> Node server is listening on', APP_HOST + ":" + APP_PORT)
        });
    }

    private routes(): void {
        this.app.use(express.json());
        this.app.use('/users', usersRouter);
        this.app.use('/products', productsRouter);
        this.app.use('/auth', authRouter);
        this.app.use('/ocr', ocrRouter);
        this.app.use('/', (req, res) => {
            res.status(404).send({error: `path doesn't exist`});
        });
    }
}

export default Application;
