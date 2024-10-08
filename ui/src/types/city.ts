import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';

export interface CityDetails {
  Id: number;
  Name: string;
  TenantOfficeId: number | null;
}

export const cityDetailsDecoder: Decoder<CityDetails> = object({
  Id: number,
  Name: string,
  TenantOfficeId: nullable(number)
});

export interface Cities {
  Cities: CityDetails[];
}

export const cityDecoder: Decoder<Cities> = object({
  Cities: array(cityDetailsDecoder),
});

export interface CityDetailsSelect {
  value: any,
  label: any
}

export interface CitiesSelect {
  Cities: CityDetailsSelect[];
}

export interface CityCreate {
  Name: string;
  Code: string;
  StateId: number;
  TenantOfficeId: number;
}

export interface CityEdit {
  Id: number;
  Name: string;
  Code: string;
  StateId: number;
  TenantOfficeId: number | null;
}

export interface CitiesList {
  Id: number;
  Name: string;
  Code: string;
  StateId: number;
  StateName: string;
  TenantOfficeId: number | null;
  OfficeName: string | null;
}

export const CityListDecoder: Decoder<CitiesList> = object({
  Id: number,
  Name: string,
  Code: string,
  StateId: number,
  StateName: string,
  TenantOfficeId: nullable(number),
  OfficeName: nullable(string)
})

export interface MultipleCity {
  Cities: CitiesList[];
  totalRows: number;
  PerPage: number;
}

export const multipleCityDecoder: Decoder<MultipleCity> = object({
  Cities: array(CityListDecoder),
  totalRows: number,
  PerPage: number
});

export interface CityCreateResult {
  IsCityCreated: boolean;
}

export const cityCreateResultDecoder: Decoder<CityCreateResult> = object({
  IsCityCreated: boolean,
});

export interface CityUpdateResult {
  IsCityUpdated: boolean;
}

export const cityUpdateResultDecoder: Decoder<CityUpdateResult> = object({
  IsCityUpdated: boolean,
});

export interface CityDeleted {
  IsDeleted: Boolean;
}

export const cityDeletedDecoder: Decoder<CityDeleted> = object({
  IsDeleted: boolean,
});