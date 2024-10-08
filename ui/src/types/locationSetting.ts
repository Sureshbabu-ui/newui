import { Decoder, array,  boolean,  number, object } from "decoders";

  export interface locationSettingDetails{
    Id:number;
    LocationId :number;
    LastAmcInvoiceNumber  :number;
    LastPaidJobInvoiceNumber  :number;
    LastContractNumber  :number;
    LastReceiptNumber  :number;
    LastSaleInvoiceNumber  :number;
    LastWorkOrderNumber  :number;
  } 

  export const locationSettingDetailsDecoder : Decoder<locationSettingDetails> = object({
    Id:number,
    LocationId :number,
    LastAmcInvoiceNumber  :number,
    LastPaidJobInvoiceNumber  :number,
    LastContractNumber  :number,
    LastReceiptNumber  :number,
    LastSaleInvoiceNumber  :number,
    LastWorkOrderNumber  :number
     });  
  

  export interface locationSettingDetailsResponse{
    LocationSetting:locationSettingDetails,
  }

  export const locationSettingDetailsResponseDecoder: Decoder<locationSettingDetailsResponse> = object({
    LocationSetting: (locationSettingDetailsDecoder),
  });

  export interface LocatioSettingEditResponse {
    isUpdated: Boolean; 
  }
  
  export const locationSettingEditDecoder: Decoder<LocatioSettingEditResponse> = object({
    isUpdated: boolean,
  });
  