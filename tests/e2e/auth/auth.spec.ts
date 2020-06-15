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
export const ACCESS_TOKEN = "xyz";
export const DATATYPE = "user";

const email = 'abc@xyz.com';
const baseApi = "http://localhost:3100";

const nock = require('nock');
const supertest = require('supertest');

const chai = require('chai');
const expect = chai.expect;


describe("Authentication tests", () => {

    const endpoint = "/auth/signup/";
    const mockApi = nock(baseApi);
    const request = supertest(baseApi);

    describe("Signup", () => {

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
                    "body": {
                        "_index": "scala",
                        "_type": "database",
                        "_id": "TOuUuHIBCLyAss8cDkS5",
                        "_version": 1,
                        "result": "created",
                        "_shards": {
                            "total": 2,
                            "successful": 1,
                            "failed": 0
                        },
                        "_seq_no": 0,
                        "_primary_term": 1
                    },
                    "statusCode": 201,
                    "headers": {
                        "location": "/scala/database/TOuUuHIBCLyAss8cDkS5",
                        "warning": "299 Elasticsearch-7.7.0-81a1e9eda8e6183f5237786246f6dced26a10eaf \"[types removal] Specifying types in document index requests is deprecated, use the typeless endpoints instead (/{index}/_doc/{id}, /{index}/_doc, or /{index}/_create/{id}).\"",
                        "content-type": "application/json; charset=UTF-8",
                        "content-length": "176"
                    },
                    "warnings": [
                        "299 Elasticsearch-7.7.0-81a1e9eda8e6183f5237786246f6dced26a10eaf \"[types removal] Specifying types in document index requests is deprecated, use the typeless endpoints instead (/{index}/_doc/{id}, /{index}/_doc, or /{index}/_create/{id}).\""
                    ],
                    "meta": {
                        "context": null,
                        "request": {
                            "params": {
                                "method": "POST",
                                "path": "/scala/database",
                                "body": "{\"type\":\"user\",\"firstname\":\"soso\",\"lastname\":\"sisi\",\"username\":\"beurk\",\"birthdate\":\"1996/05/10\",\"email\":\"tibdev78@gmail.com\",\"password\":\"$2b$15$vzSDaR8Bp1QpwFhmPy9YbuavUy5BqSV2xgopSpfiyPlfMvG6fFsSG\"}",
                                "querystring": "",
                                "headers": {
                                    "user-agent": "elasticsearch-js/7.7.1 (linux 4.15.0-101-generic-x64; Node.js v14.4.0)",
                                    "content-type": "application/json",
                                    "content-length": "199"
                                },
                                "timeout": 30000
                            },
                            "options": {
                                "warnings": null
                            },
                            "id": 15
                        },
                        "name": "elasticsearch-js",
                        "connection": {
                            "url": "http://localhost:9200/",
                            "id": "http://localhost:9200/",
                            "headers": {},
                            "deadCount": 0,
                            "resurrectTimeout": 0,
                            "_openRequests": 0,
                            "status": "alive",
                            "roles": {
                                "master": true,
                                "data": true,
                                "ingest": true,
                                "ml": false
                            }
                        },
                        "attempts": 0,
                        "aborted": false
                    }
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
                    expect(res.body.body._index).to.equal("scala");
                    expect(res.body.body.result).to.equal("created");
                    expect(res.body.statusCode).to.equal(201);
                    done();
                });
        });
    });

    describe("Signin", () => {

        it('should signup an existing user', function (done) {

        })
    });

    describe("CheckToken", () => {

        it('should check the token of the user', function (done) {

        })
    });

    describe("Forgot Pasword", () => {

        it('should send an email to the user', function (done) {

        })
    });

});