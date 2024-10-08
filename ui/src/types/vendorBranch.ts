import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface VendorBranchCreation {
  Name: string
  Address: string
  TenantOfficeId: number
  CityId: number
  VendorId: number
  StateId: number
  Pincode: string
  ContactName: string
  Email: string
  ContactNumberOneCountryCode: string
  ContactNumberOne: string
  ContactNumberTwoCountryCode: string
  ContactNumberTwo: string
  CreditPeriodInDays: string
  GstNumber: string
  GstVendorTypeId: number
  CountryId: number
  GstArn: string
  Remarks: string
  TollfreeNumber: string
  Code: string
}

export interface Select {
  value: any,
  label: any,
  code?:any
}

export interface SelectDetails {
  Select: Select[]
}

export interface VendorBranchSelectDetails {
  States: Select[],
  Cities: Select[],
  Countrys: Select[],
  Location: Select[],
  GstVendorType: Select[],
  PrimaryCountryCode:Select[]
}

export interface VendorSearchForFilter {
  SearchText: string;
}

export interface VendorBranchList {
  Id: number;
  Code: string;
  Name: string;
  City: string;
  ContactNumberOne: string;
  ContactNumberOneCountryCode: string;
  ContactName: string;
  TenantLocation: string;
  IsActive: boolean;
}

export const vendorBranchDetailsDecoder: Decoder<VendorBranchList> = object({
  Id: number,
  Code: string,
  VendorId: number,
  Name: string,
  City: string,
  ContactNumberOneCountryCode: string,
  ContactNumberOne: string,
  ContactName: string,
  TenantLocation: string,
  IsActive: boolean,
});

export interface MultipleVendorBranchDetails {
  VendorBranches: VendorBranchList[];
  TotalRows: number;
  PerPage: number;
}

export const multipleVendorBranchDetailsDecoder: Decoder<MultipleVendorBranchDetails> = object({
  VendorBranches: array(vendorBranchDetailsDecoder),
  TotalRows: number,
  PerPage: number
});

export interface VendorBranchCreateResponse {
  IsVendorBranchCreated: Boolean;
}

export const vendorBranchCreateResponseDecoder: Decoder<VendorBranchCreateResponse> = object({
  IsVendorBranchCreated: boolean
})

export interface VendorBranchEdit {
  Id: number,
  Name: string
  Address: string
  TenantOfficeId: number
  CityId: number
  StateId: number
  Pincode: string
  ContactName: string
  Email: string
  ContactNumberOneCountryCode: string
  ContactNumberOne: string
  ContactNumberTwoCountryCode: string | null
  ContactNumberTwo: string | null
  CreditPeriodInDays: number
  GstNumber: string
  GstVendorTypeId: number
  CountryId: number
  GstArn: string
  Remarks: string | null
  TollfreeNumber: string | null
  Code: string
  IsActive: boolean
}

export const vendorBranchEditDecoder: Decoder<VendorBranchEdit> = object({
  Id: number,
  Name: string,
  Address: string,
  TenantOfficeId: number,
  CityId: number,
  StateId: number,
  Pincode: string,
  ContactName: string,
  Email: string,
  IsActive: boolean,
  ContactNumberOneCountryCode: string,
  ContactNumberOne: string,
  ContactNumberTwoCountryCode: nullable(string),
  ContactNumberTwo: nullable(string),
  CreditPeriodInDays: number,
  GstNumber: string,
  GstVendorTypeId: number,
  CountryId: number,
  GstArn: string,
  Remarks: nullable(string),
  TollfreeNumber: nullable(string),
  Code: string,
})

export interface VendorBranchEditDetails {
  VendorBranchDetails: VendorBranchEdit;
}

export const vendorBranchEditDetailsDecoder: Decoder<VendorBranchEditDetails> = object({
  VendorBranchDetails: vendorBranchEditDecoder
})

export interface VendorBranchEditResponse {
  IsVendorBranchUpdated: Boolean;
}

export const vendorBranchEditResponseDecoder: Decoder<VendorBranchEditResponse> = object({
  IsVendorBranchUpdated: boolean
})

export interface VendorBranchDeleteResponse {
  IsDeleted: Boolean;
}

export const vendorBranchDeleteResponseDecoder: Decoder<VendorBranchDeleteResponse> = object({
  IsDeleted: boolean
})

export interface BranchInVendorDetail {
  Id: number;
  BranchName: string;
  Address:string;
  GstStateCode:string;
}
export const  branchInVendorDetailDecoder: Decoder<BranchInVendorDetail> = object({
  Id: number,
  BranchName: string,
  Address:string,
  GstStateCode:string
});

export interface BranchInVendorList {
  VendorBranches: BranchInVendorDetail[];
}

export const branchInVendorListDecoder: Decoder<BranchInVendorList> = object({
  VendorBranches: array( branchInVendorDetailDecoder),
});
