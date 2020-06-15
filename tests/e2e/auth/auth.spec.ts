// @ts-ignore
import { mockSignin } from '../../unit/auth/_mocks_/mockSignin';
// @ts-ignore
import { mockSignup } from '../../unit/auth/_mocks_/mockSignup';
// @ts-ignore
import { mockForgotPassword } from '../../unit/auth/_mocks_/mockForgotPassword';
// @ts-ignore
import { mockCheckToken } from '../../unit/auth/_mocks_/mockCheckToken';
import * as http from "http";
import exp = require("constants");

export const USER_EMAIL = "random@test.com";
export const USER_PASSWORD = "abc123";
export const USER_USERNAME = "random";
export const USER_FIRSTNAME = "random";
export const USER_LASTNAME = "random";
export const USER_BIRTHDATE = "1970/01/01";

const baseApi = "http://localhost:3100";

const nock = require('nock');
const supertest = require('supertest');

const chai = require('chai');
const expect = chai.expect;


describe("Authentication tests", () => {

    const mockApi = nock(baseApi);
    const request = supertest(baseApi);

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