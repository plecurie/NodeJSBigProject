import {
    mockSignin,
    USER_EMAIL,
    USER_PASSWORD,
    USER_USERNAME
} from '../../src/controllers/authentication/_mocks_/mockSignin';
import { mockSignup } from '../../src/controllers/authentication/_mocks_/mockSignup';
import { mockForgotPassword } from '../../src/controllers/authentication/_mocks_/mockForgotPassword';
import { mockCheckToken } from '../../src/controllers/authentication/_mocks_/mockCheckToken';
const app = require("../appMock");
const supertest= require('supertest');

const addHeaders = (request: any) =>
    request.set('Content-Type', 'application/json');

/*const addAuthHeaders = (request: any, accessToken = ACCESS_TOKEN) =>
    request
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`);*/

describe('App', () => {
    it('Should exists', () => {
        expect(app).toBe('function');})
});

describe("Authentication tests", () => {

    const put_forgotpassword = "/auth/forgot-password";

    const post_checkToken = "/auth/checkToken";

    let request = supertest(app.appMock());

    const email = 'abc@xyz.com';

    beforeEach(() => {
        mockSignin.mockClear();
        mockSignup.mockClear();
        mockForgotPassword.mockClear();
        mockCheckToken.mockClear();
    });

    describe("Signup", () => {

        const endpoint = "/auth/signup";

        it('Should send error when empty body is sent', async () => {
            const response = await addHeaders(request.post(endpoint));
            expect(response.status).toBe(400);
            expect(mockSignup).not.toBeCalled();
        });

        it('Should send error when name is not sent', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: email,
                    password: USER_PASSWORD,
                }),
            );
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/username/);
            expect(response.body.message).toMatch(/required/);
            expect(mockSignup).not.toBeCalled();
        });

        it('Should send error when email is not valid format', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: 'abc',
                    username: USER_USERNAME,
                    password: USER_PASSWORD,
                }),
            );
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/valid email/);
            expect(mockSignup).not.toBeCalled();
        });

        it('Should send error when user is registered for email', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: USER_EMAIL,
                    username: USER_USERNAME,
                    password: USER_PASSWORD,
                }),
            );
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/already registered/);
            expect(mockSignup).not.toBeCalled();
        });

        it('Should send success response for correct data', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: email,
                    username: USER_USERNAME,
                    password: USER_PASSWORD,
                }),
            );
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/Success/i);
            expect(response.body.data).toBeDefined();

            // expect(response.body.data.user).toHaveProperty('_id');
            // expect(response.body.data.user).toHaveProperty('email');
            // expect(response.body.data.user).toHaveProperty('password');
            //
            // expect(response.body.data.tokens).toBeDefined();
            // expect(response.body.data.tokens).toHaveProperty('accessToken');
            // expect(response.body.data.tokens).toHaveProperty('refreshToken');

            expect(mockSignup).toBeCalledTimes(1);

        });
    });

    describe("Signin", () => {

        const endpoint = "/auth/login";

        it('Should send error when email is not sent', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    username: USER_USERNAME,
                    password: USER_PASSWORD,
                }),
            );
            console.log(response);
            expect(mockSignin).toBeCalled();
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/email/);
            expect(response.body.message).toMatch(/required/);

        });

        it('Should send error when password is not sent', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: email,
                    username: USER_USERNAME,
                }),
            );
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/password/);
            expect(response.body.message).toMatch(/required/);
            expect(mockSignin).not.toBeCalled();
        });

        it('Should send error when password is not valid format', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: email,
                    username: USER_USERNAME,
                    password: '123',
                }),
            );
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/password length/);
            expect(mockSignin).not.toBeCalled();
        });

        it('Should send success response for correct data', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: email,
                    username: USER_USERNAME,
                    password: USER_PASSWORD,
                }),
            );
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/Success/i);
            expect(response.body.data).toBeDefined();

            // expect(response.body.data.user).toHaveProperty('_id');
            // expect(response.body.data.user).toHaveProperty('name');
            // expect(response.body.data.user).toHaveProperty('roles');
            // expect(response.body.data.user).toHaveProperty('profilePicUrl');
            //
            // expect(response.body.data.tokens).toBeDefined();
            // expect(response.body.data.tokens).toHaveProperty('accessToken');
            // expect(response.body.data.tokens).toHaveProperty('refreshToken');

            expect(mockSignin).toBeCalledTimes(1);

        });
    });

    describe("Forgot Password", () => {

    });

    describe("Check Token", () => {

    });
});
/*

    it("should signup user", (done) => {

        request(app)
            .post('/auth/signup')
            .send({ "type": "user", "firstname": "user", "lastname": "test", "birthdate": "1996/05/10",
                "email": "user@test.com", "password": "test", "username": "test" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201, function (err, res) {
                if (err) return done(err);
                expect(res.status).to.equal(201);
                done();
            });
    });

    it('should signin user', function (done) {
        request(app)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'email', password: 'password' })
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    afterEach(function(done) {
        done();
    });

});
*/



