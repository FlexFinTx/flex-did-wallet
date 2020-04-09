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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var crypto_ld_1 = require("crypto-ld");
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
        this.keys = {};
        if (typeof data === "string") {
            this.ciphered = data;
            return;
        }
        if (data && data.keys) {
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
        var cipher = crypto_1.default.createCipher("aes256", password);
        var encryptedKeys = cipher.update(plaintextKeys, "utf8", "hex");
        encryptedKeys += cipher.final("hex");
        this.ciphered = base64url_1.default.encode(Buffer.from(encryptedKeys, "hex"));
        delete this.keys;
    };
    Wallet.prototype.sign = function (kid, data) {
        return __awaiter(this, void 0, void 0, function () {
            var keyToUse, options, toBeSignedHash, keyPair, signer, signature, encodedSignature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.keys) {
                            throw new Error("Cannot sign from a locked wallet. You must unlock it first.");
                        }
                        keyToUse = _.find(this.keys, ["kid", kid]);
                        if (!keyToUse) {
                            throw new Error("Could not find key with kid " + kid + " in wallet");
                        }
                        options = {
                            privateKeyBase58: keyToUse.privateKey,
                            publicKeyBase58: keyToUse.publicKey,
                        };
                        toBeSignedHash = crypto_1.default
                            .createHash("sha256")
                            .update(Buffer.from(data))
                            .digest();
                        return [4 /*yield*/, crypto_ld_1.Ed25519KeyPair.from(options)];
                    case 1:
                        keyPair = _a.sent();
                        signer = keyPair.signer();
                        return [4 /*yield*/, signer.sign({ data: toBeSignedHash })];
                    case 2:
                        signature = _a.sent();
                        encodedSignature = base64url_1.default.encode(signature);
                        return [2 /*return*/, encodedSignature];
                }
            });
        });
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
        var decipher = crypto_1.default.createDecipher("aes256", password);
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
