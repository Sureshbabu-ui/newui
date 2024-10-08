import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';

export interface CountryDetails {
  Id: number;
  Name: string;
  CallingCode: string;
}

export const countryDetailsDecoder: Decoder<CountryDetails> = object({
  Id: number,
  Name: string,
  CallingCode: string
});

export interface Countries {
  Countries: CountryDetails[];
}

export const countryDecoder: Decoder<Countries> = object({
  Countries: array(countryDetailsDecoder),
});

export interface CountryDetailsSelect {
  value: any,
  label: any
  code?: any
}

export interface CountriesSelect {
  Countries: CountryDetailsSelect[];
}

export interface IndustryDetailsSelect {
  value: any,
  label: any
}

export interface IndustriesSelect {
  Industries: IndustryDetailsSelect[];
}

export interface CountrySelect {
  Countries: CountryDetailsSelect[];
}

export interface CountryCreate {
  IsoThreeCode: string;
  IsoTwoCode: string;
  Name: string;
  CallingCode: string;
  CurrencyCode: string;
  CurrencyName: string;
  CurrencySymbol: string;
}

export interface CountryEdit {
  Id: number;
  IsoThreeCode: string;
  IsoTwoCode: string;
  Name: string;
  CallingCode: string;
  CurrencyCode: string;
  CurrencyName: string;
  CurrencySymbol: string;
}

export interface CountryList {
  Id: number;
  IsoThreeCode: string;
  IsoTwoCode: string;
  Name: string;
  CallingCode: string;
  CurrencyCode: string;
  CurrencyName: string;
  CurrencySymbol: string;
}

export const CountryListDecoder: Decoder<CountryList> = object({
  Id: number,
  IsoThreeCode: string,
  IsoTwoCode: string,
  Name: string,
  CallingCode: string,
  CurrencyCode: string,
  CurrencyName: string,
  CurrencySymbol: string
});

export interface MultipleCountry {
  CountryList: CountryList[];
  totalRows: number;
  PerPage: number;
}

export const multipleCountryDecoder: Decoder<MultipleCountry> = object({
  CountryList: array(CountryListDecoder),
  totalRows: number,
  PerPage: number
});

export interface CountryCreateResult {
  IsCountryCreated: boolean;
}

export const countryCreateResultDecoder: Decoder<CountryCreateResult> = object({
  IsCountryCreated: boolean,
});

export interface CountryUpdateResult {
  IsCountryUpdated: boolean;
}

export const countryUpdateResultDecoder: Decoder<CountryUpdateResult> = object({
  IsCountryUpdated: boolean,
});

export interface CountryDeleted {
  IsDeleted: Boolean;
}

export const countryDeletedDecoder: Decoder<CountryDeleted> = object({
  IsDeleted: boolean,
});