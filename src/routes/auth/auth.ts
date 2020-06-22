import * as express from 'express';
import {Request, Response} from 'express';
import {authController} from '../../controllers'

export const router = express.Router({
    strict: true,
    mergeParams: true
});

router.post('/signup', (req: Request, res: Response) => {
    authController.signup(req, res);
});

router.post('/forgot-password', authController.checkToken, (req: Request, res: Response) => {
    authController.generateNewPassword(req, res);
});

router.post('/login', (req: Request, res: Response) => {
    authController.signin(req, res);
});