import {client, index, type} from "../../utils/elasticsearch";

const bcrypt = require('bcrypt');

export class AuthService {
    private static instance: AuthService;

    constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async updateUserPassword(user: any): Promise<any> {
        return await client.update({
            index: index,
            type: type,
            id: user.id,
            body: {
                doc: {password: user.password}
            }
        }).then(pu => pu.body);
    }

    public async findByEmail(email: any) {
        return client.search({
            index: index,
            type: type,
            body: {
                query: {match: email}
            }
        });
    }

    public async findById(_id: any) {
        return client.search({
            index: index,
            type: type,
            body: {
                query: {match: _id}
            }
        });
    }

    public async checkValidPassword(passwordUser: string, hash: string) {
        try {
            const verifyPassword = await bcrypt.compare(passwordUser, hash);
            return !!verifyPassword;
        } catch (err) {
            throw err;
        }
    }
}