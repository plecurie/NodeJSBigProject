import { Request, Response } from 'express';
import * as express from 'express'
import { portfolioController, profileController, userController } from '../../controllers';

export const router = express.Router({
    strict: true,
    mergeParams: true
});

router.post('/', (req: Request, res: Response) => {
    userController.findOneByEmail(req, res);
});

router.post('/update',(req: Request, res: Response) => {
    userController.update(req, res);
});

router.delete('/', (req: Request, res: Response) => {
    userController.delete(req, res);
});

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

router.post('/portfolio', (req: Request, res: Response) => {
    portfolioController.create(req, res)
});

router.get('/portfolio', (req: Request, res: Response) => {
    portfolioController.read(req, res)
});

router.post('/portfolio/update',(req: Request, res: Response) => {
    portfolioController.update(req, res);
});

router.delete('/portfolio', (req: Request, res: Response) => {
    portfolioController.delete(req, res);
});