import { Request, Response } from 'express';
import * as express from 'express'
import  { userController } from '../../controllers'
import * as multer from 'multer';

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

router.post('/update',(req: Request, res: Response) => {
    userController.update(req, res);
});

router.delete('/', (req: Request, res: Response) => {
    userController.delete(req, res);
});

router.post('/ocr', upload.array('file'), (req: Request, res: Response) => {
    userController.ocr(req, res)
});
