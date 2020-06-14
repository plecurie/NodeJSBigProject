import {User} from "../../../models/User";

export const mockSignup = jest.fn(
    async (client: User, primaryKey: string, secondaryKey: string): Promise<any> => {
        return {
            "_shards" : {
                "total" : 2,
                "failed" : 0,
                "successful" : 2
            },
            "_index" : "twitter",
            "_type" : "_doc",
            "_id" : "W0tpsmIBdwcYyG50zbta",
            "_version" : 1,
            "_seq_no" : 0,
            "_primary_term" : 1,
            "result": "created"
        } as any;
    });

const mock = jest.fn().mockImplementation(() => {
    return { signin: mockSignup };
});

export default mock;