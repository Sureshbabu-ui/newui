import { Decoder, array, boolean, nullable, number, object, string } from "decoders";
import { ApprovalWorkflowListDetail, approvalWorkflowListDetailDecoder } from "./approvalWorkflow";

export interface ApprovalWorkflowViewDetail {
    Id: number|null;
    ApproverRoleId: null|number,
    ApproverUserId:null|number,
    RoleName : string|null;
    ApproverUserName : string|null;
    IsActive :boolean;
    Sequence:number|null;
    CreatedOn: string;
 }
  
  export const approvalWorkflowViewDetailDecoder: Decoder<ApprovalWorkflowViewDetail> = object({
    Id: number,
    ApproverRoleId:nullable(number),
    ApproverUserId:nullable(number),
    RoleName: nullable(string),
    ApproverUserName:nullable(string),
    IsActive :boolean, 
    Sequence:number,
    CreatedOn: string ,
  });
  
  export interface ApprovalWorkflowView {
    ApprovalWorkflowDetails: ApprovalWorkflowViewDetail[];
    ApprovalWorkflow:ApprovalWorkflowListDetail,
    TotalRows: number;
  }
  
  export const approvalWorkflowViewDecoder: Decoder<ApprovalWorkflowView> = object({  
    ApprovalWorkflowDetails: array(approvalWorkflowViewDetailDecoder),
    ApprovalWorkflow:approvalWorkflowListDetailDecoder,
    TotalRows: number,
  });

  export interface ApprovalWorkflowDetailCreate {
    ApprovalWorkflowId: number|null|string;
    ApprovalType:string;
    ApproverRoleId: null|number,
    ApproverUserId:null|number,
    IsActive :boolean, 
    Sequence:number|null,
 }

 export interface ApprovalWorkflowDetailCreateResponseData {
  IsApprovalWorkflowDetailCreated: Boolean;
}

export const approvalWorkflowDetailCreateResponseDataDecoder: Decoder<ApprovalWorkflowDetailCreateResponseData> = object({
  IsApprovalWorkflowDetailCreated: boolean
})

export interface ApprovalWorkflowDetailEdit {
  Id:number|null,
  ApproverRoleId: null|number,
  ApproverUserId:null|number,
  IsActive :boolean, 
  Sequence:number|null,
  ApproverType:string;
}

export interface ApprovalWorkflowDetailUpdateResult {
  IsApprovalWorkflowDetailUpdated: Boolean;
}

export const createApprovalWorkflowDetailUpdateDecoder: Decoder<ApprovalWorkflowDetailUpdateResult> = object({
  IsApprovalWorkflowDetailUpdated: boolean,
});