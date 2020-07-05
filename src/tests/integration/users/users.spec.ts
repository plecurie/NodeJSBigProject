import {
    mockApi, mockRequest, USER_BIRTHDATE,
    USER_EMAIL, USER_FIRSTNAME, USER_LASTNAME, USER_PASSWORD, USER_USERNAME
} from "../../mockConfig";
import {GeneratorService} from "../../../services";

const chai = require('chai');
const expect = chai.expect;

const generatorService = GeneratorService.getInstance();

describe("Users E2E tests", () => {

    describe("Find one user", () => {

        const endpoint = "/users/";

        it('should find an existing user by email', async function (done) {

            const mdpCrypted = await generatorService.hashPassword(USER_PASSWORD);

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

            mockRequest
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

        it("should return not found when email doesn't exit", async function (done) {

            const mdpCrypted = await generatorService.hashPassword(USER_PASSWORD);

            mockApi
                .post(endpoint, {
                    type: "user",
                    firstname: USER_FIRSTNAME,
                    lastname: USER_LASTNAME,
                    username: USER_USERNAME,
                    birthdate: USER_BIRTHDATE,
                    password: mdpCrypted,
                    email: "wrong_email"
                })
                .reply(404, {
                    status: 404,
                    found: false,
                    reason: "no user with this email"
                });

            mockRequest
                .post(endpoint)
                .send({
                    type: "user",
                    firstname: USER_FIRSTNAME,
                    lastname: USER_LASTNAME,
                    username: USER_USERNAME,
                    birthdate: USER_BIRTHDATE,
                    password: mdpCrypted,
                    email: "wrong_email"
                })
                .end( (err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(404);
                    expect(res.body.found).to.equal(false);
                    expect(res.body.reason).to.equal("no user with this email");

                    done();
                });
        });

    });

    describe("Update one user", () => {

        const endpoint = "/users/update/";

        it('should update an existing user', async function (done) {

            mockApi
                .post(endpoint, {
                    firstname: "test",
                    lastname: "test",
                    birthdate: "1970/01/01",
                    email: USER_EMAIL,
                    newmail: "test@test",
                    password: "test",
                    username: "test"
                })
                .reply(200, {
                    "status": 200,
                    "updated": true
                });

            mockRequest
                .post(endpoint)
                .send({
                    firstname: "test",
                    lastname: "test",
                    birthdate: "1970/01/01",
                    email: USER_EMAIL,
                    newmail: "test@test",
                    password: "test",
                    username: "test"
                })
                .end( (err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.updated).to.equal(true);

                    done();
                });
        });

        it("should return not found when email doesn't exist", async function (done) {

            mockApi
                .post(endpoint, {
                    firstname: "test",
                    lastname: "test",
                    birthdate: "1970/01/01",
                    newmail: "test@test",
                    password: "test",
                    username: "test",
                    email: "wrong_email"
                })
                .reply(404, {
                    status: 404,
                    updated: false,
                    reason: "no user with this email"
                });

            mockRequest
                .post(endpoint)
                .send({
                    firstname: "test",
                    lastname: "test",
                    birthdate: "1970/01/01",
                    newmail: "test@test",
                    password: "test",
                    username: "test",
                    email: "wrong_email"
                })
                .end( (err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(404);
                    expect(res.body.updated).to.equal(false);
                    expect(res.body.reason).to.equal("no user with this email");

                    done();
                });
        });

        it("should return already exits when email does exist", async function (done) {

            mockApi
                .post(endpoint, {
                    firstname: "test",
                    lastname: "test",
                    birthdate: "1970/01/01",
                    newmail: "used_email",
                    password: "test",
                    username: "test",
                    email: USER_EMAIL
                })
                .reply(409, {
                    status: 409,
                    updated: false,
                    reason: "email already in use"
                });

            mockRequest
                .post(endpoint)
                .send({
                    firstname: "test",
                    lastname: "test",
                    birthdate: "1970/01/01",
                    newmail: "used_email",
                    password: "test",
                    username: "test",
                    email: USER_EMAIL
                })
                .end( (err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(409);
                    expect(res.body.updated).to.equal(false);
                    expect(res.body.reason).to.equal("email already in use");

                    done();
                });
        });

    });

    describe("Delete one user", () => {

        const endpoint = "/users/";

        it('should delete an existing user', async function (done) {

            mockApi
                .delete(endpoint, {
                    email: USER_EMAIL
                })
                .reply(200, {
                    status: 200,
                    deleted: true
                });

            mockRequest
                .delete(endpoint)
                .send({
                    email: USER_EMAIL
                })
                .end( (err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.deleted).to.equal(true);

                    done();
                });
        });

        it('should delete an existing user', async function (done) {

            mockApi
                .delete(endpoint, {
                    email: "wrong_email"
                })
                .reply(404, {
                    status: 404,
                    deleted: false,
                    reason: "no user with this email"
                });

            mockRequest
                .delete(endpoint)
                .send({
                    email: "wrong_email"
                })
                .end( (err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(404);
                    expect(res.body.deleted).to.equal(false);
                    expect(res.body.reason).to.equal("no user with this email");

                    done();
                });
        });

    });

});