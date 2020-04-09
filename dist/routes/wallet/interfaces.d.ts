import { AssymetricWalletKey } from "../../Wallet";
export interface CreateWalletRequest {
    data: string | {
        keys: AssymetricWalletKey[];
    };
    password: string;
}
export interface GetWalletRequest {
    password: string;
}
export interface PatchWalletRequest {
    type: "add-key" | "remove-key";
    password: string;
    kid?: string;
    key?: AssymetricWalletKey;
}
export interface SignRequest {
    password: string;
    kid: string;
    data: string;
}
