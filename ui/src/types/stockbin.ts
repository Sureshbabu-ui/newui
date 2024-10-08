import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface StockBinCreate {
    BinName: string;
    BinCode: string | null;
    IsActive: number;
}

export interface StockBinEdit {
    Id: number;
    BinName: string;
    IsActive: string;
}

export interface StockBinEditResponse {
    IsStockBinUpdated: Boolean;
}

export const editDecoder: Decoder<StockBinEditResponse> = object({
    IsStockBinUpdated: boolean,
});

export interface StockBinCreateResponse {
    IsStockBinCreated: Boolean;
}

export const createDecoder: Decoder<StockBinCreateResponse> = object({
    IsStockBinCreated: boolean,
});

export interface StockBinDetails {
    Id: number;
    BinName: string;
    BinCode: string;
    IsActive: boolean;
}

export const stockBinDetailsDecoder: Decoder<StockBinDetails> = object({
    Id: number,
    BinName: string,
    BinCode: string,
    IsActive: boolean,
});
export interface StockBinList {
    StockBins: StockBinDetails[],
    TotalRows: number;
    PerPage:number;
}

export const stockBinListDecoder: Decoder<StockBinList> = object({
    StockBins: array(stockBinDetailsDecoder),
    TotalRows: number,
    PerPage:number
});

export interface StockBinDeleted {
    IsDeleted: Boolean;
}

export const stockBinDeletedDecoder: Decoder<StockBinDeleted> = object({
    IsDeleted: boolean,
});