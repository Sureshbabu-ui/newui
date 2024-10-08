import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';

export interface CustomerForCreation {
  Id: number | null;
  Name: string;
  CustomerId: number | null;
  NameOnPrint: string;
  CustomerGroupId: string | number | null;
  TenantOfficeId: string | number | null;
  CustomerIndustryId: string | number | null;
  BilledToAddress: string;
  BilledToCityId: string | number | null;
  BilledToStateId: string | number | null;
  BilledToCountryId: string | number | null;
  BilledToPincode: string;
  BilledToGstNumber: string | null;
  ShippedToAddress: string;
  ShippedToCityId: string | number | null;
  ShippedToStateId: string | number | null;
  ShippedToCountryId: string | number | null;
  ShippedToPincode: string | number;
  ShippedToGstNumber: string | null;
  IsContractCustomer: boolean;
  CreditPeriod: string;
  EffectiveFrom: string;
  PrimaryContactName: string;
  PrimaryContactEmail: string;
  PrimaryContactPhone: string;
  SecondaryContactName: string | null;
  SecondaryContactEmail: string | null;
  SecondaryContactPhone: string | null;
  PanNumber: string;
  TinNumber: string;
  TanNumber: string;
  CinNumber: string;
  IsMsme: boolean;
  MsmeRegistrationNumber?: string;
  GstTypeId: null | number;
  GstTypeCode: null | string;
}
export interface MasterDataItems {
  GstType: Select[]
}

export interface CustomerData {
  IsCustomerCreated: Boolean;
  IsApproved: boolean;
}

export const customerDataDecoder: Decoder<CustomerData> = object({
  IsCustomerCreated: boolean,
  IsApproved: boolean,
});

export interface CustomerDetails {
  CustomerId: number;
  CustomerInfoId: number;
  Name: string;
  PrimaryContactPhone: string;
  PrimaryContactEmail: string;
  IsActive: number;
  IsVerified: number;
  CustomerCode: string;
  CreatedBy: number;
}

export const customerDetailsDecoder: Decoder<CustomerDetails> = object({
  CustomerId: number,
  CustomerInfoId: number,
  Name: string,
  PrimaryContactPhone: string,
  PrimaryContactEmail: string,
  IsActive: number,
  IsVerified: number,
  CustomerCode: string,
  CreatedBy: number,
});

export interface MultipleCustomerDetails {
  Customers: CustomerDetails[];
  TotalRows: number;
  PerPage: number;
}

export const multipleCustomerDetailsDecoder: Decoder<MultipleCustomerDetails> = object({
  Customers: array(customerDetailsDecoder),
  TotalRows: number,
  PerPage: number,
});

export interface SelectedCustomerDetails {
  Id: number;
  CustomerId: string | number;
  CustomerCode: string;
  GroupName: string | null;
  Industry: string | null;
  TenantOffice: string;
  Name: string;
  NameOnPrint: string;
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
  PrimaryContactName: string;
  PrimaryContactEmail: string;
  PrimaryContactPhone: string;
  SecondaryContactName: string | null;
  SecondaryContactEmail: string | null;
  SecondaryContactPhone: string | null;
  PanNumber: string;
  TinNumber: string;
  TanNumber: string;
  CinNumber: string;
  IsMsme: Boolean;
  CreatedBy: number;
  MsmeRegistrationNumber: string | null;
  IsContractCustomer: Boolean;
  ModifiedBy: number | null;
  ModifiedOn: string | null;
  EffectiveTo: string | null;
  IsDeleted: Boolean | null;
  IsVerified: Boolean;
  EffectiveFrom: string;
  TenantOfficeId: number;
  CreatedOn: string;
}

export const selectedcustomerDetailDecoder: Decoder<SelectedCustomerDetails> = object({
  Id: number,
  CustomerId: number,
  CustomerCode: string,
  GroupName: nullable(string),
  Industry: nullable(string),
  TenantOffice: string,
  Name: string,
  NameOnPrint: string,
  TenantOfficeId: number,
  PrimaryContactName: string,
  PrimaryContactEmail: string,
  PrimaryContactPhone: string,
  SecondaryContactName: nullable(string),
  SecondaryContactEmail: nullable(string),
  SecondaryContactPhone: nullable(string),
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
  PanNumber: string,
  TinNumber: string,
  TanNumber: string,
  CinNumber: string,
  IsMsme: boolean,
  MsmeRegistrationNumber: nullable(string),
  IsContractCustomer: boolean,
  CreatedBy: number,
  CreatedOn: string,
  ModifiedBy: nullable(number),
  ModifiedOn: nullable(string),
  EffectiveTo: nullable(string),
  EffectiveFrom: string,
  IsDeleted: nullable(boolean),
  IsVerified: boolean,

});

export interface SelectedCustomer {
  CustomerDetails: SelectedCustomerDetails;
}

