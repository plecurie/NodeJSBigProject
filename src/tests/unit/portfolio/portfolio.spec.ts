import {PortfolioController} from "../../../controllers/portfolio/portfolio";

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require("sinon");

describe("Portfolio Unit tests", () => {

    beforeEach(()=> {

    });

    afterEach(()=> {

    });

    describe('When create a portfolio', function () {
        it('Should do nothing', async () => {
            expect('').not.toHaveLength(5);
        });
    });

    describe("When search all user's portfolios", function () {
        it('Should do nothing', async () => {
            expect('').not.toHaveLength(5);
        });
    });

    describe('When search one portfolio', function () {
        it('Should do nothing', async () => {
            expect('').not.toHaveLength(5);
        });
    });

    describe('When update one portfolio', function () {
        it('Should do nothing', async () => {
            expect('').not.toHaveLength(5);
        });
    });

    describe('When delete one portfolio', function () {
        it('Should do nothing', async () => {
            expect('').not.toHaveLength(5);
        });
    });

});