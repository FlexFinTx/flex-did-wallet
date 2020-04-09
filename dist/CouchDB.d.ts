import Nano from "nano";
import { CloudantDocument } from "./CloudantDocument";
export declare class CouchDB {
    private _instance;
    constructor(connectionUrl: string);
    init(): Promise<void>;
    insert(doc: CloudantDocument): Promise<Nano.DocumentInsertResponse>;
    get(id: string): Promise<Nano.DocumentGetResponse>;
}
