import { Request, Response } from 'express';
import { authController } from '../../controllers'
import * as express from 'express';

export const router = express.Router({
    strict: true,
    mergeParams: true
});

router.post('/signup', (req: Request, res: Response) => {
    authController.signup(req, res);
});

router.put('/forgot-password', (req: Request, res: Response) => {
    authController.forgotPassword(req, res);
});

router.post('/login', (req: Request, res: Response) => {
    authController.signin(req, res);
});

router.post('/checkToken', (req: Request, res: Response) => {
    authController.checkToken(req, res);
});