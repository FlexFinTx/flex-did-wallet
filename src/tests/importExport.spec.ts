import { expect } from "chai";
import "mocha";

import { Wallet, Encodings } from "../Wallet";

describe("import export", () => {
  it("errors when exporting unlocked wallet", () => {
    const wallet = new Wallet();
    try {
      const exported = wallet.export();
    } catch (e) {
      expect(e.message).to.not.be.empty;
    }
  });

  it("can export a locked wallet", () => {
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

    const exported = wallet.export();
    expect(exported).to.equal(
      "wp0itA2qYV5cozP_tY2_Viz3JRYzTavmqRj8cuV9BkTeobgRXizfQ_9uJpuxdfh8cKzh91RpF12Vhn8eMLNfPSIb5uFTP8h1_dYO1AunwNMzAMo-oXtvDeOUyb323EPQ18dUXhPRo6-4j2VrAkyD__tgM1-7Iz4UN5QXA5iYwh71B8PcOmj5Msu_cF1R93_deI0-IzTkGy98Jcp3aL8fJErQGdFU-78hzRshrHzff_h7cTDXEp-UxohZKUEBfzJcwkhOD2rPwIZLzDSfAe3GwdnOQXndyV7QNp-E5bf0b-deNSf69725fWvbiYsJrSwiVRm8_RlTPzVyZ9ILqeS4fJRoqdwnPXbyDCejiRpcPm_BZf9gW9wj5W-Viu8YmN5QcX8dWtJpMXPhnm3GhUfL3MizrNK6mXktLfUoTwdVm5pBPvBZ5-E55qVdEIUTMlkKum2jjwMADe8PWhKEp2XxUjlyDQbcn873cZWvc0rkwO5z-G9TVe2Z_vvFmwBhpqqG"
    );
  });

  it("can import a locked wallet", () => {
    const wallet = new Wallet(
      "wp0itA2qYV5cozP_tY2_Viz3JRYzTavmqRj8cuV9BkTeobgRXizfQ_9uJpuxdfh8cKzh91RpF12Vhn8eMLNfPSIb5uFTP8h1_dYO1AunwNMzAMo-oXtvDeOUyb323EPQ18dUXhPRo6-4j2VrAkyD__tgM1-7Iz4UN5QXA5iYwh71B8PcOmj5Msu_cF1R93_deI0-IzTkGy98Jcp3aL8fJErQGdFU-78hzRshrHzff_h7cTDXEp-UxohZKUEBfzJcwkhOD2rPwIZLzDSfAe3GwdnOQXndyV7QNp-E5bf0b-deNSf69725fWvbiYsJrSwiVRm8_RlTPzVyZ9ILqeS4fJRoqdwnPXbyDCejiRpcPm_BZf9gW9wj5W-Viu8YmN5QcX8dWtJpMXPhnm3GhUfL3MizrNK6mXktLfUoTwdVm5pBPvBZ5-E55qVdEIUTMlkKum2jjwMADe8PWhKEp2XxUjlyDQbcn873cZWvc0rkwO5z-G9TVe2Z_vvFmwBhpqqG"
    );
    wallet.unlock("password");
    expect(wallet.keys).to.deep.equal(expectedWalletWithPrimaryKey);
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
