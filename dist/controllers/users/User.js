"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CrudController_1 = require("../CrudController");
var elasticsearch_1 = require("../../elasticsearch");
var UserController = /** @class */ (function (_super) {
    __extends(UserController, _super);
    function UserController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserController.prototype.create = function (req, res) {
        res.json({ message: 'POST /users request received' });
    };
    UserController.prototype.delete = function (req, res) {
        res.json({ message: 'DELETE /users request received' });
    };
    UserController.prototype.read = function (req, res) {
        res.json({ message: 'GET /users request received' });
    };
    UserController.prototype.test = function (req, res) {
        res.json({ message: 'GET /users/test received' });
        var params = {
            index: 'test',
            body: {
                query: {
                    match: {
                        quote: 'test'
                    }
                }
            }
        };
        return elasticsearch_1.ELASTIC_CLIENT
            .search(params)
            .then(function (result) {
            console.log(result.body.hits.hits);
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    UserController.prototype.update = function (req, res) {
        res.json({ message: 'UPDATE /users request received' });
    };
    return UserController;
}(CrudController_1.CrudController));
exports.UserController = UserController;
//# sourceMappingURL=User.js.map