export const selectedcustomerDetailsDecoder: Decoder<SelectedCustomer> = object({
  CustomerDetails: selectedcustomerDetailDecoder,
});

export interface CustomerCodeExist {
  IsCustomerCodeExist: Boolean;
}

export const customerCodeExistDecoder: Decoder<CustomerCodeExist> = object({
  IsCustomerCodeExist: boolean,
});

export interface ExistingCustomer {
  Name: string;
  SCORE: number;
  CustomerCode: string | null;
  BilledToAddress: string;
  IsVerified: boolean;
  CreatedOn: string;
}

export const customerExistDecoder: Decoder<ExistingCustomer> = object({
  Name: string,
  SCORE: number,
  BilledToAddress: string,
  CustomerCode: nullable(string),
  IsVerified: boolean,
  CreatedOn: string,
});

export interface MultipleExistingCustomer {
  ExistingCustomerDetails: ExistingCustomer[];
}

export const MultipleExistingCustomerDecoder: Decoder<MultipleExistingCustomer> = object({
  ExistingCustomerDetails: array(customerExistDecoder),
});

export interface CustomerSites {
  Id: number;
  SiteName: string;
  Address: string | null;
}

export const customersitesDecoder: Decoder<CustomerSites> = object({
  Id: number,
  SiteName: string,
  Address: nullable(string),
});

export interface MultipleCustomerSites {
  ContractCustomerSites: CustomerSites[];
}

export const multipleCustomerSitesDecoder: Decoder<MultipleCustomerSites> = object({
  ContractCustomerSites: array(customersitesDecoder),
});

export interface CustomerSiteDetails {
  Id: number;
  SiteName: string;
  Address: string;
  PrimaryContactPhone: string;
  PrimaryContactName: string;
}

export const customerSiteDetailsDecoder: Decoder<CustomerSiteDetails> = object({
  Id: number,
  SiteName: string,
  Address: string,
  PrimaryContactPhone: string,
  PrimaryContactName: string,
});

export interface MultipleCustomerSiteDetails {
  CustomerSiteList: CustomerSiteDetails[];
  TotalRows: number;
  PerPage: number;
}

export const multipleCustomerSiteDetailsDecoder: Decoder<MultipleCustomerSiteDetails> = object({
  CustomerSiteList: array(customerSiteDetailsDecoder),
  TotalRows: number,
  PerPage: number,
});

export interface CustomerSiteCreate {
  CustomerId: string;
  SiteName: string;
  Address: string;
  CityId: number | null;
  StateId: number | null;
  Pincode: string;
  GeoLocation: string;
  TenantOfficeId: number | string;
  PrimaryContactName: string;
  PrimaryContactPhone: string;
  PrimaryContactEmail: string;
  SecondaryContactName: string;
  SecondaryContactPhone: string;
  SecondaryContactEmail: string;
}

export interface IsCustomerSiteCreated {
  IsCustomerSiteCreated: Boolean;
}

export const isCustomerSiteCreatedDecoder: Decoder<IsCustomerSiteCreated> = object({
  IsCustomerSiteCreated: boolean,
});

export interface CustomerSiteList {
  Id: number;
  SiteName: string;
  Address: string;
}

export interface CustomerSiteListArray extends Array<CustomerSiteList> { }

export const customerSiteListDecoder: Decoder<CustomerSiteList> = object({
  Id: number,
  SiteName: string,
  Address: string,
});

export const customerSiteListDecoderArray: Decoder<CustomerSiteListArray> = array(customerSiteListDecoder);

export interface MultipleCustomerSiteList {
  CustomerSiteList: CustomerSiteList[];
}

export const multipleCustomerSiteListDecoder: Decoder<MultipleCustomerSiteList> = object({
  CustomerSiteList: array(customerSiteListDecoder),
});

//TODO
//Remove Later
export interface EntityDetails {
  Id: number;
  Name: string;
}

export const entityDetailsDecoder: Decoder<EntityDetails> = object({
  Id: number,
  Name: string,
});

export interface CustomerList {
  Id: number;
  Name: string;
  BilledToAddress: string;
  CustomerCode: string;
}

export const customersDetailsDecoder: Decoder<CustomerList> = object({
  Id: number,
  Name: string,
  BilledToAddress: string,
  CustomerCode: string,
});

export interface Customer {
  CustomersList: CustomerList[];
}

export const customerDecoder: Decoder<Customer> = object({
  CustomersList: array(customersDetailsDecoder),
});

export interface CustomerSiteNameArray extends Array<CustomerSiteNames> { }

export const customerSiteNamesDecoder: Decoder<CustomerSiteNames> = object({
  Id: number,
  SiteName: string,
  Address: string,
});
export interface CustomerSiteNames {
  Id: number;
  SiteName: string;
  Address: string;
}

