import {expect, PRODUCT_ISINCODE, PRODUCT_NAME, sinon} from "../../mocks";
import {client} from "../../../utils/elasticsearch";
import {ocrController, productsController} from "../../../controllers";
import {BulkProductsService} from "../../../services";

describe("Products Unit tests", () => {

    let status, json, res, deleteStub, bulkStub, searchStub, bulkProductsService;

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = {json, status};
        status.returns(res);
        bulkProductsService = BulkProductsService.getInstance();
    });

    afterEach(() => {

    });

    describe('When update products & contracts', function () {
        it('Should update database', async done => {

            const req = {
                body: {
                    products_filename: "InputProducts.xlsx",
                    contracts_filename: "InputContracts.xlsx",
                    buylist_filename: "InputBuyList.xlsx"
                }
            };

            const stubResponse = {
                body: {
                    deleted: 1
                }
            };

            deleteStub = sinon.stub(client, 'deleteByQuery').resolves(stubResponse);
            bulkStub = sinon.stub(bulkProductsService, 'importProducts').resolves(stubResponse);

            await productsController.update_db(req, res);

            expect(deleteStub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].updated).to.equal(true);
            done();

        });
    });

    describe("When search for suggestions of products", function () {

        afterEach(() => {
            searchStub.restore();
        });

        describe("If suggestion match with input", function () {
            it('Should suggest products', async done => {
                const req = {
                    params: {
                        input: "LU"
                    }
                };

                const stubResponse = {
                    body: {
                        suggest: {
                            products: [{
                                options: [
                                    {_source: {isincode: PRODUCT_ISINCODE}},
                                    {_source: {isincode: PRODUCT_ISINCODE}}
                                ]
                            }]
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);

                await productsController.suggest(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                done();
            });
        });

        describe("If suggestion doesn't match with input", function () {
            it('Should suggest products', async done => {
                const req = {
                    params: {
                        input: "LU"
                    }
                };

                const stubResponse = {
                    body: {}
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);

                await productsController.suggest(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                done();
            });
        })

    });

    describe('When search one product', function () {

        afterEach(() => {
            searchStub.restore();
        });

        describe('if the product exists', function () {
            it('Should return one product', async done => {
                const req = {
                    params: {
                        isincode: PRODUCT_ISINCODE
                    }
                };

                const stubResponse = {
                    body: {
                        hits: {
                            hits: [
                                {
                                    _source: {
                                        type: 'contract',
                                        euro_fees: "",
                                        uc_fees: "",
                                        contract_name: ""
                                    }
                                },
                                {_source: {type: 'product'}}
                            ]
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);

                await productsController.findOne(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(true);
                done();
            });
        });

        describe("if the product doesn't exists", function () {
            it('Should return not found', async done => {
                const req = {
                    params: {
                        isincode: PRODUCT_ISINCODE
                    }
                };

                const stubResponse = {
                    body: {
                        hits: {
                            hits: {}
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);

                await productsController.findOne(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(404);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(false);
                done();
            });
        });

    });

    describe('When search a list of products', function () {

        afterEach(() => {
            searchStub.restore();
        });

        it('Should return a list of products', async done => {
            const req = {
                body: {
                    isincodes: [
                        "FRO007085691",
                        "FRO010687053",
                        "LU1582988058"
                    ]
                }
            };


            const stubResponse = {
                body: {
                    hits: {
                        hits: [
                            {
                                _source: {
                                    type: 'contract',
                                    euro_fees: "",
                                    uc_fees: "",
                                    contract_name: ""
                                }
                            },
                            {_source: {type: 'product'}}
                        ]
                    }
                }
            };

            searchStub = sinon.stub(client, 'search').resolves(stubResponse);

            await productsController.findProductsList(req, res);

            expect(searchStub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].found).to.equal(true);
            expect(typeof json.args[0][0].data).to.equal("object");
            done();
        })

    });

    describe('When search all products', function () {

        afterEach(() => {
            searchStub.restore();
        });

        describe('If there are products found', function () {
            it('Should return a list of products', async done => {
                const req = {
                    body: {
                        product_name: PRODUCT_NAME
                    }
                };

                const stubResponse = {
                    body: {
                        hits: {
                            hits: [{}, {}]
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);

                await productsController.findAll(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(true);
                done();
            });
        });

        describe('If there is no product found', function () {
            it('Should return not found', async done => {

                const req = {
                    body: {
                        product_name: PRODUCT_NAME
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

                await productsController.findAll(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(404);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(false);
                done();
            });
        })

    });

    describe('When search products with filter', function () {

        afterEach(() => {
            searchStub.restore();
        });

        describe('If there are products found', function () {
            it('Should return a list of products', async done => {
                const req = {
                    body: {
                        product_name: PRODUCT_NAME,
                        matches: {
                            match: {category: "Energy Sector Equity"}
                        }
                    }
                };

                const stubResponse = {
                    body: {
                        hits: {
                            hits: [{}, {}]
                        }
                    }
                };

                searchStub = sinon.stub(client, 'search').resolves(stubResponse);

                await productsController.findAll(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(200);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(true);
                done();
            });
        });

        describe('If there is no product found', function () {
            it('Should return not found', async done => {
                const req = {
                    body: {
                        product_name: PRODUCT_NAME,
                        matches: {
                            match: {category: "Energy Sector Equity"}
                        }
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

                await productsController.findAll(req, res);

                expect(searchStub.calledOnce).to.be.true;
                expect(status.calledOnce).to.be.true;
                expect(status.args[0][0]).to.equal(404);
                expect(json.calledOnce).to.be.true;
                expect(json.args[0][0].found).to.equal(false);
                done();
            });
        });
    });



});