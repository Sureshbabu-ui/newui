import { Decoder, array, boolean, nullable, number, object, string } from "decoders";
import { bool } from "yup";

export interface InvoicePrerequisite {
    Id: number;
    DocumentName: string;
    Description:string|null;
    DocumentCode:string;
}

export const invoicePrerequisiteDecoder: Decoder<InvoicePrerequisite> = object({
    Id: number,
    DocumentName: string,
    Description:nullable(string),
    DocumentCode:string
});

export interface InvoicePrerequisites {
    InvoicePrerequisites: InvoicePrerequisite[];
}

export const invoicePrerequisitesDecoder: Decoder<InvoicePrerequisites> = object({
    InvoicePrerequisites: array(invoicePrerequisiteDecoder),
}); 

export interface InvoicePrerequisiteListDetail {
    Id: number;
    DocumentName: string;
    DocumentCode:string;
    Description:string|null;
    IsActive:boolean;
}

export const invoicePrerequisiteListDetailDecoder: Decoder<InvoicePrerequisiteListDetail> = object({
    Id: number,
    DocumentName: string,
    DocumentCode:string,
    Description:nullable(string),
    IsActive:boolean 
});

export interface InvoicePrerequisiteList {
    InvoicePrerequisites: InvoicePrerequisiteListDetail[];
    TotalRows:number;
    PerPage:number;
}

export const invoicePrerequisiteListDecoder: Decoder<InvoicePrerequisiteList> = object({
    InvoicePrerequisites: array(invoicePrerequisiteListDetailDecoder),
    TotalRows:number,
    PerPage:number
});  

export interface InvoicePrerequisiteCreate {
    DocumentName: string;
    Description:string;
    IsActive: string;
     DocumentCode:string;
  }
  export interface InvoicePrerequisiteCreateResult {
    IsInvoicePrerequisiteCreated: Boolean;
  }

export const createInvoicePrerequisiteDecoder: Decoder<InvoicePrerequisiteCreateResult> = object({
    IsInvoicePrerequisiteCreated: boolean,
});

export interface InvoicePrerequisiteUpdate {
    Id: number;
    IsActive: boolean;
}
export interface InvoicePrerequisiteUpdateResult {
    IsInvoicePrerequisiteUpdated: Boolean;
}

export const updateInvoicePrerequisiteDecoder: Decoder<InvoicePrerequisiteUpdateResult> = object({
    IsInvoicePrerequisiteUpdated: boolean,
});
  
export interface InvoicePrerequisiteDeleted {
    IsDeleted: Boolean;
}

export const invoicePrerequisiteDeletedDecoder: Decoder<InvoicePrerequisiteDeleted> = object({
    IsDeleted: boolean,
});