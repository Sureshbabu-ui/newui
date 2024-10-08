import { Decoder, array, boolean, nullable, number, object, string } from "decoders";
import { ContractInvoiceCreateDetailList, ContractInvoiceDetail, ContractInvoiceDetailCreate, contractInvoiceDetailDecoder } from "./contractInvoiceDetail";

export interface ContractInvoiceCreate {
  ContractId: string | number;
  InvoiceAmount: number | string;
  ContractInvoiceScheduleId: string | number;
  InvoiceDate: string;
  Description: string;
  DeductionAmount: string | number;
  DeductionDescription: string;
  Sgst: string | number;
  Cgst: string | number;
  Igst: string | number;
  CollectionDueDate: string;
}
export interface ContractInvoiceWithDetailCreate {
  ContractInvoice: ContractInvoiceCreate,
  ContractInvoiceDetails: ContractInvoiceDetailCreate[]
}

export interface ContractInvoiceCreateResult {
  IsContractInvoiceCreated: Boolean;
}

export const contractInvoiceCreateResultDecoder: Decoder<ContractInvoiceCreateResult> = object({
  IsContractInvoiceCreated: boolean,
});

export interface ContractInvoiceView {
  Id: number | string;
  ContractNumber: string;
  Address: string;
  StateName: string,
  InvoiceNumber: string,
  GstNumber: string;
  PanNumber: string;
  InvoicePendingReason: null | string;
  ScheduledInvoiceDate: string;
  BilledToAddress: string;
  BilledToCityName: string;
  BilledToStateName: string;
  BilledToCountryName: string;
  BilledToPincode: string;
  BilledToGstNumber: string;
  ShippedToAddress: string;
  ShippedToCityName: string;
  ShippedToStateName: string;
  ShippedToCountryName: string;
  ShippedToPincode: string;
  ShippedToGstNumber: string;
  NameOnPrint: string;
  ContractStartDate: string;
  ContractEndDate: string;
  BookingDate: string;
  AgreementType: string;
  InvoiceStartDate: string;
  InvoiceEndDate: string;
  TenantOfficeName: string;
  InvoiceDueDate: string;
  PoNumber: string;
  InvoiceAmount: number | string;
  DeductionAmount: number | string;
  Sgst: number;
  Cgst: number;
  Igst: number;
  BankName: string;
  Ifsc: string;
  AccountNumber: string;
  BankEmail: string;
  AckNo:null|string;
  AckDate:null|string;
}
export const contractInvoiceViewDecoder: Decoder<ContractInvoiceView> = object({
  Id: number,
  ContractNumber: string,
  Address: string,
  StateName: string,
  InvoiceNumber: string,
  GstNumber: string,
  PanNumber: string,
  InvoicePendingReason: nullable(string),
  ScheduledInvoiceDate: string,
  BilledToAddress: string,
  BilledToCityName: string,
  BilledToStateName: string,
  BilledToCountryName: string,
  BilledToPincode: string,
  BilledToGstNumber: string,
  ShippedToAddress: string,
  ShippedToCityName: string,
  ShippedToStateName: string,
  ShippedToCountryName: string,
  ShippedToPincode: string,
  ShippedToGstNumber: string,
  NameOnPrint: string,
  ContractStartDate: string,
  ContractEndDate: string,
  BookingDate: string,
  AgreementType: string,
  InvoiceStartDate: string,
  InvoiceEndDate: string,
  TenantOfficeName: string,
  InvoiceDueDate: string,
  PoNumber: string,
  InvoiceAmount: number,
  DeductionAmount: number,
  Sgst: number,
  Cgst: number,
  Igst: number,
  BankName: string,
  Ifsc: string,
  AccountNumber: string,
  BankEmail: string,
  AckNo:nullable(string),
  AckDate:nullable(string)
});

export interface ContractInvoiceViewDetails {
  ContractInvoice: ContractInvoiceView;
  ContractInvoiceDetails: ContractInvoiceDetail[]
}

export const contractInvoiceViewDetailsDecoder: Decoder<ContractInvoiceViewDetails> = object({
  ContractInvoice: contractInvoiceViewDecoder,
  ContractInvoiceDetails: array(contractInvoiceDetailDecoder)
});

export interface InvoiceInContractDetail {
  Id: number;
  InvoiceNumber: string;
  PendingAmount: number;
  CollectionDueDate: string;
  PaidAmount: number;
}
export const invoiceInContractDetailDecoder: Decoder<InvoiceInContractDetail> = object({
  Id: number,
  InvoiceNumber: string,
  PendingAmount: number,
  CollectionDueDate: string,
  PaidAmount: number
});

export interface InvoiceInContractList {
  ContractInvoices: InvoiceInContractDetail[];
}

export const invoiceInContractListDecoder: Decoder<InvoiceInContractList> = object({
  ContractInvoices: array(invoiceInContractDetailDecoder),
});

export interface ContractInvoicePendingReasonAdd {
  InvoicePendingReason: string | null;
  ContractInvoiceId: number | string | null;
}

export interface ContractInvoicePendingReasonCreateResult {
  IsInvoicePendingReason: Boolean;
}

export const contractInvoicePendingReasonResultDecoder: Decoder<ContractInvoicePendingReasonCreateResult> = object({
  IsInvoicePendingReason: boolean,
});


export interface ContractInvoiceSharedResult {
  IsShared: Boolean;
}

export const contractInvoiceSharedResultDecoder: Decoder<ContractInvoiceSharedResult> = object({
  IsShared: boolean,
});

export interface ShareInfo {
  PrimaryContactName: string;
  PrimaryContactEmail:string;
  SecondaryContactEmail: string | null;
  ContractNumber:string;
  InvoiceNumber:string;
  InvoiceDate:string;
}

export const shareInfoDecoder: Decoder<ShareInfo> = object({
  PrimaryContactName: string,
  PrimaryContactEmail: string,
  SecondaryContactEmail: nullable(string),
  ContractNumber: string,
  InvoiceNumber: string,
  InvoiceDate: string
});

export interface ShareInvoiceDetail{
  InvoiceShareInfo: ShareInfo
}

export const shareInvoiceDetailDecoder: Decoder<ShareInvoiceDetail> = object({
  InvoiceShareInfo: shareInfoDecoder
});

