import {
    expect,
    RANDOM_ID,
    sinon,
    USER_BIRTHDATE,
    USER_EMAIL,
    USER_FIRSTNAME,
    USER_HASH_PASSWORD,
    USER_LASTNAME,
    USER_PASSWORD,
    USER_TOKEN,
    USER_USERNAME
} from "../../mocks";
import {AuthService, GeneratorService, MailerService, PortfolioService, UserService} from "../../../services";
import {client} from "../../../utils/elasticsearch";
import * as jsonwebtoken from 'jsonwebtoken';
import {authController} from "../../../controllers";
import { User } from "../../../models/User";


describe("Authentication Unit tests", () => {

    let status, json, res, authService, mailerService, generatorService, portfolioService, updatePasswordStub,
        findByIdStub, next, userService,
        hashPasswdStub, findByEmailStub, findStub, indexStub, tokenStub, sendMailStub, stubResponse, stubFoundUser,
        checkValidStub, randomPasswdStub, portfolioStub, userValidatorForgotPasswordStub, userValidatorSignUpStub;

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        next = sinon.spy();
        res = {json, status};
        status.returns(res);
        authService = AuthService.getInstance();
        generatorService = GeneratorService.getInstance();
        portfolioService = PortfolioService.getInstance();
        userService = UserService.getInstance();
    });

    afterEach(() => {
        findByEmailStub.restore();
        findStub.restore();
    });

    describe("When signup a user", () => {

        afterEach(() => {
            userValidatorSignUpStub.restore();
            indexStub.restore();
            hashPasswdStub.restore();
            portfolioStub.restore();
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
                userValidatorSignUpStub = sinon.stub(userService, "userValidatorSignUp").returns(new User())
                findByEmailStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(stubFoundUser);
                hashPasswdStub = sinon.stub(generatorService, "hashPassword").returns(undefined);
                indexStub = sinon.stub(client, 'index').resolves();
                portfolioStub = sinon.stub(portfolioService, "create").returns();

                await authController.signup(req, res);
                
                expect(userValidatorSignUpStub.calledOnce).to.be.true;
                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(hashPasswdStub.calledOnce).to.be.false;
                expect(indexStub.calledOnce).to.be.false;
                expect(portfolioStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(403);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].created).to.equal(false);
                expect(json.args[0][0].reason).to.equal("email already exists");
                done();

            });

        });

        describe("if the email is not used", () => {

            it('should create a new user', async done => {

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

                const stubCreated = {
                    body: {
                        _id: RANDOM_ID
                    }
                };

                
                userValidatorSignUpStub = sinon.stub(userService, "userValidatorSignUp").returns(new User());
                findByEmailStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(undefined);
                hashPasswdStub = sinon.stub(generatorService, "hashPassword").returns("newhashpasswd");
                indexStub = sinon.stub(client, 'index').resolves(stubCreated);
                portfolioStub = sinon.stub(portfolioService, "create").returns();

                await authController.signup(req, res);

                expect(userValidatorSignUpStub.calledOnce).to.be.true;
                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(hashPasswdStub.calledOnce).to.be.true;
                expect(indexStub.calledOnce).to.be.true;
                expect(portfolioStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].created).to.equal(true);
                done();
            });
        });

        describe("if the email is missing", () => {

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
                userValidatorSignUpStub = sinon.stub(userService, "userValidatorSignUp").returns(new User());
                findByEmailStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body, "find").returns(undefined);
                hashPasswdStub = sinon.stub(generatorService, "hashPassword").returns(undefined);
                indexStub = sinon.stub(client, 'index').resolves();
                portfolioStub = sinon.stub(portfolioService, "create").returns();

                await authController.signup(req, res);

                expect(userValidatorSignUpStub.calledOnce).to.be.true;
                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.false;
                expect(hashPasswdStub.calledOnce).to.be.false;
                expect(indexStub.calledOnce).to.be.false;
                expect(portfolioStub.calledOnce).to.be.false;
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
            checkValidStub.restore();
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
                checkValidStub = sinon.stub(authService, "checkValidPassword").returns(true);
                tokenStub = sinon.stub(jsonwebtoken, "sign").resolves(USER_TOKEN);

                await authController.signin(req, res);

                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(checkValidStub.calledOnce).to.be.true;
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

                findByEmailStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(stubFoundUser);
                checkValidStub = sinon.stub(authService, "checkValidPassword").returns(false);
                tokenStub = sinon.stub(jsonwebtoken, "sign").resolves(USER_TOKEN);

                await authController.signin(req, res);

                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(checkValidStub.calledOnce).to.be.true;
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

                findByEmailStub = sinon.stub(authService, "findByEmail").resolves(stubResponse);
                findStub = sinon.stub(stubResponse.body.hits.hits, "find").returns(undefined);
                checkValidStub = sinon.stub(authService, "checkValidPassword").returns(undefined);
                tokenStub = sinon.stub(jsonwebtoken, "sign").resolves(USER_TOKEN);

                await authController.signin(req, res);

                expect(findByEmailStub.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(checkValidStub.calledOnce).to.be.false;
                expect(tokenStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(403);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].connect).to.equal(false);
                expect(json.args[0][0].reason).to.equal("invalid email");
                done();

            });

        });

    });

    describe("When checking token", () => {

        afterEach(() => {
            tokenStub.restore()
        });

        describe("if the user has a valid token", () => {
            it('should do next()', async done => {
                const req = {
                    headers: {
                        authorization: USER_TOKEN
                    }
                };

                tokenStub = sinon.stub(jsonwebtoken, 'verify').returns({user_id: RANDOM_ID});

                await authController.checkToken(req, res, next);

                expect(tokenStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.false;
                expect(json.calledOnce).to.be.false;
                expect(next.calledOnce).to.be.false;

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

                tokenStub = sinon.stub(jsonwebtoken, "verify").callsFake(() => {
                    res.status(401).json({reason: 'unidentified user'});
                });

                await authController.checkToken(req, res, next);

                expect(tokenStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(401);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].reason).to.equal('unidentified user');
                expect(next.calledOnce).to.be.false;

                done();
            })
        });

        describe("if the user has no token", () => {
            it('should return unidentified user', async done => {
                const req = {
                    headers: {
                        authorization: undefined
                    }
                };

                tokenStub = sinon.stub(jsonwebtoken, "verify").resolves(USER_TOKEN);

                await authController.checkToken(req, res, next);

                expect(tokenStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(403);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].reason).to.equal('access refused');
                expect(next.calledOnce).to.be.false;

                done();
            })
        });
    });
});
