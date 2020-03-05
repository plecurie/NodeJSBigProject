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
    productsController.read(req, res)
});

router.post('/update',(req: Request, res: Response) => {
    productsController.update(req, res);
});

router.delete('/', (req: Request, res: Response) => {
    productsController.delete(req, res);
});