export const customerSiteNamesDecoderArray: Decoder<CustomerSiteNameArray> = array(customerSiteNamesDecoder);

export interface MultipleCustomerSiteNames {
  CustomerSitesNames: CustomerSiteNames[];
}

export const multipleCustomerSitesNameDecoder: Decoder<MultipleCustomerSiteNames> = object({
  CustomerSitesNames: array(customerSiteNamesDecoder),
});

export interface ClickedCustomerDetails {
  Id: number;
  Name: string | null;
  CustomerId: string | number | null;
  CustomerCode: string | null;
  NameOnPrint: string | null;
  BilledToAddress: string | null;
  BilledToCityId: string | number | null;
  BilledToStateId: string | number | null;
  BilledToCountryId: string | number | null;
  CustomerGroupId: string | number | null | string;
  BilledToPincode: string | null;
  BilledToGstNumber: string | null;
  ShippedToAddress: string | null;
  ShippedToPincode: string | null;
  ShippedToCityId: string | number | null;
  ShippedToStateId: string | number | null;
  ShippedToCountryId: string | number | null;
  ShippedToGstNumber: string | null;
  PrimaryContactName: string | null;
  PrimaryContactEmail: string | null;
  PrimaryContactPhone: string | null;
  SecondaryContactName: string | null;
  SecondaryContactEmail: string | null;
  SecondaryContactPhone: string | null;
  PanNumber: string | null;
  TinNumber: string | null;
  TanNumber: string | null;
  CinNumber: string | null;
  IsMsme: Boolean;
  MsmeRegistrationNumber: string | null;
  IsContractCustomer: boolean | null;
  TenantOfficeId: number | null;
  CustomerIndustryId: number | null;
  GstTypeId: null | number;
  GstTypeCode: null | string;
}

export const clickedCustomerDecoder: Decoder<ClickedCustomerDetails> = object({
  Id: number,
  Name: string,
  CustomerId: string,
  CustomerCode: string,
  CustomerGroupId: nullable(number),
  CustomerIndustryId: nullable(number),
  NameOnPrint: string,
  TenantOfficeId: number,
  PrimaryContactName: string,
  PrimaryContactEmail: string,
  PrimaryContactPhone: string,
  SecondaryContactName: nullable(string),
  SecondaryContactEmail: nullable(string),
  SecondaryContactPhone: nullable(string),
  BilledToCityId: number,
  BilledToStateId: number,
  BilledToCountryId: number,
  BilledToAddress: string,
  BilledToPincode: string,
  BilledToGstNumber: string,
  ShippedToAddress: string,
  ShippedToCityId: number,
  ShippedToStateId: number,
  ShippedToCountryId: number,
  ShippedToPincode: string,
  ShippedToGstNumber: string,
  PanNumber: string,
  TinNumber: string,
  TanNumber: string,
  CinNumber: string,
  IsMsme: boolean,
  MsmeRegistrationNumber: nullable(string),
  IsContractCustomer: boolean,
  GstTypeId: nullable(number),
  GstTypeCode: nullable(string)
});

export interface SelectedCustomerData {
  CustomerDetails: ClickedCustomerDetails;
}

export const selectedcustomerDataDecoder: Decoder<SelectedCustomerData> = object({
  CustomerDetails: clickedCustomerDecoder,
});

export interface CustomerEditResponse {
  IsUpdated: Boolean;
}

export const customerEditDecoder: Decoder<CustomerEditResponse> = object({
  IsUpdated: boolean,
});

export interface ApproveCustomer {
  IsApproved: Boolean;
}

export const approveCustomerDecoder: Decoder<ApproveCustomer> = object({
  IsApproved: boolean,
});

export interface Select {
  value: any;
  label: any;
  code?: any;
}

export interface SelectDetails {
  Select: Select[];
}

export interface ContractCustomerSiteCount {
  contractcustomersitecount: number;
}

export const contractcustomersitecountDecoder: Decoder<ContractCustomerSiteCount> = object({
  contractcustomersitecount: number,
});

export interface CustomerNamesByFilterDetail {
  Id: number;
  NameOnPrint: string;
}

export const customerNamesByFilterDetailDecoder: Decoder<CustomerNamesByFilterDetail> = object({
  Id: number,
  NameOnPrint: string,
});

export interface CustomerNamesByFilter {
  CustomerNamesByFilter: CustomerNamesByFilterDetail[];
}

export const customerNamesByFilterDecoder: Decoder<CustomerNamesByFilter> = object({
  CustomerNamesByFilter: array(customerNamesByFilterDetailDecoder),
});

export interface CustomerDataDraft {
  IsCustomerCreated: Boolean;
}

export const customerDataDraftDecoder: Decoder<CustomerDataDraft> = object({
  IsCustomerCreated: boolean,
});

