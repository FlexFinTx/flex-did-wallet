import * as uuid from "uuid";

export interface CloudantAPIResponse {
  ok: boolean;
  id: string;
  rev: string;
}

export class CloudantDocument {
  _id: string;
  _rev: string;
  _deleted: boolean;
  _attachments: object;

  constructor() {
    this.clear();
  }

  private clear() {
    this._id = undefined;
    this._rev = undefined;
    this._deleted = undefined;
    this._attachments = undefined;
  }

  generateId() {
    this.clear();
    this._id = uuid.v4();
  }

  processAPIResponse(response: CloudantAPIResponse) {
    if (response.ok === true) {
      this._id = response.id;
      this._rev = response.rev;
    }
  }
}
