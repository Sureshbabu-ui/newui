import { Decoder, array, number, object, string } from "decoders";

export interface BarGraphDetails {
    RegionId: number | null;
    StartDate: string;
    EndDate: string;
}

export interface ContractBarGraphDetail {
    ContractCount: number;
    Code: string
}

export const contractBarGraphDetailDecoder: Decoder<ContractBarGraphDetail> = object({
    ContractCount: number,
    Code: string,
})

export interface ContractBarGraphDetails {
    ContractBarGraphDetails: ContractBarGraphDetail[]
}

export const contractBarGraphDetailsDecoder: Decoder<ContractBarGraphDetails> = object({
    ContractBarGraphDetails: array(contractBarGraphDetailDecoder),
});

export interface CollectionBarGraphDetail {
    Amount: number;
    Code: string
}

export const collectionBarGraphDetailDecoder: Decoder<CollectionBarGraphDetail> = object({
    Amount: number,
    Code: string,
})

export interface CollectionBarGraphDetails {
    CollectionBarGraphDetails: CollectionBarGraphDetail[]
}

export const collectionBarGraphDetailsDecoder: Decoder<CollectionBarGraphDetails> = object({
    CollectionBarGraphDetails: array(collectionBarGraphDetailDecoder),
});

export interface InvoicePendingBarGraphDetail {
    InvoicePending: number;
    Code: string
}

export const invoicePendingBarGraphDetailDecoder: Decoder<InvoicePendingBarGraphDetail> = object({
    InvoicePending: number,
    Code: string,
})

export interface InvoicePendingBarGraphDetails {
    InvoicePendingBarGraphDetails: InvoicePendingBarGraphDetail[]
}

export const InvoicePendingBarGraphDetailsDecoder: Decoder<InvoicePendingBarGraphDetails> = object({
    InvoicePendingBarGraphDetails: array(invoicePendingBarGraphDetailDecoder),
});
