import { CouchDB } from "./CouchDB";
import { AssymetricWalletKey, Wallet } from "./Wallet";
import * as bcrypt from "bcrypt";
import { WalletEntry } from "./WalletEntry";

export class WalletManager {
  couch: CouchDB;

  constructor(connectionUrl: string) {
    this.couch = new CouchDB(connectionUrl);
    this.couch.init();    
  }

  async createNewWalletWithKeys(
    keys: string | { keys: AssymetricWalletKey[] },
    password: string
  ): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const wallet = new Wallet(keys);
    wallet.lock(password);
    const exportedWallet = wallet.export();

    const walletEntry = new WalletEntry(hashedPassword, exportedWallet);
    walletEntry.generateId();
    const docResponse = await this.couch.insert(walletEntry);
    if (docResponse.ok) {
      return docResponse.id;
    }
    return "";
  }

  async getWallet(
    id: string,
    password: string
  ): Promise<_.Dictionary<AssymetricWalletKey>> {
    const walletEntryDoc = await this.couch.get(id);
    if (walletEntryDoc) {
      const walletEntry = WalletEntry.fromObject(walletEntryDoc);
      const compare = await bcrypt.compare(
        password,
        walletEntry.hashedPassword
      );
      if (!compare) return null;

      const wallet = new Wallet(walletEntry.cipheredKeys);
      wallet.unlock(password);
      const walletKeys = wallet.keys;
      wallet.lock(password);
      return walletKeys;
    }
    return null;
  }

  async addKeyToWallet(
    id: string,
    password: string,
    key: AssymetricWalletKey
  ): Promise<string> {
    const walletEntryDoc = await this.couch.get(id);
    if (walletEntryDoc) {
      const walletEntry = WalletEntry.fromObject(walletEntryDoc);
      const compare = await bcrypt.compare(
        password,
        walletEntry.hashedPassword
      );
      if (!compare) return "";

      const wallet = new Wallet(walletEntry.cipheredKeys);
      wallet.unlock(password);
      const kid = wallet.addKey(key);
      wallet.lock(password);
      const exportedWallet = wallet.export();

      walletEntry.cipheredKeys = exportedWallet;
      const docResponse = await this.couch.insert(walletEntry);
      if (docResponse.ok) {
        return kid;
      }
    }

    return "";
  }

  async removeKeyFromWallet(
    id: string,
    password: string,
    kid: string
  ): Promise<boolean> {
    const walletEntryDoc = await this.couch.get(id);
    if (walletEntryDoc) {
      const walletEntry = WalletEntry.fromObject(walletEntryDoc);
      const compare = await bcrypt.compare(
        password,
        walletEntry.hashedPassword
      );
      if (!compare) return false;

      const wallet = new Wallet(walletEntry.cipheredKeys);
      wallet.unlock(password);
      wallet.removeKey(kid);
      wallet.lock(password);
      const exportedWallet = wallet.export();

      walletEntry.cipheredKeys = exportedWallet;
      const docResponse = await this.couch.insert(walletEntry);
      if (docResponse.ok) {
        return true;
      }
    }

    return false;
  }

  async sign(id: string, password: string, kid: string, data: any): Promise<string> {
    const walletEntryDoc = await this.couch.get(id);
    if (walletEntryDoc) {
      const walletEntry = WalletEntry.fromObject(walletEntryDoc);
      const compare = await bcrypt.compare(
        password,
        walletEntry.hashedPassword
      );
      if (!compare) return "";

      const wallet = new Wallet(walletEntry.cipheredKeys);
      wallet.unlock(password);

      const signature = wallet.sign(kid, data);

      wallet.lock(password);
      if (signature) {
        return signature;
      }
    }

    return "";
  }
}
