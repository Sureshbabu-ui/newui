import { Decoder, number, object, string } from "decoders";

export interface ContractInvoiceDetailCreate {
  ItemDescription: string;
  ServicingAccountingCode: string;
  Unit: number;
  Quantity: number;
  Amount: number | string;
  Rate: number | string;
  Sgst: number;
  Cgst: number;
  Igst: number;
  Discount: number | string;
  NetAmount: number | string;
}

export interface ContractInvoiceCreateDetailList {
  ContractInvoiceDetails: ContractInvoiceDetailCreate[]
}

export interface ContractInvoiceDetail {
  Id: number;
  ItemDescription: string;
  ServicingAccountingCode: string;
  Unit: number;
  Quantity: number;
  Amount: number;
  Rate: number;
  Sgst: number;
  Cgst: number;
  Igst: number;
  Discount: number;
  NetAmount: number;
}

export const contractInvoiceDetailDecoder: Decoder<ContractInvoiceDetail> = object({
  Id: number,
  ItemDescription: string,
  ServicingAccountingCode: string,
  Unit: number,
  Quantity: number,
  Amount: number,
  Rate: number,
  Sgst: number,
  Cgst: number,
  Igst: number,
  Discount: number,
  NetAmount: number,
});