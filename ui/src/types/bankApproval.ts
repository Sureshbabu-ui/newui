import { array, Decoder, nullable, number, object, string } from "decoders";

export interface BankPendingListDetail {
    ApprovalRequestId: number;
    ApprovalRequestDetailId: number;
    CaseId: number;
    EventCode: string;
    EventName: string;
    Content: string;
    CreatedBy: number|null;
    CreatedOn: string | null;
    ReviewStatus: string|null;
    ReviewStatusName:string|null;
    CreatedUserName: string;
  }
  
  export const bankPendingListDetailDecoder: Decoder<BankPendingListDetail> = object({
    ApprovalRequestId: number,
    ApprovalRequestDetailId:number,
    CaseId: number,
    EventCode: string,
    EventName: string,
    Content: string,
    CreatedBy: nullable(number),
    CreatedOn: nullable(string),
    ReviewStatus: nullable(string),
    ReviewStatusName:nullable(string),
    ReviewComment: nullable(string),
    CreatedUserName: string,
  });
  
  export interface BankPendingList {
    PendingList: BankPendingListDetail[];
    TotalRows: number;
    CurrentPage: number;
    PerPage: number;
  }
  
  export const bankPendingListDecoder: Decoder<BankPendingList> = object({
    PendingList: array(bankPendingListDetailDecoder),
    TotalRows: number,
    CurrentPage: number,
    PerPage: number,
  });

  export interface BankApprovalEditDetail{
    BankCode: string|null;
    BankName: string|null;
  }
  