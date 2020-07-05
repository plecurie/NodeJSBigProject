import {
    USER_BIRTHDATE, USER_EMAIL,
    USER_FIRSTNAME,
    USER_LASTNAME,
    USER_PASSWORD,
    USER_USERNAME
} from "../../mockConfig";
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const sinon = require("sinon");
import {AuthService } from "../../../services";
import {AuthController} from "../../../controllers/authentication/auth";
import {client} from "../../../utils/elasticsearch";

describe("Authentication Unit tests", () => {

    describe("When signup a user", () => {
        describe("if the email is already used", () => {
            let status, json, res, authController, authService;

            beforeEach(() => {
                status = sinon.stub();
                json = sinon.spy();
                res = { json, status };
                status.returns(res);
                authService = AuthService.getInstance();
            });

            it('should signup a new user', async done => {

                const req = {
                    body: {
                        firstname: USER_FIRSTNAME,
                        lastname: USER_LASTNAME,
                        birthdate: USER_BIRTHDATE,
                        email: "random@test.com",
                        password: USER_PASSWORD,
                        username: USER_USERNAME
                    }
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

                const authStub = sinon.stub(authService, "findByEmail").resolves(stubValue);
                const findStub = sinon.stub(stubValue.body.hits.hits, "find").returns();
                const indexStub = sinon.stub(client, 'index').resolves();

                authController = new AuthController();
                await authController.signup(req, res);

                expect(authStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(indexStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(201);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].created).to.equal(true);
                done();
            });


        });
    })
});
