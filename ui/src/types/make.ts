import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface MakeCreate {
  Name: string;
}

export interface MakeCreateResult {
  IsMakeCreated: Boolean;
}

export const makeCreateResultDecoder: Decoder<MakeCreateResult> = object({
  IsMakeCreated: boolean,
});

export interface MakeDetails {
  Id: number;
  Code: string;
  Name: string;
  CreatedBy: string;
  CreatedOn: string;
  UpdatedBy: null | string;
  UpdatedOn: null | string;
}

export interface MakeList {
  Makes: MakeDetails[]
  TotalRows: number
  PerPage:number
}

export const makeDetailsDecoder: Decoder<MakeDetails> = object({
  Id: number,
  Code: string,
  Name: string,
  CreatedBy: string,
  CreatedOn: string,
  UpdatedBy: nullable(string),
  UpdatedOn: nullable(string)
})

export const makeListDecoder: Decoder<MakeList> = object({
  Makes: array(makeDetailsDecoder),
  TotalRows: number,
  PerPage:number
});

export interface MakeEditDetails {
  Id: number | string;
  Code: string;
  Name: string;
}

export interface MakeEditResponse {
  IsUpdated: Boolean;
}

export const makeEditDecoder: Decoder<MakeEditResponse> = object({
  IsUpdated: boolean,
}); 

export interface MakeDeleted {
  IsDeleted: Boolean;
}

export const makeDeletedDecoder: Decoder<MakeDeleted> = object({
  IsDeleted: boolean,
});