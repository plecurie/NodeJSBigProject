import {expect, LIST_PRODUCTS, PORTFOLIO_NAME, RANDOM_ID, sinon} from "../../mocks";
import {client} from "../../../utils/elasticsearch";
import {portfolioController} from "../../../controllers";


describe("Portfolio Unit tests", () => {

    let status, json, res, indexStub, searchStub, updateStub, deleteStub;

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = {json, status};
        status.returns(res);
    });

    describe('When create a portfolio', function () {

        describe('if the user is known', function () {
            it('Should create a new portfolio', async done => {
                const req = {
                    body: {
                        user_id: RANDOM_ID,
                        name: PORTFOLIO_NAME,
                        products: LIST_PRODUCTS
                    }
                };

                indexStub = sinon.stub(client, 'index').resolves();

                await portfolioController.create(req, res);

                expect(indexStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].created).to.equal(true);
                done()

            });
        });

    });

    describe("When search all user's portfolios", function () {

        afterEach(() => {
            searchStub.restore();
        });

        describe("If user has at least one portfolio", function () {
            it('Should return a list of portfolios', async done => {
                const req = {};

                const stubResponse = {
                    body: {
                        hits: {
                            hits: [{}, {}]
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);

                await portfolioController.findAll(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(true);
                done();
            });
        });

        describe("If user has no portfolio", function () {

            it('Should return not found', async done => {

                const req = {};

                const stubResponse = {
                    body: {
                        hits: {
                            hits: []
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);

                await portfolioController.findAll(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(404);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(false);
                done();
            });
        });
    });

    describe('When search one portfolio', function () {

        afterEach(() => {
            searchStub.restore();
        });

        describe("If the portfolio exists", function () {
            it('Should return a list of portfolios', async done => {
                const req = {
                    params: {
                        name: PORTFOLIO_NAME
                    }
                };

                const stubResponse = {
                    body: {
                        hits: {
                            hits: [{}]
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);

                await portfolioController.findOne(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(true);
                done();
            });
        });

        describe("If the portfolio doesn't exists", function () {
            it('Should return not found', async done => {
                const req = {
                    params: {
                        name: PORTFOLIO_NAME
                    }
                };

                const stubResponse = {
                    body: {
                        hits: {
                            hits: []
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);

                await portfolioController.findOne(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(404);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(false);
                done();
            });
        });
    });

    describe('When update one portfolio', function () {

        afterEach(() => {
            searchStub.restore();
            updateStub.restore();
        });

        describe("If the portfolio exists", function () {
            it('Should update the portfolio', async done => {
                const req = {
                    params: {
                        name: PORTFOLIO_NAME
                    },
                    body: {
                        email: "tibdev78@gmail.com",
                        newname: "foobar",
                        products: [
                            {isincode: "LU0066902890"},
                            {isincode: "IE00B0H1QB84"},
                            {isincode: "FR0010011171"}
                        ]
                    }
                };

                const stubResponse = {
                    body: {
                        hits: {
                            hits: [{}]
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);
                updateStub = sinon.stub(client, 'update').resolves();

                await portfolioController.update(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(updateStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].updated).to.equal(true);
                done();
            });
        });

        describe("If the portfolio doesn't exists", function () {
            it('Should return not found', async done => {
                const req = {
                    params: {
                        name: PORTFOLIO_NAME
                    },
                    body: {
                        email: "tibdev78@gmail.com",
                        newname: "foobar",
                        products: [
                            {isincode: "LU0066902890"},
                            {isincode: "IE00B0H1QB84"},
                            {isincode: "FR0010011171"}
                        ]
                    }
                };

                const stubResponse = {
                    body: {
                        hits: {
                            hits: []
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);
                updateStub = sinon.stub(client, 'update').resolves();

                await portfolioController.update(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(updateStub.calledOnce).to.be.false;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(404);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].updated).to.equal(false);
                done();
            });
        });
    });

    describe('When delete one portfolio', function () {

        afterEach(() => {
            deleteStub.restore();
        });

        describe("If the portfolio exists", function () {
            it('Should delete the portfolio', async done => {
                const req = {
                    user_id: RANDOM_ID,
                    params: {
                        name: PORTFOLIO_NAME
                    }
                };

                const stubResponse = {
                    body: {
                        deleted: 1
                    }
                };

                deleteStub = sinon.stub(client, 'deleteByQuery').resolves(stubResponse);

                await portfolioController.delete(req, res);

                expect(deleteStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].deleted).to.equal(true);
                done();
            });
        });

        describe("If the portfolio doesn't exists", function () {
            it('Should return not found', async done => {
                const req = {
                    user_id: RANDOM_ID,
                    params: {
                        name: PORTFOLIO_NAME
                    }
                };

                const stubResponse = {
                    body: {
                        deleted: 0
                    }
                };

                deleteStub = sinon.stub(client, 'deleteByQuery').resolves(stubResponse);

                await portfolioController.delete(req, res);

                expect(deleteStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(404);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].deleted).to.equal(false);
                done();
            });
        });
    });

});