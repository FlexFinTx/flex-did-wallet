export interface CloudantAPIResponse {
    ok: boolean;
    id: string;
    rev: string;
}
export declare class CloudantDocument {
    _id: string;
    _rev: string;
    _deleted: boolean;
    _attachments: object;
    constructor();
    private clear;
    generateId(): void;
    processAPIResponse(response: CloudantAPIResponse): void;
}
