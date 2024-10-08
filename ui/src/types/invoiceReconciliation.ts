import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';

export interface InvoiceReconciliationListDetail {
Id: number;
NetInvoiceAmount: number;
CollectedAmount:number;
OutstandingAmount:number;
TdsDeductedAmount:number;
TdsPaidAmount:number;
GstTdsDeductedAmount:number;
GstTdsPaidAmount:number;
OtherDeductionAmount:number;
CustomerExpenseAmount:number;
SecurityDepositAmount:number;
PenaltyAmount:number;
WriteOffAmount:number;
InvoiceNumber:string;
CustomerName:string; 
}

export const invoiceReconciliationListDetailDecoder: Decoder<InvoiceReconciliationListDetail> = object({
Id: number,
NetInvoiceAmount:number,
CollectedAmount:number,
OutstandingAmount:number,
TdsDeductedAmount:number,
TdsPaidAmount:number,
GstTdsDeductedAmount:number,
GstTdsPaidAmount:number,
OtherDeductionAmount:number,
CustomerExpenseAmount:number,
SecurityDepositAmount:number,
PenaltyAmount:number,
WriteOffAmount:number,
InvoiceNumber:string,
CustomerName:string,
});

export interface InvoiceReconciliationList {
  InvoiceReconciliationList: InvoiceReconciliationListDetail[];
  TotalRows: number;
  PerPage:number;
}

export const invoiceReconciliationListDecoder: Decoder<InvoiceReconciliationList> = object({
  InvoiceReconciliationList: array(invoiceReconciliationListDetailDecoder),
  TotalRows: number,
  PerPage:number
}); 


export interface InvoiceReconciliationTaxFileUpload {
  CollectionFile: File | null;
  TaxType:string|null;
}
export interface InvoiceReconciliationTaxUploadResult {
IsCollectionUploaded: Boolean;
}

export const invoiceReconciliationTaxUploadResultDecoder: Decoder<InvoiceReconciliationTaxUploadResult> = object({
IsCollectionUploaded: boolean,
});