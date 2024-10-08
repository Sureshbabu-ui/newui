import { array, boolean, Decoder, nullable, number, object, string } from "decoders";

export interface DNSDetails {
    Id: number;
    DNSYear: string | null;
    OfficeName: string |null;
    DocumentType: string;
    IsActive: boolean;
    DocumentNumber: number;
}

export const dnsDetailsDecoder: Decoder<DNSDetails> = object({
    Id: number ,
    DNSYear: nullable(string) ,
    OfficeName: nullable(string) ,
    DocumentType: string ,
    IsActive: boolean ,
    DocumentNumber: number
})

export interface DNSList {
    DNSList: DNSDetails[]
    TotalRows: number
    PerPage: number
}

export const dnsListDecoder: Decoder<DNSList> = object({
    DNSList: array(dnsDetailsDecoder),
    TotalRows: number,
    PerPage: number
});

export interface DocumentNumberSeriesCreate {
    Year: string | null;
    TenantOfficeId: string | null;
    DocumentTypeId: number;
    DocumentNumber: number;
}

export interface DocumentNumberSelect {
    value: any,
    label: any,
    code?: any
}

export interface DocumentNumberSelectDetails {
    Select: DocumentNumberSelect[]
}

export interface NumberSeriesResponse {
    IsCreated: Boolean;
}

export const numberSeriesResponseDecoder: Decoder<NumberSeriesResponse> = object({
    IsCreated: boolean
})