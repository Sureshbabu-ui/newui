import { array, boolean, Decoder, nullable, number, object, string } from "decoders";

export interface DocumentNumberFormatDetails {
    Id: number;
    DocumentTypeId:number;
    DocumentNumberFormat: string;
    DocumentType: string;
    IsActive: boolean;
    NumberPadding: number;
}

export const dnfDetailsDecoder: Decoder<DocumentNumberFormatDetails> = object({
    Id: number,
    DocumentTypeId: number,
    DocumentNumberFormat: string,
    DocumentType: string,
    IsActive: boolean,
    NumberPadding: number,
})

export interface DocumentNumberFormatList {
    DocumentNumFormatList: DocumentNumberFormatDetails[]
    TotalRows: number
    PerPage: number
}

export const dnfListDecoder: Decoder<DocumentNumberFormatList> = object({
    DocumentNumFormatList: array(dnfDetailsDecoder),
    TotalRows: number,
    PerPage: number
});

export interface DocumentNumberFormatCreate {
    Format: string;
    DocumentTypeId: number;
    NumberPadding: number;
    separator: string;
    documentNumber: number;
}

export interface NumberFormatResponse {
    IsCreated: boolean;
}

export const numberFormatResponseDecoder: Decoder<NumberFormatResponse> = object({
    IsCreated: boolean
})

export interface DocumentNumberFormatEdit {
    Id:number;
    Format: string;
    DocumentTypeId: number;
    NumberPadding: number;
    separator: string;
    documentNumber: number;
}

export interface EditNumberFormatResponse {
    IsNumberFormatUpdated: boolean;
}

export const editnumberFormatResponseDecoder: Decoder<EditNumberFormatResponse> = object({
    IsNumberFormatUpdated: boolean
})