import { Request, Response } from 'express';
import * as express from 'express';

import { profileController } from "../../controllers";

export const router = express.Router({
    strict: true
});

router.post('/', (req: Request, res: Response) => {
    profileController.create(req, res)
});

router.get('/', (req: Request, res: Response) => {
    profileController.read(req, res)
});

router.post('/update',(req: Request, res: Response) => {
    profileController.update(req, res);
});

router.delete('/', (req: Request, res: Response) => {
    profileController.delete(req, res);
});