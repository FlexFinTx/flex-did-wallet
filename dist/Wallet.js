"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var base64url_1 = __importDefault(require("base64url"));
var _ = __importStar(require("lodash"));
var Encodings;
(function (Encodings) {
    Encodings["JWK"] = "jwk";
    Encodings["Hex"] = "hex";
    Encodings["PGP"] = "application/pgp-keys";
    Encodings["PEMFile"] = "application/x-pem-file";
    Encodings["Base58"] = "base58";
})(Encodings = exports.Encodings || (exports.Encodings = {}));
var PublicKeyEncodings;
(function (PublicKeyEncodings) {
    PublicKeyEncodings["PEM"] = "publicKeyPem";
    PublicKeyEncodings["JWK"] = "publicKeyJwk";
    PublicKeyEncodings["Hex"] = "publicKeyHex";
    PublicKeyEncodings["Base64"] = "publicKeyBase64";
    PublicKeyEncodings["Base58"] = "publicKeyBase58";
    PublicKeyEncodings["Multibase"] = "publicKeyMultibase";
})(PublicKeyEncodings = exports.PublicKeyEncodings || (exports.PublicKeyEncodings = {}));
var Wallet = /** @class */ (function () {
    function Wallet(data) {
        var _this = this;
        if (typeof data === "string") {
            this.ciphered = data;
            return;
        }
        if (data.keys) {
            var mappedKeys = data.keys.map(function (k) {
                if (k.type != "assymetric") {
                    throw new Error("Unsupported key type");
                }
                return __assign(__assign({}, k), { kid: _this.keyToKid(k.publicKey) });
            });
            this.keys = _.keyBy(mappedKeys, "kid");
        }
    }
    Wallet.prototype.lock = function (password) {
        if (_.size(this.keys) == 0) {
            throw new Error("Cannot lock an empty wallet");
        }
        var plaintextKeys = JSON.stringify(this.keys);
        var cipher = crypto_1.default.createCipheriv("aes-256-gcm", password, null);
        var encryptedKeys = cipher.update(plaintextKeys, "utf8", "hex");
        encryptedKeys += cipher.final("hex");
        this.ciphered = base64url_1.default.encode(Buffer.from(encryptedKeys, "hex"));
        delete this.keys;
    };
    Wallet.prototype.addKey = function (key) {
        var _a;
        if (!this.keys) {
            throw new Error("Cannot add key to a locked wallet. You must unlock it first.");
        }
        if (key.type != "assymetric") {
            throw new Error("Unsupported key type");
        }
        if (key.encoding != Encodings.Base58) {
            throw new Error("Unsupported encoding");
        }
        if (key.didPublicKeyEncoding &&
            key.didPublicKeyEncoding != PublicKeyEncodings.Base58) {
            throw new Error("Unsupported public key encoding");
        }
        var update = __assign(__assign({}, key), { kid: this.keyToKid(key.publicKey) });
        this.keys = __assign(__assign({}, this.keys), (_a = {}, _a[update.kid] = update, _a));
        return update.kid;
    };
    Wallet.prototype.removeKey = function (kid) {
        if (!this.keys) {
            throw new Error("Cannot remove key from a locked wallet. You must unlock it first.");
        }
        var keyToRemove = _.find(this.keys, ["kid", kid]);
        if (!keyToRemove) {
            throw new Error("Could not find key with kid " + kid + " in wallet");
        }
        delete this.keys[kid];
    };
    Wallet.prototype.unlock = function (password) {
        if (!this.ciphered) {
            throw new Error("Cannot unlock an unlocked wallet");
        }
        var decipher = crypto_1.default.createDecipheriv("aes-256-gcm", password, null);
        var cipherText = base64url_1.default.toBuffer(this.ciphered).toString("hex");
        var decryptedKeys = decipher.update(cipherText, "hex", "utf8");
        decryptedKeys += decipher.final();
        this.keys = JSON.parse(decryptedKeys);
        delete this.ciphered;
    };
    Wallet.prototype.extractByTags = function (tags) {
        if (!this.keys) {
            throw new Error("Cannot extract by tags from a locked wallet. You must unlock first.");
        }
        var keys = _.pickBy(this.keys, function (k) {
            return _.intersection(k.tags, tags).length;
        });
        return _.values(keys);
    };
    Wallet.prototype.export = function () {
        if (this.keys) {
            throw new Error("Cannot export unlocked wallet. You must lock it first.");
        }
        return this.ciphered;
    };
    Wallet.prototype.keyToKid = function (publicKey) {
        try {
            var jwk = JSON.parse(publicKey);
            if (jwk.kid) {
                return jwk.kid;
            }
        }
        catch (e) {
            // Do nothing
        }
        return base64url_1.default.encode(crypto_1.default.createHash("sha256").update(Buffer.from(publicKey)).digest());
    };
    return Wallet;
}());
exports.Wallet = Wallet;
