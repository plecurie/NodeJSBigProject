import { Request, Response } from 'express';
import * as express from 'express'
import  { userController } from '../../controllers'
import * as multer from 'multer';
import { RequestHandler } from 'express-serve-static-core';

const upload = multer({dest: `./src/uploads`});

export const router = express.Router({
    strict: true,
    mergeParams: true
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

router.post('/ocr', upload.array('file'), (req: Request, res: Response) => {
    userController.ocr(req, res)
});
