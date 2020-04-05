"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = __importStar(require("uuid"));
var CloudantDocument = /** @class */ (function () {
    function CloudantDocument() {
        this.clear();
    }
    CloudantDocument.prototype.clear = function () {
        this._id = undefined;
        this._rev = undefined;
        this._deleted = undefined;
        this._attachments = undefined;
    };
    CloudantDocument.prototype.generateId = function () {
        this.clear();
        this._id = uuid.v4();
    };
    CloudantDocument.prototype.processAPIResponse = function (response) {
        if (response.ok === true) {
            this._id = response.id;
            this._rev = response.rev;
        }
    };
    return CloudantDocument;
}());
exports.CloudantDocument = CloudantDocument;
