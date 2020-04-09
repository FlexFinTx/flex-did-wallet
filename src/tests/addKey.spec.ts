import { expect } from "chai";
import "mocha";

import { Wallet, Encodings } from "../Wallet";

describe("add key to wallet", () => {
  it("can add key to new wallet", () => {
    const wallet = new Wallet();
    expect(wallet.keys).to.deep.equal({});

    wallet.addKey({
      type: "assymetric",
      encoding: Encodings.Base58,
      publicKey: "5zuuY6CYhRbdYUbPdQs3AN8BmAC7nLReK9zZGWxTV79P",
      privateKey:
        "2ceUJwVTpuAf3aYQjqGkRkSFSAhg9csEeB6CytMYwGMRppNZQhX74kxXTTqSJV7ehMAaAHxkbTSM9v8QdUbF71vD",
      tags: ["Ed25519VerificationKey2018", "primary"],
      notes: "flex-did-wallet test",
    });

    expect(wallet.keys).to.deep.equal(expectedWalletWithPrimaryKey);
  });

  it("can add key to existing wallet", () => {
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

    wallet.addKey({
      type: "assymetric",
      encoding: Encodings.Base58,
      publicKey: "4rQkhvsgd1xkaGTo148L3P2r8KDR25qEF1Vu8Dskms8A",
      privateKey:
        "4h32UDmvYZsmhao8Afgg1ZVC2ZCGWxcBFt7z5PFtPeW5X3VT4iT3qUMaCQEK2wsC2QoaBoEX2h7wfmN3e72i2tii",
      tags: ["Ed25519VerificationKey2018", "secondary"],
      notes: "flex-did-wallet test",
    });

    expect(wallet.keys).to.deep.equal(expectedWalletWithTwoKeys);
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

const expectedWalletWithTwoKeys = {
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
  "iQuBppJZFUjnfnJPCdYFx-KliCMyZyoBPIfOADFn-Jg": {
    type: "assymetric",
    encoding: "base58",
    publicKey: "4rQkhvsgd1xkaGTo148L3P2r8KDR25qEF1Vu8Dskms8A",
    privateKey:
      "4h32UDmvYZsmhao8Afgg1ZVC2ZCGWxcBFt7z5PFtPeW5X3VT4iT3qUMaCQEK2wsC2QoaBoEX2h7wfmN3e72i2tii",
    tags: ["Ed25519VerificationKey2018", "secondary"],
    notes: "flex-did-wallet test",
    kid: "iQuBppJZFUjnfnJPCdYFx-KliCMyZyoBPIfOADFn-Jg",
  },
};
