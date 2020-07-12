import * as express from 'express';
import {Request, Response} from 'express';
import {authController, portfolioController, userController} from '../../controllers';

export const router = express.Router({
    strict: true,
    mergeParams: true
});

router.get('/', authController.checkToken, (req: Request, res: Response) => {
    userController.findOne(req, res);
});

router.post('/update', authController.checkToken, (req: Request, res: Response) => {
    userController.update(req, res);
});

router.delete('/', authController.checkToken, (req: Request, res: Response) => {
    userController.delete(req, res);
});

router.get('/portfolio', authController.checkToken, (req: Request, res: Response) => {
    portfolioController.read(req, res)
});

router.post('/portfolio/update', authController.checkToken, (req: Request, res: Response) => {
    portfolioController.update(req, res);
});