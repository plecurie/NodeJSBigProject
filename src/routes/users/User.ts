import { Request, Response } from 'express';
import * as express from 'express'
import  { userController } from '../../controllers'

export const router = express.Router({
    strict: true
});

router.post('/', (req: Request, res: Response) => {
    userController.create(req, res)
});

router.get('/', (req: Request, res: Response) => {
    userController.read(req, res)
});

router.put('/',(req: Request, res: Response) => {
    userController.update(req, res);
});

router.delete('/', (req: Request, res: Response) => {
    userController.delete(req, res);
});

router.get('/test', (req: Request, res: Response) => {
    userController.test(req, res)
});

router.get('/ocr', (req: Request, res: Response) => {
    userController.ocr(req, res)
});
