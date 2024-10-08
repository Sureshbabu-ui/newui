import { Decoder, array, boolean, number, object, string } from "decoders";

export interface EInvoiceListDetail {
    Id: number;
    Invoiceno:string; 
    EISent:boolean;
    EISuccess:boolean;
    CreatedOn:string;
  }
  
  export const eInvoiceListDetailDecoder: Decoder<EInvoiceListDetail> = object({
    Id: number, 
    Invoiceno:string,
    EISent:boolean,
    EISuccess:boolean,
    CreatedOn:string
  });
   
  export interface EInvoiceList {
    EInvoiceList: EInvoiceListDetail[];
    TotalRows: number
    PerPage:number
  }
  
  export const eInvoiceListDecoder: Decoder<EInvoiceList> = object({
    EInvoiceList: array(eInvoiceListDetailDecoder),
    TotalRows: number,
    PerPage:number
  });