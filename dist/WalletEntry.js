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
var CloudantDocument_1 = require("./CloudantDocument");
var WalletEntry = /** @class */ (function (_super) {
    __extends(WalletEntry, _super);
    function WalletEntry(hashedPassword, cipheredKeys) {
        var _this = _super.call(this) || this;
        _this.hashedPassword = hashedPassword;
        _this.cipheredKeys = cipheredKeys;
        return _this;
    }
    WalletEntry.fromObject = function (parsed) {
        var obj = new WalletEntry(parsed.hashedPassword, parsed.cipheredKeys);
        obj._id = parsed._id;
        obj._rev = parsed._rev;
        return obj;
    };
    WalletEntry.fromJSON = function (json) {
        var parsed = JSON.parse(json);
        return WalletEntry.fromObject(parsed);
    };
    return WalletEntry;
}(CloudantDocument_1.CloudantDocument));
exports.WalletEntry = WalletEntry;
