"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var elasticsearch = require("@elastic/elasticsearch");
var constants_1 = require("./utils/constants");
exports.ELASTIC_CLIENT = new elasticsearch.Client({
    node: [constants_1.HOST + ":" + constants_1.ES_PORT],
    maxRetries: 5,
    requestTimeout: 30000,
    sniffOnStart: true
});
//# sourceMappingURL=elasticsearch.js.map