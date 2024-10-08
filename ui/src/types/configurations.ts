import { LookupDataEdit } from './../components/Pages/LookupData/LookupDataEdit/LookupDataEdit';
import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';

export interface ConfigurationUpdateField {
  Code: string;
  Name: string;
  IsActive: number;
  EntityId: number;
}

export interface LookupDataUpdate {
  Name: string;
  IsActive: number;
  Id: number;
}

export interface EntitiesList {
  Id:number;
  EntityType: string;  
}

export const entitiesListDecoder: Decoder<EntitiesList> = object({
   Id:number,
   EntityType: string,
});

export interface EntitiesLists {
  EntitiesLists: EntitiesList[];
  TotalRows:number;
  PerPage:number
}

export const entitiesListsDecoder: Decoder<EntitiesLists> = object({
  EntitiesLists: array(entitiesListDecoder),
  TotalRows:number,
  PerPage:number
});

export interface SelectedTableData {
  Id: number;
  Code: string;
  Name: string;
  IsActive :boolean;
  IsSystemData:boolean;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy: null | number;
  ModifiedOn: null | string;
}

export const selectedTableDataDecoder: Decoder<SelectedTableData> = object({
  Id: number,
  Code: string,
  Name: string,
  IsSystemData:boolean,
  IsActive: boolean,
  CreatedBy: number,
  CreatedOn: string,
  ModifiedBy: nullable(number),
  ModifiedOn: nullable(string),
});

export interface SelectedTableDetails {
  selectedTableDetails: SelectedTableData[];
}

export const selectedTableDetailsDecoder: Decoder<SelectedTableDetails> = object({
  selectedTableDetails: array(selectedTableDataDecoder),
});

export interface ConfigurationsResponse {
  isUpdated: Boolean;
}

export const configurationsResponseDecoder: Decoder<ConfigurationsResponse> = object({
  isUpdated: boolean,
});

export interface CreateConfigurationResponse {
  IsCreated: Boolean;
}
export const createconfigurationResponseDecoder: Decoder<CreateConfigurationResponse> = object({
  IsCreated: boolean
});

export interface UpdateConfigurationResponse {
  IsUpdated: Boolean;
}
export const updateconfigurationResponseDecoder: Decoder<UpdateConfigurationResponse> = object({
  IsUpdated: boolean
});

export interface LookupDataDelete {
  IsDeleted: Boolean;
}
export const lookupdataDeleteDecoder: Decoder<LookupDataDelete> = object({
  IsDeleted: boolean
});

// For Create Contract start

export interface EntityDetails {
  Id: number;
  Name: string;
}

export const entityDetailsDecoder: Decoder<EntityDetails> = object({
  Id: number,
  Name: string,
});

export interface AgreementTypes {
  AgreementTypes: EntityDetails[];
}

export const agreementTypesDecoder: Decoder<AgreementTypes> = object({
  AgreementTypes: array(entityDetailsDecoder),
});

export interface BookingTypes {
  BookingTypes: EntityDetails[];
}

export const bookingTypesDecoder: Decoder<BookingTypes> = object({
  BookingTypes: array(entityDetailsDecoder),
});

export interface ServiceModes {
  ServiceModes: EntityDetails[];
}

export const serviceModesDecoder: Decoder<ServiceModes> = object({
  ServiceModes: array(entityDetailsDecoder),
});

export interface PaymentModes {
  PaymentModes: EntityDetails[];
}

export const paymentModesDecoder: Decoder<PaymentModes> = object({
  PaymentModes: array(entityDetailsDecoder),
});

export interface PaymentFrequencies {
  PaymentFrequencies: EntityDetails[];
}

export const paymentFrequenciesDecoder: Decoder<PaymentFrequencies> = object({
  PaymentFrequencies: array(entityDetailsDecoder),
});

export interface PreventiveMaintenanceFrequencies {
  PreventiveMaintenanceFrequencies: EntityDetails[];
}

export const preventiveMaintenanceFrequenciesDecoder: Decoder<PreventiveMaintenanceFrequencies> = object({
  PreventiveMaintenanceFrequencies: array(entityDetailsDecoder),
});

// For Create Contract End
//For Create User
export interface UserCategory {
  UserCategory: EntityDetails[];
}

export const usercategoryDecoder: Decoder<UserCategory> = object({
  UserCategory: array(entityDetailsDecoder),
});
//For Create User Ends

export interface SLATypes {
  SLATypes: EntityDetails[];
}

export const slaTypesDecoder: Decoder<SLATypes> = object({
  SLATypes: array(entityDetailsDecoder),
});

export interface Gender {
  Gender: EntityDetails[];
}

export const genderDecoder: Decoder<Gender> = object({
  Gender: array(entityDetailsDecoder),
});