/*
var nock = require('nock');
var request = require('supertest')("http://localhost:9200");
var expect = require('chai').expect;
let app;


describe("# Authentication tests", () => {

    // const defaultUser : User = { firstname: "user", lastname: "test", birthdate: new Date('1996/05/10'),
    //     email: "user@test.com", password: "test", username: "test" };
    // const createUser = async () => {
    //     await userController.create({body: {defaultUser}},{});
    // };

    before((done) => {
        app = require('../../app');
        app.start()
            .then(() => {
                console.info('listening on', process.env.PORT);
                app.listen(process.env.PORT, done)
            })
            .catch(err => {
                console.log(err);
                done(err)
            });

        //specify the url to be intercepted
        nock("http://localhost:9200")
            //define the method to be intercepted
            .put('/scala/database/')
            //respond with a OK and the specified JSON response
            .reply(201, {
                "_index" : "scala",
                "_type" : "database",
                "_id" : "1",
                "_version" : 1,
                "result" : "created",
                "_shards" : {
                    "total" : 2,
                    "successful" : 2,
                    "failed" : 0
                },
                "_seq_no" : 26,
                "_primary_term" : 4
            });

        nock("http://localhost:9200")
            //define the method to be intercepted
            .post('/auth/login')
            //respond with a OK and the specified JSON response
            .reply(200, {
                "status": 200,
                "message": "Connected"
            });

        nock("http://localhost:9200")
            //define the method to be intercepted
            .post('/auth/logout')
            //respond with a OK and the specified JSON response
            .reply(200, {
                "status": 200,
                "message": "Disconnected"
            });
    });

/!*    it("should create user", (done) => {

        //perform the request to the api which will now be intercepted by nock
        request
            .put('/scala/database/1')
            .send({ "type": "user","firstname": "user", "lastname": "test", "birthdate": "1996/05/10",
                "email": "user@test.com", "password": "test", "username": "test" })
            .end((err, res) => {
                //assert that the mocked response is returned
                expect(res.body.status).to.equal(201);
                expect(res.body.message).to.equal("Created");
                done();
            });
    });*!/

    it("should login user", (done) => {

        //perform the request to the api which will now be intercepted by nock
        const res = request
            .post('/auth/login')
            .end((err, res) => {
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.equal("Connected");
                done();
            })
    });

    it("should disconnect user", (done) => {

        //perform the request to the api which will now be intercepted by nock
        request
            .post('/auth/logout')
            .end((err, res) => {
                //assert that the mocked response is returned
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.equal("Disconnected");
                done();
            });
    });

        it('should create a new post', async () => {
            const res = await request(app)
                .post('/api/posts')
                .send({
                    userId: 1,
                    title: 'test is cool',
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('post')
        });

    after(() => {
        nock.cleanAll();
    })

})*/
