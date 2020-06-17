import {
    mockApi, request, USER_BIRTHDATE,
    USER_EMAIL, USER_FIRSTNAME, USER_LASTNAME, USER_PASSWORD, USER_USERNAME
} from "../mockConfig";
import {GeneratorService} from "../../../src/services";

const chai = require('chai');
const expect = chai.expect;

const generatorService = GeneratorService.getInstance();

describe("Users E2E tests", () => {

    describe("Find one user", () => {

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

    describe("Update one user", () => {

        const endpoint = "/users/update/";

        it('should update an existing user', async function (done) {

            mockApi
                .post(endpoint, {
                    "firstname": "test",
                    "lastname": "test",
                    "birthdate": "1970/01/01",
                    "email": USER_EMAIL,
                    "newmail": "test@test",
                    "password": "test",
                    "username": "test"
                })
                .reply(200, {
                    "status": 200,
                    "updated": true
                });

            request
                .post(endpoint)
                .send({
                    "firstname": "test",
                    "lastname": "test",
                    "birthdate": "1970/01/01",
                    "email": USER_EMAIL,
                    "newmail": "test@test",
                    "password": "test",
                    "username": "test"
                })
                .end( (err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.updated).to.equal(true);

                    done();
                });
        });

    });

    describe("Delete one user", () => {

        const endpoint = "/users/";

        it('should delete an existing user', async function (done) {

            mockApi
                .delete(endpoint, {
                    "email": USER_EMAIL
                })
                .reply(200, {
                    "status": 200,
                    "deleted": true
                });

            request
                .delete(endpoint)
                .send({
                    "email": USER_EMAIL
                })
                .end( (err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.deleted).to.equal(true);

                    done();
                });
        });

    });

});