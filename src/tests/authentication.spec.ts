var nock = require('nock');
var request = require('supertest')("http://localhost:3000");
var expect = require('chai').expect;
const app = require('../app.js');
import {userController} from "../controllers";
import {User} from "../models/User";

describe("# Authentication tests", () => {

    // const defaultUser : User = { firstname: "user", lastname: "test", birthdate: new Date('1996/05/10'),
    //     email: "user@test.com", password: "test", username: "test" };
    // const createUser = async () => {
    //     await userController.create({body: {defaultUser}},{});
    // };

    before((done) => {

        // createUser
        //     .post('/login')
        //     .send(defaultUser)
        //     .end(function(err, response){
        //         expect(response.statusCode).to.equal(200);
        //         done();
        //     });

        //specify the url to be intercepted
        nock("http://localhost:3000")
            //define the method to be intercepted
            .get('/auth/signup')
            //respond with a OK and the specified JSON response
            .reply(201, {
                "status": 201,
                "message": "Created"
            });

        nock("http://localhost:3000")
            //define the method to be intercepted
            .post('/auth/login')
            //respond with a OK and the specified JSON response
            .reply(200, {
                "status": 200,
                "message": "Connected"
            });

        nock("http://localhost:3000")
            //define the method to be intercepted
            .post('/auth/logout')
            //respond with a OK and the specified JSON response
            .reply(200, {
                "status": 200,
                "message": "Disconnected"
            });
    });

    it("should create user", (done) => {

        //perform the request to the api which will now be intercepted by nock
        request
            .get('/auth/signup')
            .end((err, res) => {
                //assert that the mocked response is returned
                expect(res.body.status).to.equal(201);
                expect(res.body.message).to.equal("Created");
                done();
            });
    });

    it("should connect user", (done) => {

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

/*    describe('Post Endpoints', () => {
        it('should create a new post', async () => {
            const res = await request(app)
                .post('/api/posts')
                .send({
                    userId: 1,
                    title: 'test is cool',
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('post')
        })
    });*/

    after(() => {
        nock.cleanAll();
    })

});