import { Request, Response } from 'express'

export abstract class CrudOcr {
    public abstract async ocr(req: Request, res: Response): Promise<void>
}