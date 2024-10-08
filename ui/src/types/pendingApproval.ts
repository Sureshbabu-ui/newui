import { array, boolean, Decoder, null_, nullable, number, object, string } from 'decoders';

export interface PendingApprovalListDetail {
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

export const pendingApprovalListDetailDecoder: Decoder<PendingApprovalListDetail> = object({
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

export interface PendingApprovalsDetailList {
  PendingList: PendingApprovalListDetail[];
  TotalRows: number;
  CurrentPage: number;
  PerPage: number;
}

export const pendingApprovalsDetailListDecoder: Decoder<PendingApprovalsDetailList> = object({
  PendingList: array(pendingApprovalListDetailDecoder),
  TotalRows: number,
  CurrentPage: number,
  PerPage: number,
});

export interface SelectedPendingApprovalDetail {
  ApprovalRequestId: number;
  ApprovalRequestDetailId:number;
    CaseId: number;
  TableName: string;
  FetchTime?: string | null;
  Content: string;
  ReviewStatus: string;
  ReviewStatusName:string;
  CreatedBy: number;
  CreatedOn: string;
  CreatedUserName: string;
}

export const selectedPendingApprovalDetailDecoder: Decoder<SelectedPendingApprovalDetail> = object({
  ApprovalRequestId: number,
  ApprovalRequestDetailId:number,  
  CaseId: number,
  TableName: string,
  FetchTime: nullable(string),
  Content: string,
  ReviewStatus: string,
  ReviewStatusName:string,
  CreatedBy: number,
  CreatedOn: string,
  CreatedUserName: string,
});

export interface ApprovalRequestReviewListDetail {
  Id: number;
  Sequence: number;
  ReviewStatusCode: string;
  ReviewStatusName: string;
  ReviewedBy: string|null;
  ReviewedOn: string|null;
  ReviewComment: string|null;
}

export const approvalRequestReviewListDetailDecoder: Decoder<ApprovalRequestReviewListDetail> = object({
  Id: number,
  Sequence:number,
  ReviewStatusCode: string,
  ReviewStatusName: string,
  ReviewedBy: nullable(string),
  ReviewedOn: nullable(string),
  ReviewComment: nullable(string),
});

export interface ApprovalRequestDetailWithReview {
  ApprovalRequestDetail: SelectedPendingApprovalDetail;
  ApprovalRequestReviewList:ApprovalRequestReviewListDetail[]
}

export const approvalRequestDetailWithReviewDecoder: Decoder<ApprovalRequestDetailWithReview> = object({  
  ApprovalRequestDetail:selectedPendingApprovalDetailDecoder,
  ApprovalRequestReviewList:array(approvalRequestReviewListDetailDecoder)
});


export interface ApprovalDeleted {
  IsDeleted: Boolean;
}

export const approvalDeletedDecoder: Decoder<ApprovalDeleted> = object({
  IsDeleted: boolean,
});

export interface PendingApprovalEditResponse {
  IsUpdated: Boolean;
}

export const pendingApprovalEditResponseDecoder: Decoder<PendingApprovalEditResponse> = object({
  IsUpdated: boolean,
});

export interface ApprovalRequestWorkflowNameDetail {
  WorkflowName: string;
  Code:string
}

export const approvalRequestWorkflowNameDetailDecoder: Decoder<ApprovalRequestWorkflowNameDetail> = object({
  WorkflowName: string,
  Code:string
});

export interface ApprovalRequestWorkflowNameList {
  ApprovalWorkflows: ApprovalRequestWorkflowNameDetail[]; 
} 

export const approvalRequestWorkflowNameListDecoder: Decoder<ApprovalRequestWorkflowNameList> = object({
  ApprovalWorkflows: array(approvalRequestWorkflowNameDetailDecoder),
});

export interface PartApprovalDetail {
  Id: number;
  CaseId: number;
  TableName: string;
  FetchTime?: string | null;
  Content: string;
  ProductCategoryName: string;
  PartCategoryName: string;
  PartSubCategoryName: null | string;
  MakeName: string;
  ReviewedOn: string | null;
  ReviewStatus: string;
  ReviewComment: string | null;
  CreatedBy: number;
  CreatedOn: string;
  CreatedUserName: string;
  ReviewedUserName: string | null;
}

export const partApprovalDetailDecoder: Decoder<PartApprovalDetail> = object({
  Id: number,
  CaseId: number,
  TableName: string,
  FetchTime: nullable(string),
  Content: string,
  ProductCategoryName: string,
  PartSubCategoryName: nullable(string),
  PartCategoryName: string,
  MakeName: string,
  ReviewedOn: nullable(string),
  ReviewStatus: string,
  ReviewComment: nullable(string),
  CreatedBy: number,
  CreatedOn: string,
  CreatedUserName: string,
  ReviewedUserName: nullable(string),
});

// user
export interface UserApprovalDetail {
 
  Id: number;
  CaseId: number;
  TableName: string;
  FullName:string;
  EmployeeCode:String;
  FetchTime?: string | null;
  Email: string;
  Phone: string;
  Content:string;
  UserCategory: string;
  Division: string | null;
  Department: string;
  EngagementType: string;
  Gender: string;
  Designation: string;
  ReportingManager: string;
  Location: string;
  ServiceEngineerType: string | null;
  ServiceEngineerLevel: string | null;
  ServiceEngineerCategory: string | null;
  Country: string | null;
  State: string | null;
  City: string | null;
  ReviewStatus: string;
  CreatedBy: number;
  CreatedOn: string;
  CreatedUserName: string;
  UserRole: string;
  DocumentUrl:string;
  CustomerName:string|null;
  ContractNumber:string|null;
  CustomerSite:string|null;
  BudgetedAmount:number|null;
  CustomerAgreedAmount:number|null;
  StartDate:string|null;
  EndDate:string|null;
  EngineerPincode:string|null;
  EngineerGeolocation:string|null;
  EngineerAddress:string|null;
  UserGrade:string|null;
}

export const UserApprovalDetailDecoder: Decoder<UserApprovalDetail> = object({
  Id: number,
  CaseId: number,
  TableName: string,
  FullName: string,
  EmployeeCode:string,
  Email:string,
  Phone:string,
  Content:string,
  FetchTime: nullable(string),
  UserCategory: string,
  Division: nullable(string),
  Department: string,
  EngagementType: string,
  Gender: string,
  Designation: string,
  ReportingManager: string,
  Location: string,
  ServiceEngineerType: nullable(string),
  ServiceEngineerLevel: nullable(string),
  ServiceEngineerCategory: nullable(string),
  Country: nullable(string),
  State: nullable(string),
  City: nullable(string),
  ReviewStatus: string,
  CreatedBy: number,
  CreatedOn: string,
  CreatedUserName: string,
  UserRole: string,
  DocumentUrl:string,
  CustomerName:nullable(string),
  ContractNumber:nullable(string),
  CustomerSite:nullable(string),
  BudgetedAmount:nullable(number),
  CustomerAgreedAmount:nullable(number),
  StartDate:nullable(string),
  EndDate:nullable(string),
  EngineerPincode:nullable(string),
  EngineerGeolocation:nullable(string),
  EngineerAddress:nullable(string),
  UserGrade:nullable(string)
});

export interface UserApprovalDetailWithReview {
  UserDetail: UserApprovalDetail;
  ApprovalRequestReviewList:ApprovalRequestReviewListDetail[]
}

export const userApprovalDetailWithReviewDecoder: Decoder<UserApprovalDetailWithReview> = object({  
  UserDetail:UserApprovalDetailDecoder,
  ApprovalRequestReviewList:array(approvalRequestReviewListDetailDecoder)
});

// Approve User
export interface ApproveUser {
  IsApproved: Boolean;
}

export const approveUserDecoder: Decoder<ApproveUser> = object({
  IsApproved: boolean,
});
