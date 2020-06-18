import {
    PRODUCT_ISINCODE,
    mockApi, request
} from "../mockConfig";

const chai = require('chai');
const expect = chai.expect;

describe("Products E2E tests", () => {

    describe("Delete & Bulk", () => {

        const endpoint = "/products/_updatedb/";

        it('Should update all products', async (done) => {

            mockApi
                .get(endpoint)
                .reply(200, {
                    status: 200,
                    updated: true
                });

            request
                .get(endpoint)
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.updated).to.equal(true);
                    done();
                });
        });
    });

    describe("Find All", () => {

        const endpoint = "/products/";

        it('Should find all products', async (done) => {

            mockApi
                .get(endpoint)
                .reply(200, {
                    status: 200,
                    found: true,
                    products: [{
                        ongoingcharge: 1,
                        criteria: {},
                        productname: "test",
                        firmname: "test",
                        category: "test",
                        type: "product",
                        isincode: "test"
                    },
                    {
                        ongoingcharge: 1,
                        criteria: {},
                        productname: "test",
                        firmname: "test",
                        category: "test",
                        type: "product",
                        isincode: "test"
                    }]
                });

            request
                .get(endpoint)
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.found).to.equal(true);
                    expect(res.body.products.length).not.to.equal(0);
                    done();
                });
        });

    });

    describe("Find One", () => {

        const endpoint = "/products/"+ PRODUCT_ISINCODE;

        it('Should find all products', async (done) => {

            mockApi
                .get(endpoint)
                .reply(200, {
                    status: 200,
                    found: true,
                    product: {
                        ongoingcharge: 1,
                        criteria: {},
                        productname: "test",
                        firmname: "test",
                        category: "test",
                        type: "product",
                        isincode: PRODUCT_ISINCODE
                    }
                });

            request
                .get(endpoint)
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.found).to.equal(true);
                    expect(res.body.product.length).not.to.equal(0);
                    done();
                });
        });

    });

    describe("Search", () => {

        const endpoint = "/products/search/";

        it('Should search products with filters', async (done) => {

            mockApi
                .post(endpoint, {
                    "filter1": [
                        {
                            "terms": {
                                "category": [
                                    "cat1",
                                    "cat2",
                                    "cat3"
                                ]
                            }
                        }
                    ],
                    "filter2": [
                        {
                            "terms": {
                                "firmname": [
                                    "sample_name"
                                ]
                            }
                        }
                    ]
                })
                .reply(200, {
                    status: 200,
                    found: true,
                    products: [{
                        ongoingcharge: 1,
                        criteria: {},
                        productname: "test",
                        firmname: "test",
                        category: "test",
                        type: "product",
                        isincode: "test"
                    },
                    {
                        ongoingcharge: 1,
                        criteria: {},
                        productname: "test",
                        firmname: "test",
                        category: "test",
                        type: "product",
                        isincode: "test"
                    }]
                });

            request
                .post(endpoint)
                .send({
                    "filter1": [
                        {
                            "terms": {
                                "category": [
                                    "cat1",
                                    "cat2",
                                    "cat3"
                                ]
                            }
                        }
                    ],
                    "filter2": [
                        {
                            "terms": {
                                "firmname": [
                                    "sample_name"
                                ]
                            }
                        }
                    ]
                })
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    expect(res.body.status).to.equal(200);
                    expect(res.body.found).to.equal(true);
                    expect(res.body.products.length).not.to.equal(0);
                    done();
                });
        });

    });

});