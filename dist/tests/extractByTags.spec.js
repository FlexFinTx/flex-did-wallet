"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var Wallet_1 = require("../Wallet");
describe("extract by tags", function () {
    it("errors when locked", function () {
        var wallet = new Wallet_1.Wallet("wp0itA2qYV5cozP_tY2_Viz3JRYzTavmqRj8cuV9BkTeobgRXizfQ_9uJpuxdfh8cKzh91RpF12Vhn8eMLNfPSIb5uFTP8h1_dYO1AunwNMzAMo-oXtvDeOUyb323EPQ18dUXhPRo6-4j2VrAkyD__tgM1-7Iz4UN5QXA5iYwh71B8PcOmj5Msu_cF1R93_deI0-IzTkGy98Jcp3aL8fJErQGdFU-78hzRshrHzff_h7cTDXEp-UxohZKUEBfzJcwkhOD2rPwIZLzDSfAe3GwdnOQXndyV7QNp-E5bf0b-deNSf69725fWvbiYsJrSwiVRm8_RlTPzVyZ9ILqeS4fJRoqdwnPXbyDCejiRpcPm_BZf9gW9wj5W-Viu8YmN5QcX8dWtJpMXPhnm3GhUfL3MizrNK6mXktLfUoTwdVm5pBPvBZ5-E55qVdEIUTMlkKum2jjwMADe8PWhKEp2XxUjlyDQbcn873cZWvc0rkwO5z-G9TVe2Z_vvFmwBhpqqG");
        try {
            wallet.extractByTags(["primary"]);
        }
        catch (e) {
            chai_1.expect(e.message).to.not.be.empty;
        }
    });
    it("can extract", function () {
        var key1 = {
            type: "assymetric",
            encoding: Wallet_1.Encodings.Base58,
            publicKey: "5zuuY6CYhRbdYUbPdQs3AN8BmAC7nLReK9zZGWxTV79P",
            privateKey: "2ceUJwVTpuAf3aYQjqGkRkSFSAhg9csEeB6CytMYwGMRppNZQhX74kxXTTqSJV7ehMAaAHxkbTSM9v8QdUbF71vD",
            tags: ["Ed25519VerificationKey2018", "primary"],
            notes: "flex-did-wallet test",
        };
        var wallet = new Wallet_1.Wallet({
            keys: [key1],
        });
        var primary = wallet.extractByTags(["primary"]);
        var wallet2 = new Wallet_1.Wallet({
            keys: primary,
        });
        chai_1.expect(wallet2.keys).to.deep.equal(wallet.keys);
    });
});
