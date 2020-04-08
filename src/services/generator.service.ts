const bcrypt = require('bcrypt');

export class GeneratorService {
    private static instance: GeneratorService;
    constructor () {}

    public static getInstance(): GeneratorService {
        if(!GeneratorService.instance) {
            GeneratorService.instance = new GeneratorService();
        }
        return GeneratorService.instance;
    }

    public randomPassword(): string {
        return String.fromCodePoint(...Array.from({length: 16}, () => Math.floor(Math.random() * 57) + 65));
    }

    public async hashPassword(password: string) {
        try {
            const passwordHased = await bcrypt.hash(password, 15);
            return passwordHased;
        } catch(err) {
            throw err;
        }
    }

}