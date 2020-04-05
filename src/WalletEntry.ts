import { CloudantDocument } from "./CloudantDocument";

export class WalletEntry extends CloudantDocument {
  hashedPassword: string;
  cipheredKeys: string;

  constructor(hashedPassword: string, cipheredKeys: string) {
    super();
    this.hashedPassword = hashedPassword;
    this.cipheredKeys = cipheredKeys;
  }

  static fromObject(parsed: any): WalletEntry {
    let obj = new WalletEntry(parsed.hashedPassword, parsed.cipheredKeys);
    obj._id = parsed._id;
    obj._rev = parsed._rev;
    return obj;
  }

  static fromJSON(json: string): WalletEntry {
    let parsed = JSON.parse(json);
    return WalletEntry.fromObject(parsed);
  }
}
