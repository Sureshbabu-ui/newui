import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface BusinessFunctionDetails {
    Id: number;
    BusinessFunctionCode: string;
    BusinessFunctionName: string;
    BusinessModuleName:string;
    IsActive: boolean;
    CreatedBy: string;
    CreatedOn: string;
    UpdatedBy: null | string;
    UpdatedOn: null | string;
  }

  export const businessFunctionDetailsDecoder : Decoder<BusinessFunctionDetails> = object({
    Id: number,
    BusinessFunctionCode: string,
    BusinessFunctionName: string,
    BusinessModuleName:string,
    IsActive: boolean,
    CreatedBy: string,
    CreatedOn: string,
    UpdatedBy: nullable(string),
    UpdatedOn: nullable(string)
  });  
  
  export interface BusinessFunctionList{
    BusinessFunction:BusinessFunctionDetails[],
    TotalRows: number;
    PerPage:number;
  }

  export const businessFunctionListDecoder: Decoder<BusinessFunctionList> = object({
    BusinessFunction: array(businessFunctionDetailsDecoder),
    TotalRows: number,
    PerPage:number
  });