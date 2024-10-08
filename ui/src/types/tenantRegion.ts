import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface TenantRegionsCreate {
    Code: string | number;
    RegionName: string | number;
    TenantId: number | string;
    OfficeName: string;
    GeoLocation: string;
    Address: string;
    CityId: number | null;
    StateId: number | null;
    CountryId: number | null;
    Pincode: string;
    Phone: string;
    Email: string;
    Mobile: string;
    ManagerId: string;
    GstNumber: string;
    GstStateId: number | null;
    Tin: string;
}

export interface TenantRegionsEdit {
    Id: number;
    Code: string;
    RegionName: string;
    TenantOfficeInfoId: number;
    TenantOfficeId: number;
    OfficeName: string;
    Address: string;
    StateId: number;
    CityId: number;
    CountryId: number;
    Pincode: string;
    Phone: string;
    Email: string;
    Mobile: string;
    ManagerId: number;
    GstNumber: string;
    GstStateId: number;
    Tin: string | null;
    IsActive: boolean;
}

export interface TenantRegionList {
    Id: number;
    Code: string;
    RegionName: string;
    TenantLocation: string;
    RegionAddress: string;
    Pincode: string | null;
    StateName: string | null;
    CityName: string | null;
    IsActive: boolean;
}
export const tenantRegionListDecoder: Decoder<TenantRegionList> = object({
    Id: number,
    Code: string,
    RegionName: string,
    TenantLocation: string,
    RegionAddress: string,
    Pincode: nullable(string),
    StateName: nullable(string),
    CityName: nullable(string),
    IsActive: boolean
});

export interface TenantRegions {
    TenantRegions: TenantRegionList[],
    totalRows: number;
    PerPage: number;
}

export const tenantRegionsDecoder: Decoder<TenantRegions> = object({
    TenantRegions: array(tenantRegionListDecoder),
    totalRows: number,
    PerPage: number
});

export interface Select {
    value: any,
    label: any
}

export interface SelectDetails {
    Select: Select[]
}

export interface TenantRegionCreateResult {
    IsTenantRegionCreated: Boolean;
}

export const tenantregionCreateDecoder: Decoder<TenantRegionCreateResult> = object({
    IsTenantRegionCreated: boolean,
});

export interface TenantRegionDetails {
    Id: number;
    Code: string;
    RegionName: string;
    TenantOfficeInfoId: number;
    TenantOfficeId: number;
    OfficeName: string;
    Address: string;
    StateId: number;
    CityId: number;
    CountryId: number;
    Pincode: string;
    Phone: string;
    Email: string;
    Mobile: string;
    ManagerId: number;
    GstNumber: string;
    GstStateId: number;
    Tin: string | null;
    IsActive: boolean;
}
export const tenantRegionDetailsDecoder: Decoder<TenantRegionDetails> = object({
    Id: number,
    Code: string,
    RegionName: string,
    TenantOfficeInfoId: number,
    TenantOfficeId: number,
    OfficeName: string,
    Address: string,
    StateId: number,
    CityId: number,
    CountryId: number,
    Pincode: string,
    Phone: string,
    Email: string,
    Mobile: string,
    ManagerId: number,
    GstNumber: string,
    GstStateId: number,
    Tin: nullable(string),
    IsActive: boolean
});

export interface SelectedRegion {
    RegionDetails: TenantRegionDetails,
}

export const selectedRegionDecoder: Decoder<SelectedRegion> = object({
    RegionDetails: tenantRegionDetailsDecoder,
});

export interface RegionEditResponse {
    isUpdated: Boolean;
}

export const regionEditDecoder: Decoder<RegionEditResponse> = object({
    isUpdated: boolean,
});

export interface EntityDetails {
    Id: number;
    RegionName: string;
    Code: string;
}

export const entityDetailsDecoder: Decoder<EntityDetails> = object({
    Id: number,
    RegionName: string,
    Code: string
});

export interface RegionNames {
    RegionNames: EntityDetails[];
}

export const regionNamesNamesDecoder: Decoder<RegionNames> = object({
    RegionNames: array(entityDetailsDecoder),
});

export interface ResponseTenantRegionDeleted {
    IsDeleted: Boolean;
}

export const responseTenantRegionDeletedDecoder: Decoder<ResponseTenantRegionDeleted> = object({
    IsDeleted: boolean
})  