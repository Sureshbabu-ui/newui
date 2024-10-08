import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';

export interface ContractInvoiceScheduleListDetails {
  Id: number;
  ScheduleNumber: number;
  StartDate: string;
  EndDate: string;
  RrPerDay: number;
  TotalRrValue: number;
  ScheduledInvoiceDate: string;
  ScheduledInvoiceAmount: number;
  ContractInvoiceId: number;
  IsInvoiceApproved: boolean;
}

export const contractInvoiceScheduleListDetailsDecoder: Decoder<ContractInvoiceScheduleListDetails> = object({
  Id: number,
  ScheduleNumber: number,
  StartDate: string,
  EndDate: string,
  RrPerDay: number,
  TotalRrValue: number,
  ScheduledInvoiceDate: string,
  ScheduledInvoiceAmount: number,
  ContractInvoiceId: number,
  IsInvoiceApproved: boolean
});

export interface ContractInvoiceScheduleList {
  ContractInvoiceScheduleList: ContractInvoiceScheduleListDetails[];
  TotalRows: number
}

export const contractInvoiceScheduleListDecoder: Decoder<ContractInvoiceScheduleList> = object({
  ContractInvoiceScheduleList: array(contractInvoiceScheduleListDetailsDecoder),
  TotalRows: number
});

export interface ContractInvoiceScheduleDetails {
  Id: number;
  ContractNumber: string;
  AmcValue: number;
  FmsValue: number;
  ContractValue: number;
  ScheduleNumber: number | string;
  Address: string;
  GstNumber: string;
  PanNumber: string;
  RrPerDay: number | string;
  TotalRrValue: number | string;
  ScheduledInvoiceDate: string;
  ScheduledInvoiceAmount: number | string;
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
  IsSez:boolean;
}

export const contractInvoiceScheduleDetailsDecoder: Decoder<ContractInvoiceScheduleDetails> = object({
  Id: number,
  ContractNumber: string,
  ScheduleNumber: number,
  Address: string,
  GstNumber: string,
  AmcValue: number,
  FmsValue: number,
  ContractValue: number,
  PanNumber: string,
  RrPerDay: number,
  TotalRrValue: number,
  ScheduledInvoiceDate: string,
  ScheduledInvoiceAmount: number,
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
  IsSez:boolean
});

export interface ContractInvoiceSheduleData {
  ContractInvoiceScheduleDetails: ContractInvoiceScheduleDetails;
}

export const contractInvoiceSheduleDataDecoder: Decoder<ContractInvoiceSheduleData> = object({
  ContractInvoiceScheduleDetails: contractInvoiceScheduleDetailsDecoder,
});


// Contract Invoice generate

export interface IsInvoiceScheduleGenerated {
  IsInvoiceScheduleGenerated: Boolean;
}

export const isInvoiceScheduleGeneratedDecoder: Decoder<IsInvoiceScheduleGenerated> = object({
  IsInvoiceScheduleGenerated: boolean,
});

export interface IsInvoiceScheduleApproved {
  IsInvoiceScheduleApproved: boolean;
}

export const isInvoiceScheduleApprovedDecoder: Decoder<IsInvoiceScheduleApproved> = object({
  IsInvoiceScheduleApproved: boolean,
});