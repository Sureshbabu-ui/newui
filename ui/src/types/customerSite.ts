import { Decoder, array, boolean, dict, nullable, number, object, string } from "decoders";

export interface SiteDocumentUpload {
    CustomerId: string;
    DocumentFile: File | null;
}

export interface SelectedSiteDetails {
    SiteName: string | null;
    SiteNameId: number | null;
    CustomerId: number,
    Address: string | null;
    AddressOne: string | null;
    AddressTwo: string | null;
    AddressThree: string | null;
    CityId: number | null;
    StateId: number | null;
    Pincode: string | null;
    Telephone: string | null;
    LocationId: number | null;
    ContactPersonOne: string | null;
    ContactPersonTwo: string | null;
    EmailOne: string | null;
    EmailTwo: string | null;
    IsReRequiredId: boolean;
}

export interface SiteDetails {
    Id: number,
    CustomerId: number,
    ContractNumber: string | null,
    IsContractNumValid: boolean,
    SiteName: string | null;
    SiteNameId: number | null;
    IsSiteNameExist: boolean;
    Address: string | null;
    AddressOne: string | null;
    AddressTwo: string | null;
    AddressThree: string | null;
    City: string | null;
    State: string | null;
    CityId: number | null;
    StateId: number | null;
    Pincode: string | null;
    Telephone: string | null;
    IsPincodeValid: boolean;
    IsTelephoneValid: boolean;
    ContactPersonOne: string | null;
    ContactPersonTwo: string | null;
    EmailOne: string | null;
    EmailTwo: string | null;
    Location: string | null;
    LocationId: number | null;
    IsReRequired: string | null;
    IsReRequiredId: boolean;
    IsReRequiredValid: boolean;
}

export const siteDetailsDecoder: Decoder<SiteDetails> = object({
    Id: number,
    CustomerId: number,
    ContractNumber: nullable(string),
    IsContractNumValid: boolean,
    SiteName: nullable(string),
    SiteNameId: nullable(number),
    IsSiteNameExist: boolean,
    Address: nullable(string),
    AddressOne: nullable(string),
    AddressTwo: nullable(string),
    AddressThree: nullable(string),
    City: nullable(string),
    State: nullable(string),
    CityId: nullable(number),
    StateId: nullable(number),
    Pincode: nullable(string),
    Telephone: nullable(string),
    IsPincodeValid: boolean,
    IsTelephoneValid: boolean,
    ContactPersonOne: nullable(string),
    ContactPersonTwo: nullable(string),
    EmailOne: nullable(string),
    EmailTwo: nullable(string),
    Location: nullable(string),
    LocationId: nullable(number),
    IsReRequired: nullable(string),
    IsReRequiredId: boolean,
    IsReRequiredValid: boolean,
})

export interface SiteData {
    SiteDetails: SiteDetails[]
    ContractId: number | null
    CustomerSiteValidations: Record<number, string[] | null>
}

export const siteDataDecoder: Decoder<SiteData> = object({
    SiteDetails: array(siteDetailsDecoder),
    ContractId: nullable(number),
    CustomerSiteValidations: dict(array(string))
});

export interface IsCustomerSiteCreated {
    IsCustomerSiteCreated: Boolean;
}

export const isCustomerSiteCreatedDecoder: Decoder<IsCustomerSiteCreated> = object({
    IsCustomerSiteCreated: boolean,
});

export interface CustomerSiteDeleted {
    IsDeleted: Boolean;
}

export const customerSiteDeletedDecoder: Decoder<CustomerSiteDeleted> = object({
    IsDeleted: boolean,
});

export interface SiteExistCheck {
    IsSiteExist: number;
}

export const siteExistCheckDecoder: Decoder<SiteExistCheck> = object({
    IsSiteExist: number,
});

export interface ClickedCustomerSiteDetails {
    Id: number;
    CustomerId: number;
    SiteName: string;
    Address: string;
    CityId: number;
    StateId: number;
    Pincode: string;
    GeoLocation: string | null;
    TenantOfficeId: number;
    PrimaryContactName: string;
    PrimaryContactPhone: string;
    PrimaryContactEmail: string | null;
    SecondaryContactName: string | null;
    SecondaryContactPhone: string | null;
    SecondaryContactEmail: string | null;
}

export const clickedCustomerSiteDecoder: Decoder<ClickedCustomerSiteDetails> = object({
    Id: number,
    CustomerId: number,
    SiteName: string,
    Address: string,
    CityId: number,
    StateId: number,
    Pincode: string,
    GeoLocation: nullable(string),
    TenantOfficeId: number,
    PrimaryContactName: string,
    PrimaryContactPhone: string,
    PrimaryContactEmail: nullable(string),
    SecondaryContactName: nullable(string),
    SecondaryContactPhone: nullable(string),
    SecondaryContactEmail: nullable(string),
});

export interface SelectedCustomerSiteData {
    CustomerSiteDetails: ClickedCustomerSiteDetails;
}

export const selectedcustomerSiteDataDecoder: Decoder<SelectedCustomerSiteData> = object({
    CustomerSiteDetails: clickedCustomerSiteDecoder,
});

export interface UpdateCustomerSiteResponse {
    IsUpdated: Boolean;
}

export const updateCustomerSiteResponseDecoder: Decoder<UpdateCustomerSiteResponse> = object({
    IsUpdated: boolean,
});

export interface CustomerSiteReport {
    ContractId: number;
    CustomerId: number;
    TenantRegionId: number;
    TenantOfficeId: number;
}

export interface CustomerSiteNamesByFilterDetail {
    Id: number;
    SiteName: string;
}

export const customerSiteNamesByFilterDetailDecoder: Decoder<CustomerSiteNamesByFilterDetail> = object({
    Id: number,
    SiteName: string,
});

export interface CustomerSiteNamesByFilter {
    CustomerSiteNames: CustomerSiteNamesByFilterDetail[];
}

export const customerSiteNamesByFilterDecoder: Decoder<CustomerSiteNamesByFilter> = object({
    CustomerSiteNames: array(customerSiteNamesByFilterDetailDecoder),
});