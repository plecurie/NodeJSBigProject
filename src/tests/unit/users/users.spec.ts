import {UsersController} from "../../../controllers/users/users";

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require("sinon");

describe("Users Unit tests", () => {

    beforeEach(()=> {

    });

    afterEach(()=> {

    });

    describe('When search user with ID', function () {
        it('Should return user personal informations', async () => {
            expect('').not.to.have.length(5);
        });
    });

    describe("When update user", function () {
        it('Should update user personal informations', async () => {
            expect('').not.to.have.length(5);
        });
    });

    describe('When delete user', function () {
        it('Should delete the user and his personal informations', async () => {
            expect('').not.to.have.length(5);
        });
    });

});
