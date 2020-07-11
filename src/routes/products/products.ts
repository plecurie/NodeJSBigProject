import * as express from 'express';
import {Request, Response} from 'express';
import {productsController} from '../../controllers'

export const router = express.Router({
    strict: true
});

router.post('/_updatedb', (req: Request, res: Response) => {
    productsController.update_db(req, res)
});

router.get('/suggest/:input', function (req, res, next) {
    productsController.suggest(req, res)
});

router.post('/', (req: Request, res: Response) => {
    productsController.findAll(req, res)
});

router.get('/:isincode', (req: Request, res: Response) => {
    productsController.findOne(req, res)
});

router.post('/find/many', productsController.findMany);


router.post('/search', (req, res) => {
    productsController.search(req, res);
});
