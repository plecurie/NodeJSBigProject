import {sinon, expect} from "../../mocks";

describe("Profile Unit tests", () => {

    let status, json, res;

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = {json, status};
        status.returns(res);
    });

    afterEach(() => {

    });

    describe('', function () {
        it('Should do nothing', async () => {
            expect('').not.to.have.length(5);
        });
    });

});