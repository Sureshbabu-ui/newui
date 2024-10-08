import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface CallStopStatus {
  Id: number | string;
  CallExpiryDate: null | string;
  CallStopDate: string | null;
  CallStopReason: string | null;
}

export const callStopStatusDecoder: Decoder<CallStopStatus> = object({
  Id: number,
  CallExpiryDate: nullable(string),
  CallStopDate: nullable(string),
  CallStopReason: nullable(string)
});

// Contract Expiry Detail
export interface ContractExpiryDetail {
  CallExpiryDate: null | string;
  EndDate: string | null;
  AdditionalDays: number | null;
}

export const contractExpiryDetailDecoder: Decoder<ContractExpiryDetail> = object({
  CallExpiryDate: nullable(string),
  EndDate: nullable(string),
  AdditionalDays: nullable(number)
});
// Contract Expiry Detail Ends

// Call stop History
export interface CallStopHistoryDetail {
  ResetDate: string | null;
  ResetReason: null | string;
  StopDate: string | null;
  StopReason: string | null;
  ResetBy: string | null
  StoppedBy: string | null
  CreatedOn: string | null
  UpdatedOn: string | null
}

export const callStopHistoryDetailDecoder: Decoder<CallStopHistoryDetail> = object({
  ResetDate: nullable(string),
  ResetReason: nullable(string),
  StopDate: nullable(string),
  StopReason: nullable(string),
  ResetBy: nullable(string),
  StoppedBy: nullable(string),
  CreatedOn: nullable(string),
  UpdatedOn: nullable(string),
});
export interface CallStopHistoryDetails {
  CallStopHistoryDetails: CallStopHistoryDetail[]
}

export const callStopHistoryDetailsDecoder: Decoder<CallStopHistoryDetails> = object({
  CallStopHistoryDetails: array(callStopHistoryDetailDecoder),
});

// Call stop History end

// Call Expiry update 
export interface CallExpiryUpdateResult {
  IsCallExpiryUpdated: Boolean;
}

export const callExpiryUpdateResultDecoder: Decoder<CallExpiryUpdateResult> = object({
  IsCallExpiryUpdated: boolean,
});
// Call Expiry Update End
export interface CallStopUpdateData {
  Status: boolean | null;
  Reason: string;
  CallStopDate: string;
}

export interface CallStatusUpdateResult {
  IsCallStatusUpdated: Boolean;
}

export const callStatusUpdateResultDecoder: Decoder<CallStatusUpdateResult> = object({
  IsCallStatusUpdated: boolean,
});

export interface ContractCloseResult {
  IsContractClosed: Boolean;
}

export const contractCloseResultDecoder: Decoder<ContractCloseResult> = object({
  IsContractClosed: boolean,
});

export interface ContractCloseDetail {
  TotalCollection: null | number;
  TotalOpenServiceRequest: null | number;
  PendingBankGuarantee: null | number;
  TotalInvoiceAmount: null | number;
  EndDate: string | null;
}

export const contractCloseDetailDecoder: Decoder<ContractCloseDetail> = object({
  TotalCollection: nullable(number),
  TotalOpenServiceRequest: nullable(number),
  PendingBankGuarantee: nullable(number),
  TotalInvoiceAmount: nullable(number),
  EndDate: nullable(string)
});