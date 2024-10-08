import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface DivisionCreate {
  Code: string;
  Name: string;
  IsActive: string;
}
export interface DivisionEdit{
  Id: number;
  Name: string;
  IsActive: string;
}

export interface DivisionCreateResult {
  IsDivisionCreated: Boolean;
}

export const createDecoder: Decoder<DivisionCreateResult> = object({
  IsDivisionCreated: boolean,
});

export interface DivisionEditResult {
  IsUpdated: Boolean;
}

export const editDivisionDecoder: Decoder<DivisionEditResult> = object({
  IsUpdated: boolean,
});

export interface DivisionDetails {
  Id: number;
  Code: string;
  Name: string;
  IsActive: boolean;
  CreatedByFullName: string;
  CreatedOn: string;
  UpdatedByFullName: null | string;
  UpdatedOn: null | string;
}

export interface DivisionList {
  Divisions: DivisionDetails[],
  TotalRows: number;
  PerPage: number;
}

export const divisionDetailsDecoder: Decoder<DivisionDetails> = object({
  Id: number,
  Code: string,
  Name: string,
  IsActive: boolean,
  CreatedByFullName: string,
  CreatedOn: string,
  UpdatedByFullName: nullable(string),
  UpdatedOn: nullable(string)
});

export const divisionListDecoder: Decoder<DivisionList> = object({
  Divisions: array(divisionDetailsDecoder),
  TotalRows: number,
  PerPage: number
});

export interface EntityDetails {
  Id: number;
  Name: string;
}

export const entityDetailsDecoder: Decoder<EntityDetails> = object({
  Id: number,
  Name: string,
});

export interface GetDivisions {
  Divisions: EntityDetails[];
}

export const getDivisionsDecoder: Decoder<GetDivisions> = object({
  Divisions: array(entityDetailsDecoder),
});

export interface DivisionDeleted {
  IsDeleted: Boolean;
}

export const divisionDeletedDecoder: Decoder<DivisionDeleted> = object({
  IsDeleted: boolean,
});