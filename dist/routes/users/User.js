"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controllers_1 = require("../../controllers");
exports.router = express.Router({
    strict: true
});
exports.router.post('/', function (req, res) {
    controllers_1.userController.create(req, res);
});
exports.router.get('/', function (req, res) {
    controllers_1.userController.read(req, res);
});
exports.router.put('/', function (req, res) {
    controllers_1.userController.update(req, res);
});
exports.router.delete('/', function (req, res) {
    controllers_1.userController.delete(req, res);
});
exports.router.get('/test', function (req, res) {
    controllers_1.userController.test(req, res);
});
//# sourceMappingURL=User.js.map