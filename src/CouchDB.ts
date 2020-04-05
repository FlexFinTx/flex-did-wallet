import Nano from "nano";
import { CloudantDocument } from "./CloudantDocument";

export class CouchDB {
  private _instance: Nano.ServerScope;

  constructor(connectionUrl: string) {
    this._instance = Nano(connectionUrl);
  }

  async init() {
    const createdDatabases = await this._instance.db.list();
    if (!createdDatabases.includes("wallets")) {
      await this._instance.db.create("wallets");
    }
    console.log("Initialized CouchDB");
  }

  async insert(doc: CloudantDocument) {
    return await this._instance.use("wallets").insert(doc);
  }

  async get(id: string) {
    return await this._instance.use("wallets").get(id);
  }
}
