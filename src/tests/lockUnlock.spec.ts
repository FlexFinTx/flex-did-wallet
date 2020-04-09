import { expect } from "chai";
import "mocha";

import { Wallet, Encodings } from "../Wallet";

describe("lock unlock", () => {
  it("throws when locking an empty wallet", () => {
    const wallet = new Wallet();
    try {
      wallet.lock("password");
    } catch (e) {
      expect(e.message).to.not.be.empty;
    }
  });

  it("can lock and unlock", () => {
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

    wallet.lock("password");
    expect(wallet.ciphered).to.not.be.undefined;
    expect(wallet.keys).to.be.undefined;
    wallet.unlock("password");
    expect(wallet.ciphered).to.be.undefined;
    expect(wallet.keys).to.not.be.undefined;
  });
});
