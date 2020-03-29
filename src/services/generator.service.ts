export class GeneratorService {
    private static instance: GeneratorService;
    constructor () {}

    public static getInstance(): GeneratorService {
        if(!GeneratorService.instance) {
            GeneratorService.instance = new GeneratorService();
        }
        return GeneratorService.instance;
    }

    public randomPasswordCrypted() {
        return String.fromCodePoint(...Array.from({length: 16}, () => Math.floor(Math.random() * 57) + 65));
    }

}