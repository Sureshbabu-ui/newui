import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface VendorForCreation {
  Name: string | number;
  IsMsme: boolean;
  Address: string | number;
  TenantOfficeId: number | string;
  CityId: number | null;
  CountryId: number | null;
  StateId: null | number;
  Pincode: string | number;
  ContactName: string | number;
  Email: string | number;
  ContactNumberOneCountryCode: string | number;
  ContactNumberOne: string | number;
  ContactNumberTwoCountryCode: string | number;
  ContactNumberTwo: string | number;
  CreditPeriodInDays: number | string;
  GstNumber: string | number;
  GstVendorTypeId: number | string;
  ArnNumber: string | number;
  EsiNumber: string | number;
  PanNumber: string | number;
  PanTypeId: number | string;
  VendorTypeId: number | string;
  TanNumber: string | number;
  CinNumber: string | number;
  MsmeRegistrationNumber: string | number;
  MsmeCommencementDate: string | null;
  MsmeExpiryDate: string | null;
  GstVendorTypeCode?: string;
}

export interface Select {
  value: any,
  label: any,
  code?: any
}

export interface SelectDetails {
  Select: Select[]
}

export interface VendorSelectDetails {
  States: Select[],
  Countrys: Select[],
  Cities: Select[],
  Location: Select[],
  GstVendorType: Select[],
  PanType: Select[],
  PrimaryCountryCode: Select[],
  VendorType: Select[]
}

export interface VendorSearchForFilter {
  SearchText: string;
}

export interface VendorList {
  Id: number;
  VendorCode: string;
  VendorId: number;
  Name: string;
  VendorType:string | null;
  City: string;
  ContactNumberOne: string;
  ContactNumberOneCountryCode: string;
  ContactName: string;
  TenantLocation: string;
  IsActive: boolean;
}

export const vendorDetailsDecoder: Decoder<VendorList> = object({
  Id: number,
  VendorCode: string,
  VendorId: number,
  Name: string,
  VendorType:nullable(string),
  City: string,
  ContactNumberOneCountryCode: string,
  ContactNumberOne: string,
  ContactName: string,
  TenantLocation: string,
  IsActive: boolean,
});

export interface MultipleVendorDetails {
  Vendors: VendorList[];
  TotalRows: number;
  PerPage: number;
}

export const multipleVendorDetailsDecoder: Decoder<MultipleVendorDetails> = object({
  Vendors: array(vendorDetailsDecoder),
  TotalRows: number,
  PerPage: number
});

export interface ResponseVendorData {
  IsVendorCreated: Boolean;
}

export const responseVendorDataDecoder: Decoder<ResponseVendorData> = object({
  IsVendorCreated: boolean
})

export interface VendorEdit {
  Id: number,
  VendorId: number,
  Name: string
  Address: string
  TenantOfficeId: number | string;
  CityId: number | string;
  StateId: string | number;
  CountryId: string | number;
  Pincode: string;
  ContactName: string
  Email: string
  ContactNumberOneCountryCode: string | number;
  ContactNumberOne: string | number;
  ContactNumberTwoCountryCode: string | number;
  ContactNumberTwo: string | number;
  CreditPeriodInDays: number | string;
  GstNumber: string | number;
  GstVendorTypeId: number | string;
  ArnNumber: string | null;
  EsiNumber: string | null;
  PanNumber: string;
  PanTypeId: number;
  VendorTypeId: number | null;
  TanNumber: string | null;
  CinNumber: string | null;
  IsMsme: boolean;
  IsActive: boolean;
  MsmeRegistrationNumber: string | null;
  MsmeCommencementDate: string | null;
  MsmeExpiryDate: string | null;
  GstVendorTypeCode: string;
}

