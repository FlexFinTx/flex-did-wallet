/// <reference types="lodash" />
import { CouchDB } from "./CouchDB";
import { AssymetricWalletKey } from "./Wallet";
export declare class WalletManager {
    couch: CouchDB;
    constructor(connectionUrl: string);
    createNewWalletWithKeys(keys: string | {
        keys: AssymetricWalletKey[];
    }, password: string): Promise<string>;
    getWallet(id: string, password: string): Promise<_.Dictionary<AssymetricWalletKey>>;
    addKeyToWallet(id: string, password: string, key: AssymetricWalletKey): Promise<string>;
    removeKeyFromWallet(id: string, password: string, kid: string): Promise<boolean>;
}
