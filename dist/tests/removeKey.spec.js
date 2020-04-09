"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var Wallet_1 = require("../Wallet");
describe("remove key from wallet", function () {
    it("can remove key from existing wallet", function () {
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
        chai_1.expect(wallet.keys).to.deep.equal(expectedWalletWithPrimaryKey);
        var kid = wallet.extractByTags(["primary"])[0].kid;
        chai_1.expect(kid).to.not.be.empty;
        wallet.removeKey(kid);
        chai_1.expect(wallet.keys).to.deep.equal({});
    });
});
var expectedWalletWithPrimaryKey = {
    "ViKR4ko5TmejWF9k94PZP-HxJlDC5NK-r_yL_gIC7pI": {
        type: "assymetric",
        encoding: "base58",
        publicKey: "5zuuY6CYhRbdYUbPdQs3AN8BmAC7nLReK9zZGWxTV79P",
        privateKey: "2ceUJwVTpuAf3aYQjqGkRkSFSAhg9csEeB6CytMYwGMRppNZQhX74kxXTTqSJV7ehMAaAHxkbTSM9v8QdUbF71vD",
        tags: ["Ed25519VerificationKey2018", "primary"],
        notes: "flex-did-wallet test",
        kid: "ViKR4ko5TmejWF9k94PZP-HxJlDC5NK-r_yL_gIC7pI",
    },
};
