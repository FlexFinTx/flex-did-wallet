import crypto from "crypto";
import base64url from "base64url";
import * as _ from "lodash";
import { Ed25519KeyPair } from "crypto-ld";

export enum Encodings {
  JWK = "jwk",
  Hex = "hex",
  PGP = "application/pgp-keys",
  PEMFile = "application/x-pem-file",
  Base58 = "base58",
}

export enum PublicKeyEncodings {
  PEM = "publicKeyPem",
  JWK = "publicKeyJwk",
  Hex = "publicKeyHex",
  Base64 = "publicKeyBase64",
  Base58 = "publicKeyBase58",
  Multibase = "publicKeyMultibase",
}

export interface AssymetricWalletKey {
  kid?: string;
  type: string;
  encoding: Encodings;
  didPublicKeyEncoding?: PublicKeyEncodings;
  publicKey: string;
  privateKey: string;
  tags: string[];
  notes: string;
}

export class Wallet {
  ciphered: string;
  keys: _.Dictionary<AssymetricWalletKey> = {};

  constructor(data?: string | { keys: AssymetricWalletKey[] }) {
    if (typeof data === "string") {
      this.ciphered = data;
      return;
    }

    if (data && data.keys) {
      const mappedKeys = data.keys.map((k) => {
        if (k.type != "assymetric") {
          throw new Error("Unsupported key type");
        }

        return {
          ...k,
          kid: this.keyToKid(k.publicKey),
        };
      });

      this.keys = _.keyBy(mappedKeys, "kid");
    }
  }

  lock(password: string) {
    if (_.size(this.keys) == 0) {
      throw new Error("Cannot lock an empty wallet");
    }

    const plaintextKeys = JSON.stringify(this.keys);
    const cipher = crypto.createCipher("aes256", password);
    let encryptedKeys = cipher.update(plaintextKeys, "utf8", "hex");
    encryptedKeys += cipher.final("hex");
    this.ciphered = base64url.encode(Buffer.from(encryptedKeys, "hex"));
    delete this.keys;
  }

  async sign(kid: string, data: any): Promise<string> {
    if (!this.keys) {
      throw new Error(
        "Cannot sign from a locked wallet. You must unlock it first."
      );
    }

    const keyToUse = _.find(this.keys, ["kid", kid]);
    if (!keyToUse) {
      throw new Error(`Could not find key with kid ${kid} in wallet`);
    }

    const options = {
      privateKeyBase58: keyToUse.privateKey,
      publicKeyBase58: keyToUse.publicKey,
    };

    const toBeSignedHash = crypto
      .createHash("sha256")
      .update(Buffer.from(data))
      .digest();

    const keyPair = await Ed25519KeyPair.from(options);
    const signer = keyPair.signer();
    const signature = await signer.sign({ data: toBeSignedHash });
    const encodedSignature = base64url.encode(signature);
    return encodedSignature;
  }

  addKey(key: AssymetricWalletKey) {
    if (!this.keys) {
      throw new Error(
        "Cannot add key to a locked wallet. You must unlock it first."
      );
    }

    if (key.type != "assymetric") {
      throw new Error("Unsupported key type");
    }

    if (key.encoding != Encodings.Base58) {
      throw new Error("Unsupported encoding");
    }

    if (
      key.didPublicKeyEncoding &&
      key.didPublicKeyEncoding != PublicKeyEncodings.Base58
    ) {
      throw new Error("Unsupported public key encoding");
    }

    const update = {
      ...key,
      kid: this.keyToKid(key.publicKey),
    };

    this.keys = {
      ...this.keys,
      [update.kid]: update,
    };

    return update.kid;
  }

  removeKey(kid: string) {
    if (!this.keys) {
      throw new Error(
        "Cannot remove key from a locked wallet. You must unlock it first."
      );
    }

    const keyToRemove = _.find(this.keys, ["kid", kid]);
    if (!keyToRemove) {
      throw new Error(`Could not find key with kid ${kid} in wallet`);
    }

    delete this.keys[kid];
  }

  unlock(password: string) {
    if (!this.ciphered) {
      throw new Error("Cannot unlock an unlocked wallet");
    }

    const decipher = crypto.createDecipher("aes256", password);
    const cipherText = base64url.toBuffer(this.ciphered).toString("hex");
    let decryptedKeys = decipher.update(cipherText, "hex", "utf8");
    decryptedKeys += decipher.final();
    this.keys = JSON.parse(decryptedKeys);
    delete this.ciphered;
  }

  extractByTags(tags: string[]) {
    if (!this.keys) {
      throw new Error(
        "Cannot extract by tags from a locked wallet. You must unlock first."
      );
    }

    const keys = _.pickBy(this.keys, (k) => {
      return _.intersection(k.tags, tags).length;
    });
    return _.values(keys);
  }

  export() {
    if (this.keys) {
      throw new Error("Cannot export unlocked wallet. You must lock it first.");
    }
    return this.ciphered;
  }

  keyToKid(publicKey: string): string {
    try {
      const jwk = JSON.parse(publicKey);
      if (jwk.kid) {
        return jwk.kid;
      }
    } catch (e) {
      // Do nothing
    }

    return base64url.encode(
      crypto.createHash("sha256").update(Buffer.from(publicKey)).digest()
    );
  }
}
