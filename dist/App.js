"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var routes_1 = require("./routes");
var constants_1 = require("./utils/constants");
var elasticsearch_1 = require("./elasticsearch");
var Application = /** @class */ (function () {
    function Application() {
        this.app = express();
        this.routes();
    }
    Application.prototype.routes = function () {
        this.app.use(express.json());
        this.app.use('/users', routes_1.userRouter);
    };
    Application.prototype.start = function () {
        this.app.listen(constants_1.PORT, function (err) {
            if (err) {
                return console.log(err);
            }
            return console.log('>>>> Node server is listening on', constants_1.HOST + ":" + constants_1.PORT);
        });
        elasticsearch_1.ELASTIC_CLIENT.ping((function (err, result) {
            if (err) {
                console.error(err);
            }
            else {
                console.log('>>>> ElasticSearch is listening on', constants_1.HOST + ":" + constants_1.ES_PORT);
            }
        }));
    };
    return Application;
}());
exports.default = Application;
//# sourceMappingURL=App.js.map