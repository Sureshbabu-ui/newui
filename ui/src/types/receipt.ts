import { Decoder, array, boolean, nullable, number, object, string } from "decoders";


export interface ReceiptListDetail {
  Id: number;
  ReceiptNumber: string;
  ReceiptAmount: number;
  CustomerName: string | null;
  PaymentMethod: string | null;
  ReceiptDate: string;
}

export const receiptListDetailDecoder: Decoder<ReceiptListDetail> = object({
  Id: number,
  ReceiptNumber: string,
  ReceiptAmount: number,
  CustomerName: nullable(string),
  PaymentMethod: nullable(string),
  ReceiptDate: string
});

export interface ReceiptList {
  Receipts: ReceiptListDetail[];
  TotalRows: number;
  PerPage:number;
}

export const receiptListDecoder: Decoder<ReceiptList> = object({
  Receipts: array(receiptListDetailDecoder),
  TotalRows: number,
  PerPage:number
});

export interface ReceiptView {
  ReceiptNumber: string | null;
  ReceiptDate: string | null;
  CustomerName: string | null;
  PaymentMethod: string | null;
  TransactionReferenceNumber: string | null;
  TenantBankAccount: string | null;
  ReceiptAmount: number | null;
}
export const receiptViewDecoder: Decoder<ReceiptView> = object({
  ReceiptNumber: nullable(string),
  ReceiptDate: nullable(string),
  CustomerName: nullable(string),
  PaymentMethod: nullable(string),
  TransactionReferenceNumber: nullable(string),
  TenantBankAccount: nullable(string),
  ReceiptAmount: nullable(number)
})


export interface InvoiceReceiptDetail {
  Id: number;
  InvoiceId: number;
  ReceiptAmount: number;
  InvoiceNumber: string;
  InvoiceAmount: number;
}

export const invoiceReceiptDetailDecoder: Decoder<InvoiceReceiptDetail> = object({
  Id: number,
  InvoiceId: number,
  ReceiptAmount: number,
  InvoiceNumber: string,
  InvoiceAmount: number
});
export interface ReceiptViewDetails {
  Receipt: ReceiptView;
  InvoiceReceiptList: InvoiceReceiptDetail[]
}

export const receiptViewDetailsDecoder: Decoder<ReceiptViewDetails> = object({
  Receipt: receiptViewDecoder,
  InvoiceReceiptList: array(invoiceReceiptDetailDecoder)
});

export interface InvoiceReceiptDetailCreate {
  InvoiceId: number;
  InvoiceNumber: string;
  Amount: number;
  PaidAmount: number;
  CollectionDueDate: string;
  PendingAmount: number;
}

export interface InvoiceReceiptListCreate {
  ContractInvoices: InvoiceReceiptDetailCreate[];
}