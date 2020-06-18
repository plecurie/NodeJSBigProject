import { Request, Response } from 'express';
import * as express from 'express'
import  { productsController } from '../../controllers'

export const router = express.Router({
    strict: true
});

router.post('/_updatedb', (req: Request, res: Response) => {
    productsController.update(req, res)
});

router.get('/', (req: Request, res: Response) => {
    productsController.findAll(req, res)
});

router.get('/:isincode', (req: Request, res: Response) => {
    productsController.findOne(req, res)
});

router.post('/search', (req, res) => {
    productsController.search(req, res);
});