import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface ApprovalWorkflowListDetail {
    Id: number|null;
    Name : string|null;
    Description: string|null;
    IsActive :boolean|null;
    SequenceCount:number|null;
    CreatedOn: string|null;
 }
  
  export const approvalWorkflowListDetailDecoder: Decoder<ApprovalWorkflowListDetail> = object({
    Id: number,
    Name: string,
    Description: nullable(string),
    IsActive :boolean, 
    SequenceCount:number,
    CreatedOn: string ,
  });
  
  export interface ApprovalWorkflowList {
    ApprovalWorkflows: ApprovalWorkflowListDetail[];
    TotalRows: number;
  }
  
  export const approvalWorkflowListDecoder: Decoder<ApprovalWorkflowList> = object({  
    ApprovalWorkflows: array(approvalWorkflowListDetailDecoder),
    TotalRows: number,
  });

  export interface ApprovalWorkflowCreate {
    Name:null|string;
    Description:null|string;
 }

 export interface ApprovalWorkflowCreateResponseData {
  IsApprovalWorkflowCreated: Boolean;
}

export const approvalWorkflowCreateResponseDataDecoder: Decoder<ApprovalWorkflowCreateResponseData> = object({
  IsApprovalWorkflowCreated: boolean
})

  

export interface ApprovalWorkflowEdit {
  Id: number|null;
  Name : string|null;
  IsActive :boolean|null;
  Description: string|null;
}

export interface ApprovalWorkflowUpdateResult {
  IsApprovalWorkflowUpdated: Boolean;
}

export const createApprovalWorkflowUpdateDecoder: Decoder<ApprovalWorkflowUpdateResult> = object({
  IsApprovalWorkflowUpdated: boolean,
});


export interface ApprovalWorkflowSelectDetails {
  Id: number;
  Name: string;
}
export const approvalWorkflowSelectDetailsDecoder: Decoder<ApprovalWorkflowSelectDetails> = object({
  Id: number,
  Name: string,
});

export interface ApprovalWorkflowSelect {
  MasterData: ApprovalWorkflowSelectDetails[];
}

export const approvalWorkflowSelectDecoder: Decoder<ApprovalWorkflowSelect> = object({
  MasterData: array(approvalWorkflowSelectDetailsDecoder),
});