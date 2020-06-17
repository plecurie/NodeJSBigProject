import * as express from 'express'
import { usersRouter, producersRouter, productsRouter, authRouter, ocrRouter } from "./routes";
import { APP_HOST, APP_PORT } from "./utils/constants";
import { checkConnection } from "./utils/elasticsearch"

class Application {

    public app: express.Application;

    constructor() {
        require('dotenv').config();
        this.app = express();
        this.routes()
    }

    private routes (): void {
        this.app.use(express.json());
        this.app.use('/users', usersRouter);
        this.app.use('/firm', producersRouter);
        this.app.use('/products', productsRouter);
        this.app.use('/auth', authRouter);
        this.app.use('/ocr', ocrRouter);

    }

    async start(): Promise<void> {
        await checkConnection();

        this.app.listen(APP_PORT, () => {
            console.log('>>>> Node server is listening on', APP_HOST + ":" + APP_PORT)
        });
    }
}

export default Application;
