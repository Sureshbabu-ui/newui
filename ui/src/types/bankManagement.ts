import { array, boolean, Decoder, nullable, number, object, string } from "decoders";
import { ApprovalRequestReviewListDetail, approvalRequestReviewListDetailDecoder } from "./pendingApproval";

export interface CreateBank {
  IsInserted: Boolean;
}

export const createBankDecoder: Decoder<CreateBank> = object({
  IsInserted: boolean,
});

export interface EditBankResponse {
  IsUpdated: Boolean;
}

export const editBankResponseDecoder: Decoder<EditBankResponse> = object({
  IsUpdated: boolean,
});

export interface ApproveBank {
  IsApproved: Boolean;
}

export const approveBankDecoder: Decoder<ApproveBank> = object({
  IsApproved: boolean,
});

export interface RejectBank {
  IsRejected: Boolean;
}

export const rejectBankDecoder: Decoder<RejectBank> = object({
  IsRejected: boolean,
});

export interface ApprovalRequestChange {
  IsChangeRequested: Boolean;
}

export const approvalRequestChangeDecoder: Decoder<ApprovalRequestChange> = object({
  IsChangeRequested: boolean,
});

export interface ApprovedBankDetail {
  Id: number;
  BankCode: string;
  BankName: string;
  CreatedOn: string;
  CreatedBy: string;
}

export const approvedBankDetailDecoder: Decoder<ApprovedBankDetail> = object({
  Id: number,
  BankCode: string,
  BankName: string,
  CreatedOn: string,
  CreatedBy: string
});

export interface ApprovedBankDetails {
  ApprovedList: ApprovedBankDetail[];
  TotalRows: number;
  CurrentPage: number;
  PerPage: number
}

export const approvedBankDetailsDecoder: Decoder<ApprovedBankDetails> = object({
  ApprovedList: array(approvedBankDetailDecoder),
  TotalRows: number,
  CurrentPage: number,
  PerPage: number
});

export interface ApprovedBankNameDetail {
  Id: number;
  BankCode: string;
  BankName: string;
}

export const approvedBankNameDetailDecoder: Decoder<ApprovedBankNameDetail> = object({
  Id: number,
  BankCode: string,
  BankName: string,
});

export interface ApprovedBankNameList {
  ApprovedList: ApprovedBankNameDetail[];
}

export const approvedBankNameListDecoder: Decoder<ApprovedBankNameList> = object({
  ApprovedList: array(approvedBankNameDetailDecoder),
});

export interface BankDetailsSelect {
  value: any,
  label: any
}

export interface BanksSelect {
  Banks: BankDetailsSelect[];
}

export interface BankDeleted {
  IsDeleted: Boolean;
}

export const bankDeletedDecoder: Decoder<BankDeleted> = object({
  IsDeleted: boolean,
});

export interface BankPendingDetail {
  ApprovalRequestId: number;
  ApprovalRequestDetailId:number;
    CaseId: number;
  TableName: string;
  BankCode: string | null;
  BankName: string|null;
  ReviewStatus: string;
  ReviewStatusName:string;
  CreatedBy: number;
  CreatedOn: string;
  CreatedUserName: string;
}

export const bankPendingDetailDecoder: Decoder<BankPendingDetail> = object({
  ApprovalRequestId: number,
  ApprovalRequestDetailId:number,  
  CaseId: number,
  TableName: string,
  BankCode: string,
  BankName: string,
  ReviewStatus: string,
  ReviewStatusName:string,
  CreatedBy: number,
  CreatedOn: string,
  CreatedUserName: string,
});

export interface BankPendingDetailWithReview {
  BankPendingDetail: BankPendingDetail;
  ApprovalRequestReviewList:ApprovalRequestReviewListDetail[]
}

export const bankPendingDetailWithReviewDecoder: Decoder<BankPendingDetailWithReview> = object({  
  BankPendingDetail:bankPendingDetailDecoder,
  ApprovalRequestReviewList:array(approvalRequestReviewListDetailDecoder)
}); 
