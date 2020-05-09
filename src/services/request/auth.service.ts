import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
const bcrypt = require('bcrypt');

export class AuthService {
    private static instance: AuthService;
    private index = 'scala';
    private types = 'users';
    constructor() {}

    public static getInstance(): AuthService {
        if(!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async updateUserPassword(user: any): Promise<any> {
        return await ELASTIC_CLIENT.update({
            index: this.index,
            type: this.types,
            id: user.id,
            body: { doc: { password: user.password }}
        }).then(pu => pu.body);
    }

    public async searchUser(user: any) {
        return await ELASTIC_CLIENT.search({
            index: this.index,
            type: this.types,
            body: { query: { match: user }}
        });
    }

    public async checkValidPassword(passwordUser: string, hash: string) {
        try {
            const verifyPassword = await bcrypt.compare(passwordUser, hash);
            if (verifyPassword) return true;
            return false
        } catch(err) {
          throw err;  
        }
    }
}