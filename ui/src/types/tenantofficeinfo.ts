import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface TenantOfficeCreate {
  TenantId: number | string;
  Code: string;
  OfficeName: string;
  RegionId: string | number | null;
  OfficeTypeId: number | string;
  GeoLocation: string;
  Address: string;
  CityId: number | string| null;
  StateId: number | string| null;
  CountryId: number | string| null;
  Pincode: string | null;
  Phone: string;
  Email: string;
  Mobile: string;
  ManagerId: string;
  GstNumber: string;
  GstStateId: number | string | null;
  Tin: string;
}

export interface TenantInfoDetails {
  Id: number;
  Address: string;
  OfficeName: string;
}

export const tenantinfoDetailsDecoder: Decoder<TenantInfoDetails> = object({
  Id: number,
  Address: string,
  OfficeName: string
});

export interface TenantOfficeInfo {
  TenantOfficeInfo: TenantInfoDetails[];
}

export const tenantOfficeInfoDecoder: Decoder<TenantOfficeInfo> = object({
  TenantOfficeInfo: array(tenantinfoDetailsDecoder),
});

export interface TenantInfoName {
  Id: number;
  OfficeName: string;
  Address: string;
}

export const tenantinfoNameDecoder: Decoder<TenantInfoName> = object({
  Id: number,
  OfficeName: string,
  Address: string
});

export interface TenantOfficeNameInfo {
  TenantOfficeName: TenantInfoName[];
}

export const tenantOfficeInfoNameDecoder: Decoder<TenantOfficeNameInfo> = object({
  TenantOfficeName: array(tenantinfoNameDecoder),
});

export interface TenantOfficeInfoDetails {
  Id: number;
  OfficeName: string;
  Address: string;
  CityName: string;
  StateName: string;
  Pincode: string;
  ManagerName: string;
  RegionName: string | null;
  IsVerified: boolean;
}
export const tenantOfficeDetailsDecoder: Decoder<TenantOfficeInfoDetails> = object({
  Id: number,
  OfficeName: string,
  Address: string,
  CityName: string,
  StateName: string,
  Pincode: string,
  ManagerName: string,
  RegionName: nullable(string),
  IsVerified: boolean
});

export interface TenantOfficeList {
  TenantOffices: TenantOfficeInfoDetails[],
  totalRows: number;
  PerPage: number;
}

export const tenantOfficeListDecoder: Decoder<TenantOfficeList> = object({
  TenantOffices: array(tenantOfficeDetailsDecoder),
  totalRows: number,
  PerPage: number
});

export interface TenantOfficeCreateResult {
  IsTenantOfficeCreated: Boolean;
}

export const tenantOfficeCreateDecoder: Decoder<TenantOfficeCreateResult> = object({
  IsTenantOfficeCreated: boolean,
});

export interface Managers {
  Id: number;
  FullName: string;
}

export const managersDecoder: Decoder<Managers> = object({
  Id: number,
  FullName: string,
});

export interface ManagersList {
  Managers: Managers[];
}

export const managerDecoder: Decoder<ManagersList> = object({
  Managers: array(managersDecoder),
});

export interface EntitiesDetails {
  Id: number;
  FullName: string;
}
export interface Configurations {
  Managers: EntitiesDetails[],
  TenantRegions: TenantRegion[];
}

export interface TenantRegion {
  Id: number;
  RegionName: string;
  Code?: string;
}

export const tenantregionDecoder: Decoder<TenantRegion> = object({
  Id: number,
  RegionName: string,
  Code: string
});

export interface TenantRegions {
  TenantRegionNames: TenantRegion[],
}

export interface TenantOfficeView {
  Id: number;
  TenantOfficeId: number;
  Code: string;
  TenantOfficeName: string;
  RegionName: string | number | null;
  TenantOfficeType: number | string;
  GeoLocation: string | null;
  Address: string;
  City: number | string;
  State: number | string;
  Country: number | string;
  Pincode: string;
  Phone: string;
  Email: string;
  Mobile: string;
  Manager: string;
  GstNumber: string;
  GstState: number | string;
  Tin: null | string;
  EffectiveFrom: string;
  EffectiveTo: string | null;
  CreatedBy: string;
  CreatedOn: string;
  IsVerified: Boolean;
}

export const tenantOfficeViewDecoder: Decoder<TenantOfficeView> = object({
  Id: number,
  TenantOfficeId: number,
  Code: string,
  TenantOfficeName: string,
  RegionName: nullable(string),
  TenantOfficeType: string,
  GeoLocation: nullable(string),
  Address: string,
  City: string,
  State: string,
  Country: string,
  Pincode: string,
  Phone: string,
  Email: string,
  Mobile: string,
  Manager: string,
  GstNumber: string,
  GstState: string,
  Tin: nullable(string),
  EffectiveFrom: string,
  EffectiveTo: nullable(string),
  CreatedBy: string,
  CreatedOn: string,
  IsVerified: boolean
})

export interface SelectedTenantOffice {
  LocationDetails: TenantOfficeView
}

export const selectedTenantOfficeDecoder: Decoder<SelectedTenantOffice> = object({
  LocationDetails: tenantOfficeViewDecoder,
});
export interface SelectTenantOffice {
  value: any,
  label: any,
  code?: any
}

export interface SelectDetails {
  Select: SelectTenantOffice[]
}

export interface ResponseTenantOfficeDeleted {
  IsDeleted: Boolean;
}

export const responseTenantOfficeDeletedDecoder: Decoder<ResponseTenantOfficeDeleted> = object({
  IsDeleted: boolean
})

export interface TenantOfficeEdit {
  Id: number;
  TenantOfficeId: number;
  Address: string;
  OfficeName: string;
  Code: string;
  CityId: number | string;
  StateId: number | string;
  CountryId: number | string;
  Pincode: string;
  Phone: string;
  Email: string;
  Mobile: string;
  ManagerId: number;
  GstNumber: string;
  GstStateId: number | string;
  Tin: string | null;
}

export const tenantOfficeEditDecoder: Decoder<TenantOfficeEdit> = object({
  Id: number,
  TenantOfficeId: number,
  OfficeName: string,
  Code: string,
  Address: string,
  CityId: number,
  StateId: number,
  CountryId: number,
  Pincode: string,
  Phone: string,
  Email: string,
  Mobile: string,
  ManagerId: number,
  GstNumber: string,
  GstStateId: number,
  Tin: nullable(string),
})

export interface TenantOfficeEditDetails {
  LocationDetails: TenantOfficeEdit
}

export const tenantOfficeEditDetailsDecoder: Decoder<TenantOfficeEditDetails> = object({
  LocationDetails: tenantOfficeEditDecoder,
});

export interface TenantOfficeUpdateResult {
  IsTenantOfficeUpdated: Boolean;
}

export const tenantOfficeUpdateDecoder: Decoder<TenantOfficeUpdateResult> = object({
  IsTenantOfficeUpdated: boolean,
});