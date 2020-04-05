import { CloudantDocument } from "./CloudantDocument";
export declare class WalletEntry extends CloudantDocument {
    hashedPassword: string;
    cipheredKeys: string;
    constructor(hashedPassword: string, cipheredKeys: string);
    static fromObject(parsed: any): WalletEntry;
    static fromJSON(json: string): WalletEntry;
}
