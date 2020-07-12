export const RANDOM_ID = "qFiDHnMBOc_leQ3HKzuh";
export const USER_EMAIL = "random@test.com";
export const USER_PASSWORD = "abc123";
export const USER_HASH_PASSWORD = "$2b$15$.mG/R/IjVAkxYKMLFQkzIOoEUVKrv1l0Osh6O1K9zA./2xElvzbbe";
export const USER_USERNAME = "random";
export const USER_FIRSTNAME = "random";
export const USER_LASTNAME = "random";
export const USER_BIRTHDATE = "1970/01/01";
export const USER_TOKEN = "random";
export const PRODUCT_ISINCODE = "LU0252633754";
export const PRODUCT_NAME = "Lyxor DAX (DR) ETF Acc";
export const PORTFOLIO_NAME = "random";
export const LIST_PRODUCTS = [
    {"isincode": "FR0010564245"},
    {"isincode": "LU0272828905"},
    {"isincode": "BE0947764743"}
];

const baseApi = "http://localhost:3100";

const nock = require('nock');
const supertest = require('supertest');
export const mockRequest = supertest(baseApi);
export const mockApi = nock(baseApi);

export const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
export const expect = chai.expect;
export const sinon = require("sinon");
