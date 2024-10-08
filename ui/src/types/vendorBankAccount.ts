import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface VendorBankAccountCreation {
  VendorId: number,
  BankId: number,
  VendorBranchId: number | null,
  BankBranchId: number,
  BankAccountTypeId: number,
  AccountNumber: string,
}

export interface Select {
  value: any,
  label: any,
}

export interface SelectDetails {
  Select: Select[]
}

export interface VendorBankAccountSelectDetails {
  VendorBranches: Select[],
  BankBranches: Select[],
  BankAccountTypes: Select[],
  Banks: Select[],
}

export interface VendorBankAccountList {
  Id: number;
  AccountNumber: string,
  BankBranchName: string,
  Ifsc: string,
  VendorBranchName: string | null,
  AccountType: string,
  IsActive: boolean;
}

export const vendorBankAccountDetailsDecoder: Decoder<VendorBankAccountList> = object({
  Id: number,
  AccountNumber: string,
  BankBranchName: string,
  Ifsc: string,
  VendorBranchName: nullable(string),
  AccountType: string,
  IsActive: boolean,
});

export interface MultipleVendorBankAccountDetails {
  VendorBankAccounts: VendorBankAccountList[];
  TotalRows: number;
  PerPage: number;
}

export const multipleVendorBankAccountDetailsDecoder: Decoder<MultipleVendorBankAccountDetails> = object({
  VendorBankAccounts: array(vendorBankAccountDetailsDecoder),
  TotalRows: number,
  PerPage: number
});

export interface VendorBankAccountCreateResponse {
  IsVendorBankAccountCreated: Boolean;
}

export const vendorBankAccountCreateResponseDecoder: Decoder<VendorBankAccountCreateResponse> = object({
  IsVendorBankAccountCreated: boolean
})

export interface VendorBankAccountEdit {
  BankId: number,
  Id: number,
  VendorBranchId: number | null,
  BankBranchId: number,
  BankAccountTypeId: number,
  AccountNumber: string,
  IsActive: boolean
}

export const vendorBankAccountEditDecoder: Decoder<VendorBankAccountEdit> = object({
  BankId: number,
  Id: number,
  VendorBranchId: nullable(number),
  BankBranchId: number,
  BankAccountTypeId: number,
  AccountNumber: string,
  IsActive: boolean
})

export interface VendorBankAccountEditDetails {
  VendorBankAccountDetails: VendorBankAccountEdit;
}

export const vendorBankAccountEditDetailsDecoder: Decoder<VendorBankAccountEditDetails> = object({
  VendorBankAccountDetails: vendorBankAccountEditDecoder
})

export interface VendorBankAccountEditResponse {
  IsVendorBankAccountUpdated: Boolean;
}

export const vendorBankAccountEditResponseDecoder: Decoder<VendorBankAccountEditResponse> = object({
  IsVendorBankAccountUpdated: boolean
})

export interface VendorBankAccountDeleteResponse {
  IsDeleted: Boolean;
}

export const vendorBankAccountDeleteResponseDecoder: Decoder<VendorBankAccountDeleteResponse> = object({
  IsDeleted: boolean
})