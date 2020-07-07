import {sinon, expect} from "../../mocks";

describe("Portfolio E2E tests", () => {

    describe("Create", () => {

        const endpoint = "/users/portfolio/";

        it('Should do nothing', async () => {
            expect('').not.to.have.length(5);
        });

    });
});