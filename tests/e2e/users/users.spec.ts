import {
    mockApi, request, USER_BIRTHDATE,
    USER_EMAIL, USER_FIRSTNAME, USER_LASTNAME, USER_PASSWORD, USER_USERNAME
} from "../mockConfig";
import {GeneratorService} from "../../../src/services";

const chai = require('chai');
const expect = chai.expect;

const generatorService = GeneratorService.getInstance();

describe("Users E2E tests", () => {

    describe("Find one", () => {

        const endpoint = "/users/";

        it('should find an existing user by email', async function (done) {

            const mdpCrypted = await generatorService.hashPassword("abc123");

            mockApi
                .post(endpoint, {
                    email: USER_EMAIL
                })
                .reply(200, {
                    "status": 200,
                    "found": true,
                    "user": [
                    {
                        "_index": "scala",
                        "_type": "database",
                        "_id": "cevfwXIBCLyAss8co0QG",
                        "_score": 0.5753642,
                        "_source": {
                            "type": "user",
                            "firstname": "random",
                            "lastname": "random",
                            "username": "random",
                            "birthdate": "1970/01/01",
                            "email": "random@test.com",
                            "password": mdpCrypted
                        }
                    }
                ]
            });

            request
                .post(endpoint)
                .send({
                    email: USER_EMAIL
                })
                .end( (err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.found).to.equal(true);
                    expect(res.body.user).to.eql([
                        {
                            "_index": "scala",
                            "_type": "database",
                            "_id": "cevfwXIBCLyAss8co0QG",
                            "_score": 0.5753642,
                            "_source": {
                                "type": "user",
                                "firstname": USER_FIRSTNAME,
                                "lastname": USER_LASTNAME,
                                "username": USER_USERNAME,
                                "birthdate": USER_BIRTHDATE,
                                "email": USER_EMAIL,
                                "password": mdpCrypted
                            }
                        }
                    ]);
                    done();
                });
        });

    });
});