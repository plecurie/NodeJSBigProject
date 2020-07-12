import {expect, sinon} from "../../mocks";
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

    describe("When search user's portfolios", function () {

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

                await portfolioController.read(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(true);
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
                    body: {
                        email: "tibdev78@gmail.com",
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
                    body: {
                        email: "tibdev78@gmail.com",
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

});