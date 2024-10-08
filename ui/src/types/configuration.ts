import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';

export interface ConfigurationsUpdateField {
  Attribute: config[];
  Description: string;
  Id: string;
  Entity:string
}

export interface config{ 
  Id: number;
  Name: string;
  IsActive: string;
  Description:string;
}
export interface EntitiesList {
  Id:number;
  Entity: string;
}

export const entitiesListDecoder: Decoder<EntitiesList> = object({
  Id:number,
  Entity: string,
});

export interface EntitiesLists {
  EntitiesLists: EntitiesList[];
}

export const entitiesListsDecoder: Decoder<EntitiesLists> = object({
  EntitiesLists: array(entitiesListDecoder),
});

export interface SelectedTableData {
  Id: number;
  Entity: string;
  Attributes: string;
  Description: string;
  CreatedBy: number;
  CreatedOn: string;
  UpdatedBy: null | number;
  UpdatedOn: null | string;
}

export const selectedTableDataDecoder: Decoder<SelectedTableData> = object({
  Id: number,
  Entity: string,
  Attributes: string,
  Description: string,
  CreatedBy: number,
  CreatedOn: string,
  UpdatedBy: nullable(number),
  UpdatedOn: nullable(string),
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