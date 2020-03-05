import { Request, Response } from 'express';
import * as express from 'express'
import  { producersController } from '../../controllers'

export const router = express.Router({
    strict: true
});

router.post('/', (req: Request, res: Response) => {
    producersController.create(req, res)
});

router.get('/', (req: Request, res: Response) => {
    producersController.read(req, res)
});

router.post('/update',(req: Request, res: Response) => {
    producersController.update(req, res);
});

router.delete('/', (req: Request, res: Response) => {
    producersController.delete(req, res);
});