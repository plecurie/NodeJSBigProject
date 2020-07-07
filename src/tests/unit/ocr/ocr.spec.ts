import {OcrController} from '../../../controllers/ocr/ocr'
import {OcrService} from "../../../services";
import {client} from "../../../utils/elasticsearch";
import {sinon, expect} from "../../mocks";

describe("OCR tests", () => {
    let status, json, res, ocrController, ocrService, searchStub;

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = {json, status};
        status.returns(res);
        ocrService = OcrService.getInstance();
    });

    afterEach(() => {
        searchStub.restore();
    });

    describe("When sending a list of known isincodes", () => {
        it('Should match a list of products', async done => {

            const req = {
                body: {
                    codeArray: [
                        "FRO007085691",
                        "FRO010687053",
                        "LU1582988058"
                    ]
                }
            };

            const stubResponse = {
                body: {
                    hits: {
                        hits: {}
                    }
                }
            };

            searchStub = sinon.stub(client, 'search').resolves(stubResponse);

            ocrController = new OcrController();
            await ocrController.recognize(req, res);

            expect(searchStub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].recognized).to.equal(true);
            expect(typeof json.args[0][0].data).to.equal("object");
            done();
        });
    });

    describe("When sending unrecognized products", () => {
        it('Should return unrecognized', async done => {

            const req = {
                body: {
                    codeArray: []
                }
            };

            const stubResponse = {
                body: {
                    hits: {
                        hits: {}
                    }
                }
            };

            searchStub = sinon.stub(client, 'search').returns(stubResponse);

            ocrController = new OcrController();
            await ocrController.recognize(req, res);

            expect(searchStub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0].recognized).to.equal(false);
            done();
        });
    });

});