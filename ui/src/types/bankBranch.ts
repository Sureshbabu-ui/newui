import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface BankBranchCreate {
  BankId: number | string;
  BranchCode: string;
  BranchName: string;
  Address: string;
  CityId: number | null;
  StateId: number | null;
  CountryId: number | null;
  Pincode: string;
  ContactPerson: string;
  ContactNumberOneCountryCode: string;
  ContactNumberOne: string;
  ContactNumberTwoCountryCode: string;
  ContactNumberTwo: string;
  Email: string;
  Ifsc: string;
  MicrCode: string;
  SwiftCode: string;
}

export interface BankBranchCreateResult {
  IsBankBranchCreated: Boolean;
}

export const createBankBranchDecoder: Decoder<BankBranchCreateResult> = object({
  IsBankBranchCreated: boolean,
});

export interface BankBranchUpdateResult {
  IsBankBranchUpdated: Boolean;
}

export const createBankBranchUpdateDecoder: Decoder<BankBranchUpdateResult> = object({
  IsBankBranchUpdated: boolean,
});

export interface BankBranchListDetails {
  Id: number,
  BankName: string;
  BranchName: string;
  CityName: string;
  StateName: string;
  Ifsc: string;
  CreatedByFullName: string;
  CreatedOn: string;
}

export const bankBranchListDetailsDecoder: Decoder<BankBranchListDetails> = object({
  Id: number,
  BankName: string,
  BranchName: string,
  CityName: string,
  StateName: string,
  Ifsc: string,
  CreatedByFullName: string,
  CreatedOn: string,
});

export interface BankBranchList {
  BankBranches: BankBranchListDetails[],
  TotalRows: number;
  PerPage: number;
}

export const bankBranchListDecoder: Decoder<BankBranchList> = object({
  BankBranches: array(bankBranchListDetailsDecoder),
  TotalRows: number,
  PerPage: number
});

export interface BankBranchDetails {
  Id: number;
  BankId: number;
  BankName: string;
  BranchCode: string;
  BranchName: string;
  Address: string;
  CityName: number;
  StateName: number;
  CountryId: number;
  Pincode: string;
  ContactPerson: string;
  ContactNumberOneCountryCode: string;
  ContactNumberOne: string;
  ContactNumberTwoCountryCode: string;
  ContactNumberTwo: string;
  Email: string;
  Ifsc: string;
  MicrCode: string;
  SwiftCode: string;
  CreatedByFullName: string;
  CreatedOn: string;
  UpdatedByFullName: null | string;
  UpdatedOn: null | string;
}

export const bankBranchDetailsDecoder: Decoder<BankBranchDetails> = object({
  Id: number,
  BankName: string,
  BankId: number,
  BranchCode: string,
  BranchName: string,
  Address: string,
  CityName: number,
  StateName: number,
  CountryId: number,
  Pincode: string,
  ContactPerson: string,
  ContactNumberOneCountryCode: string,
  ContactNumberOne: string,
  ContactNumberTwoCountryCode: string,
  ContactNumberTwo: string,
  Email: string,
  Ifsc: string,
  MicrCode: string,
  SwiftCode: string,
  CreatedByFullName: string,
  CreatedOn: string,
  UpdatedByFullName: nullable(string),
  UpdatedOn: nullable(string)
});

export interface BankBranchDetailsSelect {
  value: any,
  label: any
}

export interface BankBranchesSelect {
  BankBranches: BankBranchDetailsSelect[];
}

export interface BranchInBankDetail {
  Id: number;
  BranchId: number;
  BranchName: string;
}

export const branchInBankDetailDecoder: Decoder<BranchInBankDetail> = object({
  Id: number,
  BranchId: number,
  BranchName: string,
});

export interface BranchInBankList {
  BankBranches: BranchInBankDetail[];
}

export const branchInBankListDecoder: Decoder<BranchInBankList> = object({
  BankBranches: array(branchInBankDetailDecoder),
});

export interface BankBranchInfo {
  Id: number;
  BankId: number;
  StateId: number;
  CityId: number;
  CountryId: number;
  BankName: string;
  BranchCode: string;
  BranchName: string;
  Address: string;
  City: string;
  State: string;
  Country: string;
  Pincode: string;
  ContactPerson: string;
  ContactNumberOneCountryCode: string;
  ContactNumberOne: string;
  ContactNumberTwoCountryCode: string | null;
  ContactNumberTwo: string | null;
  Email: string;
  Ifsc: string;
  MicrCode: string;
  SwiftCode: string;
  CreatedBy: string;
  CreatedOn: string;
  BranchId:number;
}

export const bankBranchInfoDecoder: Decoder<BankBranchInfo> = object({
  Id: number,
  BankId: number,
  StateId: number,
  CityId: number,
  CountryId: number,
  BankName: string,
  BranchCode: string,
  BranchName: string,
  Address: string,
  City: string,
  State: string,
  Country: string,
  Pincode: string,
  ContactPerson: string,
  ContactNumberOneCountryCode: string,
  ContactNumberOne: string,
  ContactNumberTwoCountryCode: nullable(string),
  ContactNumberTwo: nullable(string),
  Email: string,
  Ifsc: string,
  MicrCode: string,
  SwiftCode: string,
  CreatedBy: string,
  CreatedOn: string,
  BranchId:number
});

export interface SelectedBankBranch {
  BankBranchDetails: BankBranchInfo,
}

export const selectedBankBranchDecoder: Decoder<SelectedBankBranch> = object({
  BankBranchDetails: bankBranchInfoDecoder,
});

export interface BankBranchDeleted {
  IsDeleted: Boolean;
}

export const bankBranchDeletedDecoder: Decoder<BankBranchDeleted> = object({
  IsDeleted: boolean,
});
