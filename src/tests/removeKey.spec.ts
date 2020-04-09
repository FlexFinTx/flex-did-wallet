import { expect } from "chai";
import "mocha";

import { Wallet, Encodings } from "../Wallet";

describe("remove key from wallet", () => {
  it("can remove key from existing wallet", () => {
    const wallet = new Wallet({
      keys: [
        {
          type: "assymetric",
          encoding: Encodings.Base58,
          publicKey: "5zuuY6CYhRbdYUbPdQs3AN8BmAC7nLReK9zZGWxTV79P",
          privateKey:
            "2ceUJwVTpuAf3aYQjqGkRkSFSAhg9csEeB6CytMYwGMRppNZQhX74kxXTTqSJV7ehMAaAHxkbTSM9v8QdUbF71vD",
          tags: ["Ed25519VerificationKey2018", "primary"],
          notes: "flex-did-wallet test",
        },
      ],
    });
    expect(wallet.keys).to.deep.equal(expectedWalletWithPrimaryKey);

    const kid = wallet.extractByTags(["primary"])[0].kid;
    expect(kid).to.not.be.empty;

    wallet.removeKey(kid);
    expect(wallet.keys).to.deep.equal({});
  });
});

const expectedWalletWithPrimaryKey = {
  "ViKR4ko5TmejWF9k94PZP-HxJlDC5NK-r_yL_gIC7pI": {
    type: "assymetric",
    encoding: "base58",
    publicKey: "5zuuY6CYhRbdYUbPdQs3AN8BmAC7nLReK9zZGWxTV79P",
    privateKey:
      "2ceUJwVTpuAf3aYQjqGkRkSFSAhg9csEeB6CytMYwGMRppNZQhX74kxXTTqSJV7ehMAaAHxkbTSM9v8QdUbF71vD",
    tags: ["Ed25519VerificationKey2018", "primary"],
    notes: "flex-did-wallet test",
    kid: "ViKR4ko5TmejWF9k94PZP-HxJlDC5NK-r_yL_gIC7pI",
  },
};
