import * as _ from "lodash";
export declare enum Encodings {
    JWK = "jwk",
    Hex = "hex",
    PGP = "application/pgp-keys",
    PEMFile = "application/x-pem-file",
    Base58 = "base58"
}
export declare enum PublicKeyEncodings {
    PEM = "publicKeyPem",
    JWK = "publicKeyJwk",
    Hex = "publicKeyHex",
    Base64 = "publicKeyBase64",
    Base58 = "publicKeyBase58",
    Multibase = "publicKeyMultibase"
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
export declare class Wallet {
    ciphered: string;
    keys: _.Dictionary<AssymetricWalletKey>;
    constructor(data?: string | {
        keys: AssymetricWalletKey[];
    });
    lock(password: string): void;
    sign(kid: string, data: any): Promise<string>;
    addKey(key: AssymetricWalletKey): string;
    removeKey(kid: string): void;
    unlock(password: string): void;
    extractByTags(tags: string[]): AssymetricWalletKey[];
    export(): string;
    keyToKid(publicKey: string): string;
}
