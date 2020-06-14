import * as express from "express";
import {
    authRouter,
    ocrRouter,
    portfolioRouter,
    producersRouter,
    productsRouter,
    profileRouter,
    usersRouter
} from "../src/routes";

export function appMock() {
    let app = express();
    let router = express.Router();
    router.route('/').get(function(req, res) {
        res.set('Content-Type', 'application/json');
        return res.json({
            running: true
        })
    });
    app.use(express.json());
    app.use('/users', usersRouter);
    app.use('/producers', producersRouter);
    app.use('/products', productsRouter);
    app.use('/portfolio', portfolioRouter);
    app.use('/profile', profileRouter);
    app.use('/auth', authRouter);
    app.use('/ocr', ocrRouter);
    app.use(router);

    app.listen(3000, function (err) {
        if (err) return err;
    });

    return app;
}