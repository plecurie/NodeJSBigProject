export const USER_EMAIL = "random@test.com";
export const USER_PASSWORD = "abc123";
export const USER_USERNAME = "random";
export const USER_FIRSTNAME = "random";
export const USER_LASTNAME = "random";
export const USER_BIRTHDATE = "1970/01/01";

export const baseApi = "http://localhost:3100";

const nock = require('nock');
const supertest = require('supertest');

export const request = supertest(baseApi);
export const mockApi = nock(baseApi);