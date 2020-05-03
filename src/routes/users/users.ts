import { Request, Response } from 'express';
import * as express from 'express'
import  { userController } from '../../controllers';

export const router = express.Router({
    strict: true,
    mergeParams: true
});

router.post('/create', (req: Request, res: Response) => {
    userController.create(req, res)
});

router.get('/read', (req: Request, res: Response) => {
    userController.read(req, res)
});

router.post('/update',(req: Request, res: Response) => {
    userController.update(req, res);
});

router.delete('/delete', (req: Request, res: Response) => {
    userController.delete(req, res);
});