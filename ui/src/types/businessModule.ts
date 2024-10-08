import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface BusinessModuleDetails {
    Id: number;
    BusinessModuleName:string;
    Description:string|null;
    IsActive: boolean;
    CreatedBy: string;
    CreatedOn: string;
    UpdatedBy: null | string;
    UpdatedOn: null | string;
  }

  export const businessModuleDetailsDecoder : Decoder<BusinessModuleDetails> = object({
    Id: number,
    BusinessModuleName:string,
    Description:nullable(string),
    IsActive: boolean,
    CreatedBy: string,
    CreatedOn: string,
    UpdatedBy: nullable(string),
    UpdatedOn: nullable(string)
  });  
  
  export interface BusinessModuleList{
    BusinessModule:BusinessModuleDetails[],
    TotalRows: number;
    PerPage:number;
  }

  export const businessModuleListDecoder: Decoder<BusinessModuleList> = object({
    BusinessModule: array(businessModuleDetailsDecoder),
    TotalRows: number,
    PerPage:number
  });

  export interface BusinessModuleName {
    value: any;
    label: any;
  }
    
  export interface BusinessModuleNamesList {
    BusinessModules: BusinessModuleName[];
  }
  
  export interface BusinessModuleNameFromServer {
    Id: number;
    BusinessModuleName: string;
  }
  
  export const businessModuleNameFromServerDecoder: Decoder<BusinessModuleNameFromServer> = object({
    Id: number,
    BusinessModuleName: string,
  });
  
  export interface BusinessModuleNamesFromServerList {
    BusinessModule: BusinessModuleNameFromServer[];
  }
  
  export const businessModuleNamesFromServerListDecoder: Decoder<BusinessModuleNamesFromServerList> = object({
    BusinessModule: array(businessModuleNameFromServerDecoder),
  });