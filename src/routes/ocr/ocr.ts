import { Request, Response } from 'express';
import { ocrController } from '../../controllers'
import * as express from 'express';
import * as multer from 'multer';

const upload = multer({dest: `./src/uploads`});

export const router = express.Router({
    strict: true,
    mergeParams: true
});

router.post('/process', upload.array('file'), (req: Request, res: Response) => {
    ocrController.recognize(req, res)
});

