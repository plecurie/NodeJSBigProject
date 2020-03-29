import { ELASTIC_CLIENT } from "../../utils/elasticsearch";
import bodyParser = require("body-parser");
import { ApiResponse } from "@elastic/elasticsearch";

export class UserService {
    private static instance: UserService;
    private index = 'scala';
    private types = 'users';
    constructor() {}

    public static getInstance(): UserService {
        if(!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
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
}