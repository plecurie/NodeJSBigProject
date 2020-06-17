import { Request, Response } from 'express';
import * as express from 'express'
import  { productsController } from '../../controllers'

export const router = express.Router({
    strict: true
});

router.post('/', (req: Request, res: Response) => {
    productsController.create(req, res)
});

router.get('/', (req: Request, res: Response) => {
    productsController.findAll(req, res)
});

router.get('/search', (req, res) => {
    productsController.search(req, res);
});