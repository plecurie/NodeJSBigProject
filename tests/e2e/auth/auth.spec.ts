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
                    "status": 201,
                    "created": true
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
                    "status": 200,
                    "connect": true,
                    "token": "xyz"
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
                    expect(res.body.connect).to.equal(true);
                    expect(res.body.token).to.equal("xyz");
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
                    "status": 200,
                    "valid": true,
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
        })
    });

    describe("Forgot Pasword", () => {

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


        })
    });

});