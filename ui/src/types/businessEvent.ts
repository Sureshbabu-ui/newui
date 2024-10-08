import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface BusinessEventDetails {
    Id: number;
    Code: string;
    Name: string;
    IsActive: boolean;
    CreatedBy: string;
    CreatedOn: string;
    UpdatedBy: null | string;
    UpdatedOn: null | string;
  }

  export const businessEventDetailsDecoder : Decoder<BusinessEventDetails> = object({
    Id: number,
    Code: string,
    Name: string,
    IsActive: boolean,
    CreatedBy: string,
    CreatedOn: string,
    UpdatedBy: nullable(string),
    UpdatedOn: nullable(string)
  });  
  
  export interface BusinessEventList{
    BusinessEvent:BusinessEventDetails[],
    TotalRows: number;
    PerPage:number;
  }

  export const businessEventListDecoder: Decoder<BusinessEventList> = object({
    BusinessEvent: array(businessEventDetailsDecoder),
    TotalRows: number,
    PerPage:number
  });

  ////for listing business events for notification settings

export interface BusinessEventDetail {
    Id: number;
    Name: string;
  }
  
  export const businessEventDecoder: Decoder<BusinessEventDetail> = object({
    Id: number,
    Name: string,
  });
  
  export interface BusinessEventNames {
    BusinessEventTitle: BusinessEventDetail[];
  }
  
  export const businesseventNamesDecoder: Decoder<BusinessEventNames> = object({
    BusinessEventTitle: array(businessEventDecoder),
  }); 