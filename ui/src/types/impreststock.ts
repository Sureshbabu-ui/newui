import { Decoder, boolean, object } from "decoders";

export interface ImprestStock {
    PartStockIdList:number[];
    CustomerId: number;
    ContractId: number;
    CustomerSiteId: number | null;
    ServiceEngineerId: number | null;
    ReservedFrom: string;
    ReservedTo: string;
    Remarks:string;
    IsCustomerSite:boolean;
    IsbyCourier: string;
}

export interface ImprestStockResponse {
    IsImprestStockCreated: Boolean;
}

export const imprestStockResponseDecoder: Decoder<ImprestStockResponse> = object({
    IsImprestStockCreated: boolean,
});