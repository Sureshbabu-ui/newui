import { array, boolean, Decoder, number, object, string } from 'decoders';

export interface EntityDetails {
  Id: number;
  Name: string;
}

export const entityDetailsDecoder: Decoder<EntityDetails> = object({
  Id: number,
  Name: string,
});

export interface EngineersDetails {
  Id: number;
  FullName: string;
}

export const engineersDetailsDecoder: Decoder<EngineersDetails> = object({
  Id: number,
  FullName: string,
});

export interface Engineers {
  Engineers: EngineersDetails[];
}

export const engineersDecoder: Decoder<Engineers> = object({
  Engineers: array(engineersDetailsDecoder),
});

export interface SelectTenantOffice {
  value: any,
  label: any
}

export interface SelectDetails {
  Select: SelectTenantOffice[]
}