export const vendorEditDecoder: Decoder<VendorEdit> = object({
  Id: number,
  VendorId: number,
  Name: string,
  Address: string,
  TenantOfficeId: number,
  CityId: number,
  StateId: number,
  CountryId: number,
  Pincode: string,
  ContactName: string,
  Email: string,
  IsMsme: boolean,
  IsActive: boolean,
  ContactNumberOneCountryCode: string,
  ContactNumberOne: string,
  ContactNumberTwoCountryCode: string,
  ContactNumberTwo: string,
  CreditPeriodInDays: number,
  GstNumber: string,
  GstVendorTypeId: number,
  ArnNumber: nullable(string),
  EsiNumber: nullable(string),
  PanNumber: string,
  PanTypeId: number,
  VendorTypeId: nullable(number),
  TanNumber: nullable(string),
  CinNumber: nullable(string),
  MsmeRegistrationNumber: nullable(string),
  MsmeCommencementDate: nullable(string),
  MsmeExpiryDate: nullable(string),
  GstVendorTypeCode: string
})

export interface VendorEditDetails {
  VendorDetails: VendorEdit;
}

export const vendorEditDetailsDecoder: Decoder<VendorEditDetails> = object({
  VendorDetails: vendorEditDecoder
})

export interface ResponseVendorUpdateData {
  IsVendorUpdated: Boolean;
}

export const responseVendorUpdateDataDecoder: Decoder<ResponseVendorUpdateData> = object({
  IsVendorUpdated: boolean
})

export interface GstVendorDetail {
  Id: number,
  Name: string
}

export const gstVendorDetailDecoder: Decoder<GstVendorDetail> = object({
  Id: number,
  Name: string
});

export interface GstVendorDetails {
  GstVendorTypes: GstVendorDetail[];
}

export const gstVendorDetailsDecoder: Decoder<GstVendorDetails> = object({
  GstVendorTypes: array(gstVendorDetailDecoder)
})

export interface SelectedVendorDetail {
  OfficeName: string;
  Name: string
  Address: string
  City: string;
  State: string;
  Pincode: string
  ContactName: string
  Email: string
  ContactNumberOneCountryCode: string;
  ContactNumberOne: string;
  ContactNumberTwoCountryCode: string | null;
  ContactNumberTwo: string | null;
  CreditPeriodInDays: number;
  GstNumber: string;
  GstVendorType: string | null;
  VendorType: string | null;
  ArnNumber: string | null;
  EsiNumber: string | null;
  PanNumber: string | null;
  PanType: null | string;
  TanNumber: string | null;
  CinNumber: string | null;
  IsMsme: boolean;
  MsmeRegistrationNumber: string | null;
  MsmeCommencementDate: string | null;
  MsmeExpiryDate: string | null;
}

export const selectedVendorDetailDecoder: Decoder<SelectedVendorDetail> = object({
  OfficeName: string,
  Name: string,
  Address: string,
  City: string,
  State: string,
  Pincode: string,
  ContactName: string,
  Email: string,
  IsMsme: boolean,
  ContactNumberOneCountryCode: string,
  ContactNumberOne: string,
  ContactNumberTwoCountryCode: nullable(string),
  ContactNumberTwo: nullable(string),
  CreditPeriodInDays: number,
  GstNumber: string,
  GstVendorType: string,
  VendorType: nullable(string),
  ArnNumber: nullable(string),
  EsiNumber: nullable(string),
  PanNumber: nullable(string),
  PanType: nullable(string),
  TanNumber: nullable(string),
  CinNumber: nullable(string),
  MsmeRegistrationNumber: nullable(string),
  MsmeCommencementDate: nullable(string),
  MsmeExpiryDate: nullable(string),
});

export interface selectedVendorDetails {
  VendorDetails: SelectedVendorDetail;
}

export const selectedVendorDetailsDecoder: Decoder<selectedVendorDetails> = object({
  VendorDetails: selectedVendorDetailDecoder
})

export interface ResponseVendorDeleted {
  IsDeleted: Boolean;
}

export const responseVendorDeletedDecoder: Decoder<ResponseVendorDeleted> = object({
  IsDeleted: boolean
})

export interface VendorNameList {
  Id: number;
  Name: string;
  Address: string;
  GstStateCode: string;
}

export const vendorNameListDecoder: Decoder<VendorNameList> = object({
  Id: number,
  Name: string,
  Address: string,
  GstStateCode: string
});

export interface VendorNames {
  VendorNames: VendorNameList[];
}

export const vendorNameDecoder: Decoder<VendorNames> = object({
  VendorNames: array(vendorNameListDecoder),
});