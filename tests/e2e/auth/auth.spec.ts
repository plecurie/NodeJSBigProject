import {
    mockApi, request,
    USER_BIRTHDATE,
    USER_EMAIL,
    USER_FIRSTNAME,
    USER_LASTNAME,
    USER_PASSWORD,
    USER_USERNAME
} from "../mockConfig";

const chai = require('chai');
const expect = chai.expect;

describe("Authentication E2E tests", () => {

    describe("Signup", () => {

        const endpoint = "/auth/signup/";

        it('should signup a new user', function (done) {

            mockApi
                .post(endpoint, {
                    firstname: USER_FIRSTNAME,
                    lastname: USER_LASTNAME,
                    birthdate: USER_BIRTHDATE,
                    email: USER_EMAIL,
                    password: USER_PASSWORD,
                    username: USER_USERNAME
                })
                .reply(201, {
                    status: 201,
                    created: true
                });

            request
                .post(endpoint)
                .send({
                    firstname: USER_FIRSTNAME,
                    lastname: USER_LASTNAME,
                    birthdate: USER_BIRTHDATE,
                    email: USER_EMAIL,
                    password: USER_PASSWORD,
                    username: USER_USERNAME
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(201);
                    expect(res.body.created).to.equal(true);
                    done();
                });
        });

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

            request
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
                    connected: true,
                    token: "xyz"
                });

            request
                .post(endpoint)
                .send({
                    email: USER_EMAIL,
                    password: USER_PASSWORD
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.connected).to.equal(true);
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
                    connected: false,
                    reason: "access forbidden"
                });

            request
                .post(endpoint)
                .send({
                    email: "wrong_email",
                    password: USER_PASSWORD
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(403);
                    expect(res.body.connected).to.equal(false);
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
                    connected: false,
                    reason: "access forbidden"
                });

            request
                .post(endpoint)
                .send({
                    email: USER_EMAIL,
                    password: "wrong_password"
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(403);
                    expect(res.body.connected).to.equal(false);
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

            request
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

            request
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

            request
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

            request
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

});