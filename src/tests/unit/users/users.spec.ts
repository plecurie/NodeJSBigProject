import {
    expect,
    RANDOM_ID,
    sinon,
    USER_BIRTHDATE,
    USER_EMAIL,
    USER_FIRSTNAME, USER_HASH_PASSWORD,
    USER_LASTNAME,
    USER_PASSWORD, USER_USERNAME
} from "../../mocks";
import {client} from "../../../utils/elasticsearch";
import {userController} from "../../../controllers";
import {AuthService, GeneratorService} from "../../../services";

describe("Users Unit tests", () => {

    let status, json, res, authService, generatorService, getStub,
        findByEmailStub, findStub, hashPasswdStub, updateStub, deleteStub;

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = {json, status};
        status.returns(res);
        authService = AuthService.getInstance();
        generatorService = GeneratorService.getInstance();
    });

    describe('When search user with ID', function () {
        it('Should return user personal informations', async done => {
            const req = {
                user_id: RANDOM_ID
            };

            const stubResponse = {
                body: {
                    hits: {
                        hits: [{}]
                    }
                }
            };

            getStub = sinon.stub(client, 'get').resolves(stubResponse);

            await userController.findOne(req, res);

            expect(getStub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].found).to.equal(true);
            done();
        });
    });

    describe("When update user", function () {

        afterEach(()=> {
            findByEmailStub.restore();
            findStub.restore();
        });

        it('Should update user personal informations', async done => {
            const req = {
                user_id: RANDOM_ID,
                body: {
                    firstname: USER_FIRSTNAME,
                    lastname: USER_LASTNAME,
                    birthdate: USER_BIRTHDATE,
                    email: USER_EMAIL,
                    password: USER_PASSWORD,
                    username: USER_USERNAME
                }
            };

            const stubResponse = {
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
            hashPasswdStub = sinon.stub(generatorService, "hashPassword").returns("newhashpasswd");
            updateStub = sinon.stub(client, 'update').resolves();

            await userController.update(req, res);

            expect(findByEmailStub.calledOnce).to.be.true;
            expect(findStub.calledOnce).to.be.true;
            expect(hashPasswdStub.calledOnce).to.be.true;
            expect(updateStub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].updated).to.equal(true);
            done();

        });
    });

    describe('When delete user', function () {

        it('Should delete the user and his personal informations', async done => {
            const req = {
                user_id: RANDOM_ID
            };

            deleteStub = sinon.stub(client, 'delete').resolves();

            await userController.delete(req, res);

            expect(deleteStub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].deleted).to.equal(true);
            done();
        });
    });

});
