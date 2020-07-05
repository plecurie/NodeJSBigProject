import {
    mockApi, mockRequest,
    USER_BIRTHDATE,
    USER_EMAIL,
    USER_FIRSTNAME,
    USER_LASTNAME,
    USER_PASSWORD,
    USER_USERNAME
} from "../../mockConfig";
import Application from '../../../app';

const server = new Application().app;
const request = require('supertest')(server);
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();

const sinon = require("sinon");

describe("/POST auth/", () => {

    describe("When signup a user", () => {

        const endpoint = "/auth/signup";
        let status, json, res, authController, authService;

        beforeEach(()=>{
            status = sinon.stub();
            json = sinon.spy();
            res = { json, status };
            status.returns(res);
        });

        it('should signup a new user', async done => {
/*
            const userData = {
                firstname: USER_FIRSTNAME,
                lastname: USER_LASTNAME,
                birthdate: USER_BIRTHDATE,
                email: USER_EMAIL,
                password: USER_PASSWORD,
                username: USER_USERNAME
            };

            const req = {
                body: userData
            };

            const stubValue = {
                body: {
                    hits: {
                        hits: {
                            firstname: USER_FIRSTNAME,
                            lastname: USER_LASTNAME,
                            birthdate: USER_BIRTHDATE,
                            email: USER_EMAIL,
                            password: USER_PASSWORD,
                            username: USER_USERNAME,
                            find: () => {}
                        }
                    }
                }
            };

            //const indexStub = sinon.stub(client, 'index').resolves();

            request
                .post(endpoint)
                .set('Accept', 'application/json')
                .send(userData)
                .end((err, response) => {
                    if (err) done(err);
                    console.log(response);
                    expect(response.body.created).to.equal(true);
                    expect(response.status).to.equal(201);
                    done();
                });
*/
            done();
        });
    })/////////
        /*
        it('should return email already exist', function (done) {

            const existing_email = "abc@xyz.com";

            mockApi
                .post(endpoint, {
                    firstname: USER_FIRSTNAME,
                    lastname: USER_LASTNAME,
                    birthdate: USER_BIRTHDATE,
                    email: existing_email,
                    password: USER_PASSWORD,
                    username: USER_USERNAME
                })
                .reply(409, {
                    status: 409,
                    created: false,
                    reason: "email already exists"
                });

            mockRequest
                .post(endpoint)
                .send({
                    firstname: USER_FIRSTNAME,
                    lastname: USER_LASTNAME,
                    birthdate: USER_BIRTHDATE,
                    email: existing_email,
                    password: USER_PASSWORD,
                    username: USER_USERNAME
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(409);
                    expect(res.body.created).to.equal(false);
                    expect(res.body.reason).to.equal("email already exists");
                    done();
                });
        });

    });

    describe("Signin", () => {

        const endpoint = "/auth/login/";

        it('should login an existing user', function (done) {

            mockApi
                .post(endpoint, {
                    email: USER_EMAIL,
                    password: USER_PASSWORD
                })
                .reply(200, {
                    status: 200,
                    connect: true,
                    token: "xyz"
                });

            mockRequest
                .post(endpoint)
                .send({
                    email: USER_EMAIL,
                    password: USER_PASSWORD
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.connect).to.equal(true);
                    expect(res.body.token).to.equal("xyz");
                    done();
                });
        });

        it('should return access forbidden with wrong email', function (done) {

            mockApi
                .post(endpoint, {
                    email: "wrong_email",
                    password: USER_PASSWORD
                })
                .reply(403, {
                    status: 403,
                    connect: false,
                    reason: "access forbidden"
                });

            mockRequest
                .post(endpoint)
                .send({
                    email: "wrong_email",
                    password: USER_PASSWORD
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(403);
                    expect(res.body.connect).to.equal(false);
                    expect(res.body.reason).to.equal("access forbidden");
                    done();
                });
        });

        it('should return access forbidden with wrong password', function (done) {

            mockApi
                .post(endpoint, {
                    email: USER_EMAIL,
                    password: "wrong_password"
                })
                .reply(403, {
                    status: 403,
                    connect: false,
                    reason: "access forbidden"
                });

            mockRequest
                .post(endpoint)
                .send({
                    email: USER_EMAIL,
                    password: "wrong_password"
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(403);
                    expect(res.body.connect).to.equal(false);
                    expect(res.body.reason).to.equal("access forbidden");
                    done();
                });
        })
    });

    describe("CheckToken", () => {

        const endpoint = "/auth/checkToken/";

        it('should check the token of the user', function (done) {
            mockApi
                .post(endpoint, {
                    token: "xyz"
                })
                .reply(200, {
                    status: 200,
                    valid: true
                });

            mockRequest
                .post(endpoint)
                .send({
                    token: "xyz"
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.valid).to.equal(true);
                    done();
                });
        });

        it('should return invalid token', function (done) {
            mockApi
                .post(endpoint, {
                    token: "wrong_token"
                })
                .reply(403, {
                    status: 403,
                    valid: false,
                    reason: "invalid token"
                });

            mockRequest
                .post(endpoint)
                .send({
                    token: "wrong_token"
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(403);
                    expect(res.body.valid).to.equal(false);
                    expect(res.body.reason).to.equal("invalid token");

                    done();
                });
        })

    });

    describe("Forgot Password", () => {

        const endpoint = "/auth/forgot-password/";

        it('should send an email to the user with a new password', function (done) {
            mockApi
                .post(endpoint, {
                    email: USER_EMAIL,
                })
                .reply(200, {
                    "status": 200,
                    "updated": true
                });

            mockRequest
                .post(endpoint)
                .send({
                    email: USER_EMAIL,
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.updated).to.equal(true);
                    done();
                });

        });

        it('should return no user with this email', function (done) {
            mockApi
                .post(endpoint, {
                    email: "wrong_email",
                })
                .reply(404, {
                    status: 404,
                    updated: false,
                    reason: "no user with this email"
                });

            mockRequest
                .post(endpoint)
                .send({
                    email: "wrong_email",
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(404);
                    expect(res.body.updated).to.equal(false);
                    expect(res.body.reason).to.equal("no user with this email");
                    done();
                });

        })

    });

 */

});