import { Decoder,  nullable, number, object } from "decoders";

export interface ContractDashboardFilter {
    DateFrom?: string |null;
    DateTo?: string |null;
    TenantRegionId?: number|null;
    TenantOfficeId?: number|null;
}

export interface ContractDashboardProps {
    DateFrom?: string | null;
    DateTo?: string | null;
    TenantRegionId?: number | null;
    TenantOfficeId?: number | null;
}

//collection made
export interface CollectionMadeResponse {
    TotalAmount: number | null
}

export const CollectionMadeResponseDecoder: Decoder<CollectionMadeResponse> = object({
    TotalAmount: nullable(number),
});

// collections outstanding 
export interface CollectionsOutstandingResponse{
    TotalAmount:number|null
}
export const CollectionsOutstandingResponseDecoder:Decoder<CollectionsOutstandingResponse>=object({
    TotalAmount:nullable(number)
})

//contracts booked
export interface ContractsBookedResponse{
    TotalCount:number|null
}
export const ContractsBookedResponseDecoder:Decoder<ContractsBookedResponse>=object({
    TotalCount:nullable(number)
})

//Invoices pending
export interface InvoicesPendingResponse{
    TotalCount:number|null
}
export const InvoicesPendingResponseDecoder:Decoder<InvoicesPendingResponse>=object({
    TotalCount:nullable(number)
})

//invoices raised
export interface InvoicesRaisedResponse{
    TotalCount:number|null
}
export const InvoicesRaisedResponseDecoder:Decoder<InvoicesRaisedResponse>=object({
    TotalCount:nullable(number)
})

//Revenue recognition
export interface RevenueRecognitionResponse{
    TotalValue:number|null
}
export const RevenueRecognitionResponseDecoder:Decoder<RevenueRecognitionResponse>=object({
    TotalValue:nullable(number)
})