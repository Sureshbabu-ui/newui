import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface BankCollectionDocumentUpload {
    TenantBankAccountId: number|null;
    BankCollectionFile: File | null;
}
export interface BankCollectionUploadResult {
  IsCollectionUploaded: Boolean;
}

export const bankCollectionUploadResultDecoder: Decoder<BankCollectionUploadResult> = object({
  IsCollectionUploaded: boolean,
});

export interface BankCollectionListDetail {
    Id: number|null;
    Particulars : string|null;
    TransactionDate :string|null;
    TransactionAmount:number|null;
    TenantBankAccountId: number|null;
    ChequeRealizedOn:string|null;
		ChequeReturnedOn:string|null;
		ChequeReturnedReason:string|null;
		PaymentMethodCode:string|null;
    CustomerInfoId:number|string|null;
    TotalReceiptAmount:number|null;
    ClaimedBy:string|null;
    CreatedOn: string;
 }
  
  export const bankCollectionListDetailDecoder: Decoder<BankCollectionListDetail> = object({
    Id: number,
    Particulars: string,
    TransactionDate :string, 
    TransactionAmount:number,
    TenantBankAccountId:nullable(number),
    ChequeRealizedOn:nullable(string),
		ChequeReturnedOn:nullable(string),
		ChequeReturnedReason:nullable(string),
		PaymentMethodCode:nullable(string),
    CustomerInfoId:nullable(number),
    TotalReceiptAmount:nullable(number),
    ClaimedBy:nullable(string),
    CreatedOn: string 
  });
  
  export interface BankCollectionList {
    BankCollections: BankCollectionListDetail[];
    TotalRows: number;
    PerPage:number;
  }
  
  export const bankCollectionListDecoder: Decoder<BankCollectionList> = object({  
    BankCollections: array(bankCollectionListDetailDecoder),
    TotalRows: number,
    PerPage:number
  });

  export interface BankCollectionApproveDetail {
    Id: number|null|string;
    Particulars:string|null;
    TransactionAmount:number;
    TransactionDate :string|null;
    TransactionReferenceNumber :string|null;
    PaymentMethodId:number|string|null;
    CustomerInfoId:number|string|null;
    TenantBankAccountId: number|null;
 }

 export interface BankCollectionProcessResponseData {
  IsCollectionProcessed: Boolean;
}

export const bankCollectionProcessResponseDataDecoder: Decoder<BankCollectionProcessResponseData> = object({
  IsCollectionProcessed: boolean
})

export interface BankCollectionDashboardDetail {
  PendingCollectionAmount:number;
  PendingCollectionCount:number;
  MappedCollectionAmount:null|number;
  MappedCollectionCount:null|number;
  IgnoredCollectionAmount:null|number;
  IgnoredCollectionCount:null|number;
}

export const bankCollectionDashboardDetailDecoder: Decoder<BankCollectionDashboardDetail> = object({
  PendingCollectionAmount:number,
  PendingCollectionCount:number,
  MappedCollectionAmount:nullable(number),
  MappedCollectionCount:nullable(number),
  IgnoredCollectionAmount:nullable(number),
  IgnoredCollectionCount:nullable(number),
});

export interface BankCollectionIgnoreResult {
  IsCollectionIgnored: Boolean;
}

export const bankCollectionIgnoreResultDecoder: Decoder<BankCollectionIgnoreResult> = object({
  IsCollectionIgnored: boolean,
});

export interface Select {
  value: any,
  label: any,
  code?: any
}

export interface SelectDetails {
  Select: Select[]
}

export interface ChequeCollectionDocumentUpload {
  TenantBankAccountId: number|null;
  ChequeCollectionFile: File | null;
}
export interface ChequeCollectionUploadResult {
IsCollectionUploaded: Boolean;
}

export const chequeCollectionUploadResultDecoder: Decoder<ChequeCollectionUploadResult> = object({
IsCollectionUploaded: boolean,
});

export interface BankCollectionClaimCancelDetail {
  Id: number|null;
  CancelReason:string|null;
}

export interface BankCollectionClaimCancelResponseData {
  IsClaimCancelled: Boolean;
}

export const bankCollectionClaimCancelResponseDataDecoder: Decoder<BankCollectionClaimCancelResponseData> = object({
  IsClaimCancelled: boolean
})

export interface BankCollectionDetail {
  Id: number|null;
  TransactionReferenceNumber : string|null;
  TransactionDate :string|null;
  TransactionAmount:number|null;
  ChequeRealizedOn:string|null;
  ChequeReturnedOn:string|null;
  ChequeReturnedReason:string|null;
  PaymentMethodCode:string|null;
  PaymentMethodName:string|null;
  CustomerName:null|string;
  TotalReceiptAmount:number|null;
  ClaimedBy:string|null;
}

export const bankCollectionDetailDecoder: Decoder<BankCollectionDetail> = object({
  Id: number,
  TransactionReferenceNumber: nullable(string),
  TransactionDate :string, 
  TransactionAmount:number,
  ChequeRealizedOn:nullable(string),
  ChequeReturnedOn:nullable(string),
  ChequeReturnedReason:nullable(string),
  PaymentMethodCode:nullable(string),
  PaymentMethodName:nullable(string),
  CustomerName:nullable(string),
  TotalReceiptAmount:nullable(number),
  ClaimedBy:nullable(string),
});

export interface BankCollectionReceiptDetail {
  Id: number;
  ReceiptAmount: number;
  ReceiptNumber: string;
}

export const bankCollectionReceiptDetailDecoder: Decoder<BankCollectionReceiptDetail> = object({
  Id: number,
  ReceiptAmount: number,
  ReceiptNumber: string,
});

export interface BankCollectionDetailWithReceiptList {
  BankCollectionDetail: BankCollectionDetail;
  CollectionReceiptList: BankCollectionReceiptDetail[]
}

export const bankCollectionDetailWithReceiptListDecoder: Decoder<BankCollectionDetailWithReceiptList> = object({
  BankCollectionDetail: bankCollectionDetailDecoder,
  CollectionReceiptList: array(bankCollectionReceiptDetailDecoder)
});