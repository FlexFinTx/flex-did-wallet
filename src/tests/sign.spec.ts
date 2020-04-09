import { expect } from "chai";
import "mocha";

import { Wallet, Encodings } from "../Wallet";

describe("sign", () => {
  it("errors signing with empty wallet", async () => {
    const wallet = new Wallet();
    try {
      const signed = await wallet.sign("kid", "abc");
    } catch (e) {
      expect(e.message).to.not.be.empty;
    }
  });

  it("errors signing with locked wallet", async () => {
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

    try {
      const signed = await wallet.sign("kid", "abc");
    } catch (e) {
      expect(e.message).to.not.be.empty;
    }
  });

  it("can sign with unlocked wallet", async () => {
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

    const kid = wallet.extractByTags(["primary"])[0].kid;
    const signed = await wallet.sign(kid, "abc");

    expect(signed).to.equal(
      "jOCs2QoW0rGh7V7Z1IWpzLOEQh07qEj5mcAmAGoF8yS9fzExSsGdIQ_NX4MEx4o9C957psNV_eRmyffnowIKDA"
    );
  });
});
