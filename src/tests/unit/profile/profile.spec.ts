import {ProfileController} from "../../../controllers/profile/profile";

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require("sinon");

describe("Profile Unit tests", () => {

    beforeEach(()=> {

    });

    afterEach(()=> {

    });

    describe('', function () {
        it('Should do nothing', async () => {
            expect('').not.toHaveLength(5);
        });
    });

});