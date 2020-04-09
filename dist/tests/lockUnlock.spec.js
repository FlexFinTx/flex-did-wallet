"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var Wallet_1 = require("../Wallet");
describe("lock unlock", function () {
    it("throws when locking an empty wallet", function () {
        var wallet = new Wallet_1.Wallet();
        try {
            wallet.lock("password");
        }
        catch (e) {
            chai_1.expect(e.message).to.not.be.empty;
        }
    });
    it("can lock and unlock", function () {
        var wallet = new Wallet_1.Wallet({
            keys: [
                {
                    type: "assymetric",
                    encoding: Wallet_1.Encodings.Base58,
                    publicKey: "5zuuY6CYhRbdYUbPdQs3AN8BmAC7nLReK9zZGWxTV79P",
                    privateKey: "2ceUJwVTpuAf3aYQjqGkRkSFSAhg9csEeB6CytMYwGMRppNZQhX74kxXTTqSJV7ehMAaAHxkbTSM9v8QdUbF71vD",
                    tags: ["Ed25519VerificationKey2018", "primary"],
                    notes: "flex-did-wallet test",
                },
            ],
        });
        wallet.lock("password");
        chai_1.expect(wallet.ciphered).to.not.be.undefined;
        chai_1.expect(wallet.keys).to.be.undefined;
        wallet.unlock("password");
        chai_1.expect(wallet.ciphered).to.be.undefined;
        chai_1.expect(wallet.keys).to.not.be.undefined;
    });
});
