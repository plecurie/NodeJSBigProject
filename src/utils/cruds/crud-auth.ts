import { Request, Response } from 'express'

export abstract class CrudAuth {
    public abstract async login(req: Request, res: Response): Promise<void>
    public abstract async forgotPassword(req: Request, res: Response): Promise<void>
    public abstract async checkToken(req: Request, res: Response): Promise<void>
}