import {ProductsController} from "../../../controllers/products/products";

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require("sinon");

describe("Products Unit tests", () => {

    beforeEach(()=> {

    });

    afterEach(()=> {

    });

    describe('When update products & contracts', function () {
        it('Should update database', async () => {
            expect('').not.to.have.length(5);
        });
    });

    describe("When search some products", function () {
        it('Should suggest products', async () => {
            expect('').not.to.have.length(5);
        });
    });

    describe('When search one product', function () {
        it('Should return one product', async () => {
            expect('').not.to.have.length(5);
        });
    });

    describe('When search all products', function () {
        it('Should return a list of products', async () => {
            expect('').not.to.have.length(5);
        });
    });

    describe('When search products with criteria', function () {
        it('Should return a list of products', async () => {
            expect('').not.toHaveLength(5);
        });
    });

    describe('When search personalized products', function () {
        it('Should return a list of products', async () => {
            expect('').not.toHaveLength(5);
        });
    });

});