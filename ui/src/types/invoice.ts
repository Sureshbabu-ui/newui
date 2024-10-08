import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface InvoiceScheduleListDetails {
    Id: number;
    InvoiceNumber: string|null;
    CustomerName:string;
    ContractNumber:string;
    StartDate: string;
    EndDate: string;
    ScheduledInvoiceDate: string;
    ScheduledInvoiceAmount: number;
    NetInvoiceAmount:number|null;
    CollectedAmount:number|null;
    ContractInvoiceId: number;
    IsInvoiceApproved: boolean;
  }
  
  export const invoiceScheduleListDetailsDecoder: Decoder<InvoiceScheduleListDetails> = object({
    Id: number,
    InvoiceNumber: nullable(string),
    CustomerName:string,
    ContractNumber:string,
    StartDate: string,
    EndDate: string,
    ScheduledInvoiceDate: string,
    ScheduledInvoiceAmount: number,
    NetInvoiceAmount:nullable(number), 
    CollectedAmount:nullable(number),
    ContractInvoiceId: number,
    IsInvoiceApproved: boolean
  });
  
  export interface InvoiceScheduleList {
    InvoiceScheduleList: InvoiceScheduleListDetails[];
    TotalRows: number;
    PerPage: number;

  }
  
  export const invoiceScheduleListDecoder: Decoder<InvoiceScheduleList> = object({
    InvoiceScheduleList: array(invoiceScheduleListDetailsDecoder),
    TotalRows: number,
    PerPage: number
  });

  export interface InvoiceSearchForFilter {
	SearchText: string;
	StartDate: string;
	EndDate: string;
}

export interface InvoiceCollectionDetail {
  Id: number|null;
  NetInvoiceAmount: number|null;
  CollectedAmount:number|null;
  OutstandingAmount:number|null;
  TdsDeductedAmount:number|null;
  TdsPaidAmount:number|null;
  GstTdsDeductedAmount:number|null;
  GstTdsPaidAmount:number|null;
  OtherDeductionAmount:number|null;
  CustomerExpenseAmount:number|null;
  SecurityDepositAmount:number|null;
  PenaltyAmount:number|null;
  WriteOffAmount:number|null;
  InvoiceNumber:string|null;
  CustomerName:string|null; 
  ContractNumber:string|null;
  InvoiceDate:string|null
  }
  
  export const invoiceCollectionDetailDecoder: Decoder<InvoiceCollectionDetail> = object({
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
  ContractNumber:string,
  InvoiceDate:nullable(string)
  });

export interface ReceiptDetailForInvoiceCollection {
  MappedAmount: number;
  ReceiptAmount: number;
  ReceiptNumber: string;
  InvoiceAmount: number;
  ReceiptDate : string;
}

export const receiptDetailForInvoiceCollectionDecoder: Decoder<ReceiptDetailForInvoiceCollection> = object({
  MappedAmount: number,
  ReceiptAmount: number,
  ReceiptNumber: string,
  InvoiceAmount: number,
  ReceiptDate :string
});

export interface InvoiceCollectionView {
  InvoiceDetail: InvoiceCollectionDetail;
  InvoiceReceiptList: ReceiptDetailForInvoiceCollection[]
}

export const invoiceCollectionViewDecoder: Decoder<InvoiceCollectionView> = object({
  InvoiceDetail: invoiceCollectionDetailDecoder,
  InvoiceReceiptList: array(receiptDetailForInvoiceCollectionDecoder)
});