import {
    RANDOM_ID,
    USER_TOKEN,
    USER_BIRTHDATE,
    USER_EMAIL,
    USER_FIRSTNAME,
    USER_HASH_PASSWORD,
    USER_LASTNAME,
    USER_PASSWORD,
    USER_USERNAME
} from "../../mockConfig";
import {AuthService, MailerService} from "../../../services";
import {AuthController} from "../../../controllers/authentication/auth";
import {client} from "../../../utils/elasticsearch";
import * as jsonwebtoken from 'jsonwebtoken';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require("sinon");

describe("Authentication Unit tests", () => {

    let status, json, res, authController, authService, mailerService, updatePasswordStub, findByIdStub,
        findByEmailStub, findStub, indexStub, tokenStub, sendMailStub, stubResponse, stubFoundUser;

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = {json, status};
        status.returns(res);
        authService = AuthService.getInstance();
    });

    afterEach(() => {
        findByEmailStub.restore();
        findStub.restore();
    });

    describe("When signup a user", () => {

        afterEach(() => {
            indexStub.restore();
        });

        describe("if the email is already used", () => {

            it('should return already used', async done => {

                const req = {
                    body: {
                        firstname: USER_FIRSTNAME,
                        lastname: USER_LASTNAME,
                        birthdate: USER_BIRTHDATE,
                        email: USER_EMAIL,
                        password: USER_PASSWORD,
                        username: USER_USERNAME
                    }
                };

                stubResponse = {
                    body: {
                        hits: {
                            hits: {
                                find: () => {
                                }
                            }
                        }
                    }
                };

                stubFoundUser = {
                    _id: RANDOM_ID,
                    _source: {
                        firstname: USER_FIRSTNAME,
                        lastname: USER_LASTNAME,
                        birthdate: USER_BIRTHDATE,
                        type: 'user',
                        email: USER_EMAIL,
                        password: USER_HASH_PASSWORD,
                        username: USER_USERNAME
                    }
                };

                findByEmailStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(stubFoundUser);
                indexStub = sinon.stub(client, 'index').resolves();

                authController = new AuthController();
                await authController.signup(req, res);

                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(indexStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(409);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].created).to.equal(false);
                expect(json.args[0][0].reason).to.equal("email already exists");
                done();

            });

        });

        describe("if the email is not used", () => {

            it('should index a new user', async done => {

                const req = {
                    body: {
                        firstname: USER_FIRSTNAME,
                        lastname: USER_LASTNAME,
                        birthdate: USER_BIRTHDATE,
                        email: USER_EMAIL,
                        password: USER_PASSWORD,
                        username: USER_USERNAME
                    }
                };

                stubResponse = {
                    body: {
                        hits: {
                            hits: {
                                find: () => {
                                }
                            }
                        }
                    }
                };

                findByEmailStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(undefined);
                indexStub = sinon.stub(client, 'index').resolves();

                authController = new AuthController();
                await authController.signup(req, res);

                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(indexStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(201);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].created).to.equal(true);
                done();
            });
        });

        describe("if the request is malformed (advanced)", () => {

            it('should return error 500', async done => {

                const req = {
                    body: {
                        firstname: USER_FIRSTNAME,
                        lastname: USER_LASTNAME,
                        birthdate: USER_BIRTHDATE,
                        password: USER_PASSWORD,
                        username: USER_USERNAME
                    }
                };

                stubResponse = {
                    body: {
                        error: [Object],
                        status: 400,
                        find: () => {
                        }
                    },
                };

                findByEmailStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body, "find").returns(undefined);
                indexStub = sinon.stub(client, 'index').resolves();

                authController = new AuthController();
                await authController.signup(req, res);

                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.false;
                expect(indexStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(500);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].created).to.equal(false);
                done();
            });
        });
    });

    describe("When login a user", () => {

        afterEach(() => {
            tokenStub.restore();
        });

        describe("if valid email and valid password", () => {

            it('should login the user', async done => {
                const req = {
                    body: {
                        email: USER_EMAIL,
                        password: USER_PASSWORD,
                    }
                };

                stubResponse = {
                    body: {
                        hits: {
                            hits: {
                                find: () => {
                                }
                            }
                        }
                    }
                };

                stubFoundUser = {
                    _id: RANDOM_ID,
                    _source: {
                        firstname: USER_FIRSTNAME,
                        lastname: USER_LASTNAME,
                        birthdate: USER_BIRTHDATE,
                        type: 'user',
                        email: USER_EMAIL,
                        password: USER_HASH_PASSWORD,
                        username: USER_USERNAME
                    }
                };

                findByEmailStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(stubFoundUser);
                tokenStub = sinon.stub(jsonwebtoken, "sign").resolves(USER_TOKEN);

                authController = new AuthController();
                await authController.signin(req, res);

                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(tokenStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].connect).to.equal(true);
                expect(json.args[0][0].token).to.equal(USER_TOKEN);
                done();

            });

        });

        describe("if valid email and wrong password", () => {

            it('should return wrong password', async done => {
                const req = {
                    body: {
                        email: USER_EMAIL,
                        password: "random_password",
                    }
                };

                stubResponse = {
                    body: {
                        hits: {
                            hits: {
                                find: () => {
                                }
                            }
                        }
                    }
                };

                stubFoundUser = {
                    _id: RANDOM_ID,
                    _source: {
                        firstname: USER_FIRSTNAME,
                        lastname: USER_LASTNAME,
                        birthdate: USER_BIRTHDATE,
                        type: 'user',
                        email: USER_EMAIL,
                        password: USER_HASH_PASSWORD,
                        username: USER_USERNAME
                    }
                };

                updatePasswordStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(stubFoundUser);
                tokenStub = sinon.stub(jsonwebtoken, "sign").resolves(USER_TOKEN);

                authController = new AuthController();
                await authController.signin(req, res);

                expect(updatePasswordStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(tokenStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(403);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].connect).to.equal(false);
                expect(json.args[0][0].reason).to.equal("invalid password");
                done();

            });

        });

        describe("if email doesn't exists", () => {

            it('should return invalid email', async done => {

                const req = {
                    body: {
                        email: "random@email.fr",
                        password: USER_PASSWORD,
                    }
                };

                stubResponse = {
                    body: {
                        hits: {
                            hits: {
                                find: () => {
                                }
                            }
                        }
                    }
                };

                updatePasswordStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(undefined);
                tokenStub = sinon.stub(jsonwebtoken, "sign").resolves(USER_TOKEN);

                authController = new AuthController();
                await authController.signin(req, res);

                expect(updatePasswordStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(tokenStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(403);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].connect).to.equal(false);
                expect(json.args[0][0].reason).to.equal("invalid email");
                done();

            });

        });

        describe("if the request is malformed (advanced)", () => {

            it('should return error 500', async done => {

                const req = {
                    body: {
                        email: USER_EMAIL
                    }
                };

                stubResponse = {
                    body: {
                        error: [Object],
                        status: 400,
                        find: () => {
                        }
                    }
                };

                stubFoundUser = undefined;

                findByEmailStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body, "find").returns(stubFoundUser);

                authController = new AuthController();
                await authController.signin(req, res);

                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(500);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].connect).to.equal(false);
                done();
            });
        });

    });

    describe("When generating new password", () => {

        beforeEach(() => {
            mailerService = MailerService.getInstance();
        });

        afterEach(() => {
            sendMailStub.restore();
            findByIdStub.restore();
            updatePasswordStub.restore();
            tokenStub.restore()
        });

        describe("if the user is known", () => {
            it('should generate/update the password and send an email with the new password', async done => {
                const req = {
                    user_id: RANDOM_ID,
                };

                stubResponse = {
                    body: {
                        hits: {
                            hits: {
                                find: () => {
                                }
                            }
                        }
                    }
                };

                stubFoundUser = {
                    _id: RANDOM_ID,
                    _source: {
                        firstname: USER_FIRSTNAME,
                        lastname: USER_LASTNAME,
                        birthdate: USER_BIRTHDATE,
                        type: 'user',
                        email: USER_EMAIL,
                        password: USER_HASH_PASSWORD,
                        username: USER_USERNAME
                    }
                };

                findByIdStub = sinon.stub(authService, "findById").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(stubFoundUser);
                updatePasswordStub = sinon.stub(authService, "updateUserPassword").resolves();
                sendMailStub = sinon.stub(mailerService, "sendEmail").returns();

                authController = new AuthController();
                await authController.generateNewPassword(req, res);

                expect(findByIdStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(updatePasswordStub.calledOnce).to.be.true;
                expect(sendMailStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].updated).to.equal(true);

                done();
            })
        });

        describe("if the user is not known", () => {
            it('should return access refused', async done => {
                const req = {
                    user_id: 'abcxyz26'
                };

                stubResponse = {
                    body: {
                        hits: {
                            hits: {
                                find: () => {
                                }
                            }
                        }
                    }
                };

                stubFoundUser = {
                    _id: RANDOM_ID,
                    _source: {
                        firstname: USER_FIRSTNAME,
                        lastname: USER_LASTNAME,
                        birthdate: USER_BIRTHDATE,
                        type: 'user',
                        email: USER_EMAIL,
                        password: USER_HASH_PASSWORD,
                        username: USER_USERNAME
                    }
                };

                findByIdStub = sinon.stub(authService, "findById").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(undefined);
                updatePasswordStub = sinon.stub(authService, "updateUserPassword").resolves();
                sendMailStub = sinon.stub(mailerService, "sendEmail").returns();

                authController = new AuthController();
                await authController.generateNewPassword(req, res);

                expect(findByIdStub.calledOnce).to.be.true;
                expect(updatePasswordStub.calledOnce).to.be.false;
                expect(sendMailStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(403);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].updated).to.equal(false);
                expect(json.args[0][0].reason).to.equal('access refused');

                done();
            })
        });

        describe("if the user is unidentified", () => {
            it('should return access refused', async done => {
                const req = {
                    user_id: undefined,
                };

                stubResponse = {
                    body: {
                        hits: {
                            hits: {
                                find: () => {
                                }
                            }
                        }
                    }
                };

                findByIdStub = sinon.stub(authService, "findById").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(undefined);
                updatePasswordStub = sinon.stub(authService, "updateUserPassword").resolves();
                sendMailStub = sinon.stub(mailerService, "sendEmail").returns();

                authController = new AuthController();
                await authController.generateNewPassword(req, res);

                expect(findByIdStub.calledOnce).to.be.false;
                expect(updatePasswordStub.calledOnce).to.be.false;
                expect(sendMailStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(403);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].updated).to.equal(false);
                expect(json.args[0][0].reason).to.equal('access refused');

                done();
            })
        })
    });

    describe("When checking token", () => {

        afterEach(() => {
            tokenStub.restore()
        });

        describe("if the user has no token", () => {
            it('should return unidentified user', async done => {
                const req = {
                    headers: {
                        authorization: undefined
                    }
                };

                tokenStub = sinon.stub(jsonwebtoken, "verify").resolves(USER_TOKEN);

                authController = new AuthController();
                await authController.checkToken(req, res);

                expect(tokenStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(401);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].reason).to.equal('unidentified user');

                done();
            })
        });

        describe("if the user has a non valid token", () => {
            it('should return unidentified user', async done => {
                const req = {
                    headers: {
                        authorization: "invalidtoken"
                    }
                };

                authController = new AuthController();
                await authController.checkToken(req, res);

                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(403);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].reason).to.equal('access refused');

                done();
            })
        });

        describe("if the user has a valid token", () => {
            it('should do next()', async done => {
                const req = {
                    headers: {
                        authorization: USER_TOKEN
                    }
                };

                tokenStub = sinon.stub(jsonwebtoken, 'verify').returns({user_id: RANDOM_ID});

                authController = new AuthController();
                await authController.checkToken(req, res);

                expect(status.calledOnce).to.be.false;
                expect(json.calledOnce).to.be.false;

                done();
            })
        });
    });
});
