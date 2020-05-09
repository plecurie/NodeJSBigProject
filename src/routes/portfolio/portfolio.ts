import { Request, Response } from 'express';
import * as express from 'express';

import { portfolioController } from "../../controllers";

export const router = express.Router({
    strict: true
});

router.post('/', (req: Request, res: Response) => {
    portfolioController.create(req, res)
});

router.get('/', (req: Request, res: Response) => {
    portfolioController.read(req, res)
});

router.post('/update',(req: Request, res: Response) => {
    portfolioController.update(req, res);
});

router.delete('/', (req: Request, res: Response) => {
    portfolioController.delete(req, res);
});