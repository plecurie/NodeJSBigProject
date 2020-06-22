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
/*
router.post('/profile', (req: Request, res: Response) => {
    profileController.create(req, res)
});

router.get('/profile', (req: Request, res: Response) => {
    profileController.read(req, res)
});

router.post('/profile/update',(req: Request, res: Response) => {
    profileController.update(req, res);
});

router.delete('/profile', (req: Request, res: Response) => {
    profileController.delete(req, res);
});
*/
router.post('/portfolio/new', authController.checkToken, (req: Request, res: Response) => {
    portfolioController.create(req, res)
});

router.get('/portfolio', authController.checkToken, (req: Request, res: Response) => {
    portfolioController.findAll(req, res)
});

router.get('/portfolio/:name', authController.checkToken, (req: Request, res: Response) => {
    portfolioController.findOne(req, res)
});

router.post('/portfolio/:name/update', authController.checkToken, (req: Request, res: Response) => {
    portfolioController.update(req, res);
});

router.delete('/portfolio/:name', authController.checkToken, (req: Request, res: Response) => {
    portfolioController.delete(req, res);
});