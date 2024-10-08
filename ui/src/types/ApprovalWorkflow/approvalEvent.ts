import { array, boolean, Decoder, nullable, number, object, string } from "decoders";
import { valuesInMasterDataByTableDetailsSelect } from "../masterData";

export interface ApprovalEventListDetail {
    ApprovalEventId: number;
    EventGroupId:number,
    EventGroupName: string;
    EventName: string;
    IsActive: boolean;
  }

  export const approvalEventListDetailDecoder : Decoder<ApprovalEventListDetail> = object({
    ApprovalEventId: number,
    EventGroupId:number,
    EventGroupName: string,
    EventName: string,
    IsActive: boolean,
  });  
  
  export interface ApprovalEventList{
    ApprovalEvents:ApprovalEventListDetail[]
  }

  export const approvalEventListDecoder: Decoder<ApprovalEventList> = object({
    ApprovalEvents: array(approvalEventListDetailDecoder)
  });

  export interface ApprovalEventNamesDetail {
    Id: number;
    EventName: string;
    EventCode:string;
  }
  
  export const approvalEventNamesDetailDecoder: Decoder<ApprovalEventNamesDetail> = object({
    Id: number,
    EventName: string,
    EventCode:string
  });

  export interface ApprovalEventNames {
    ApprovalEvents: ApprovalEventNamesDetail[];
  }
  
  export const approvalEventNamesDecoder: Decoder<ApprovalEventNames> = object({
    ApprovalEvents: array(approvalEventNamesDetailDecoder),
  }); 