import {client} from "../../../utils/elasticsearch";
import {expect, sinon} from "../../mocks";
import {ocrController} from "../../../controllers";
import {OcrService} from "../../../services";

describe("OCR tests", () => {
    let status, json, res, ocrService, searchStub, filterStub;

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = {json, status};
        status.returns(res);
        ocrService = OcrService.getInstance();
    });

    afterEach(() => {
        filterStub.restore();
        searchStub.restore();
    });

    describe("When sending a list of known isincodes", () => {
        it('Should return a list of products', async done => {

            const req = {
                body: {
                    codeArray: [
                        "FRO007085691",
                        "FRO010687053",
                        "LU1582988058"
                    ]
                }
            };

            const stubFilter = ['FRO007085691', 'FRO010687053', 'LU1582988058'];

            const stubResponse = {
                body: {
                    hits: {
                        hits: {}
                    }
                }
            };

            filterStub = sinon.stub(ocrService, 'filterOcr').returns(stubFilter);
            searchStub = sinon.stub(client, 'search').resolves(stubResponse);

            await ocrController.recognize(req, res);

            expect(searchStub.calledOnce).to.be.true;
            expect(filterStub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].recognized).to.equal(true);
            expect(typeof json.args[0][0].data).to.equal("object");
            done();
        });
    });

    describe("When sending an empty isincodes list", () => {
        it('Should return not found', async done => {

            const req = {
                body: {
                    codeArray: []
                }
            };

            const stubResponse = {
                body: {
                    hits: {
                        hits: []
                    }
                }
            };

            filterStub = sinon.stub(ocrService, 'filterOcr').returns(undefined);
            searchStub = sinon.stub(client, 'search').resolves(stubResponse);

            await ocrController.recognize(req, res);

            expect(filterStub.calledOnce).to.be.false;
            expect(searchStub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(404);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].recognized).to.equal(false);
            done();
        });
    });

});