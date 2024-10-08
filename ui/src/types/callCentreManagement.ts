import { Decoder, array, number, object, string, boolean, nullable } from 'decoders';

// CallCentre Service Request List
export interface CallCenterServiceRequest {
  Id: number;
  WorkOrderNumber: null | string;
  CaseId: string;
  ContractNumber: string | null;
  Status: string;
  StatusCode: string;
  ModelName: string | null;
  CategoryName: string | null;
  ProductSerialNumber: string | null;
  CustomerName: string | null;
  EndUserPhone: string | null;
  CustomerServiceAddress: string | null;
  CustomerReportedIssue: string;
  CallcenterRemarks: string | null;
  CreatedBy: string;
  ResolutionTimeInHours: number
  WorkOrderCreatedOn: string | null;
  TicketNumber:string|null;
}

export const callCenterServiceRequestDecoder: Decoder<CallCenterServiceRequest> = object({
  Id: number,
  CaseId: string,
  ContractNumber: nullable(string),
  WorkOrderNumber: nullable(string),
  CustomerName: string,
  ModelName: nullable(string),
  CategoryName: nullable(string),
  EndUserPhone: nullable(string),
  ProductSerialNumber: nullable(string),
  CustomerServiceAddress: nullable(string),
  CustomerReportedIssue: string,
  CallcenterRemarks: nullable(string),
  Status: string,
  StatusCode: string,
  CreatedBy: string,
  ResolutionTimeInHours: number,
  WorkOrderCreatedOn: nullable(string),
  TicketNumber:nullable(string)
});

export interface CallCenterServiceRequestList {
  ServiceRequestList: CallCenterServiceRequest[];
  TotalRows: number;
  PerPage: number;
}

export const callCenterServiceRequestListDecoder: Decoder<CallCenterServiceRequestList> = object({
  ServiceRequestList: array(callCenterServiceRequestDecoder),
  TotalRows: number,
  PerPage: number
});
// CallCentre Service Request List Ends

// CallCentre View Details
export interface CallCenterServiceRequestDetail {
  Id: number;
  WorkOrderNumber: null | string;
  CaseId: string;
  CreatedBy: string;
  CreatedOn: string;
  CustomerReportedIssue: string;
  CallCenterRemarks: string | null;
  CallSource: string;
  CallType: string;
  CustomerContactType: string;
  CallStatus: string;
  IncidentId: string | null;
  CaseReportedOn: string;
  CaseReportedCustomerEmployeeName: string;
  OptedForRemoteSupport: boolean;
  RemoteSupportNotOptedReason: string | null;
  AssignedBy: string | null;
  CustomerName: string;
  CustomerCode: string;
  SiteAddress: string;
  CustomerServiceAddress: string | null;
  Make: string | null;
  ModelName: string | null;
  CategoryName: string | null;
  ProductSerialNumber: string | null;
  ContractNumber: string;
  InterimReviewRemarks: string | null;
  InterimStatus: string | null;
  InterimReviewedOn: string | null;
  ReviewedBy: string | null;
  Diagnosis: string | null;
  MspProvidedSolution: string | null;
  ClosureRemarks: string | null;
  ClosedBy: string | null;
  ClosedOn: string | null;
  HoursSpent: string | null;
  ResponseTimeInHours: string | null;
  ResolutionTimeInHours: string | null;
  StandByTimeInHours: string | null;
  EndUserName: string | null;
  EndUserEmail: string | null;
  EndUserPhone: string | null;
  RepairReason: string | null;
  TicketNumber:string|null;
}

export const callCenterserviceRequestDetailDecoder: Decoder<CallCenterServiceRequestDetail> = object({
  Id: number,
  WorkOrderNumber: nullable(string),
  CaseId: string,
  IncidentId: nullable(string),
  CreatedBy: string,
  CreatedOn: string,
  CaseReportedOn: string,
  CaseReportedCustomerEmployeeName: string,
  CustomerReportedIssue: string,
  CallCenterRemarks: nullable(string),
  CallSource: string,
  CallStatus: string,
  OptedForRemoteSupport: boolean,
  RemoteSupportNotOptedReason: nullable(string),
  AssignedBy: nullable(string),
  CustomerName: string,
  CustomerCode: string,
  SiteAddress: string,
  CustomerServiceAddress: nullable(string),
  Make: nullable(string),
  ModelName: nullable(string),
  CategoryName: nullable(string),
  ProductSerialNumber: nullable(string),
  ContractNumber: string,
  InterimReviewRemarks: nullable(string),
  InterimStatus: nullable(string),
  InterimReviewedOn: nullable(string),
  ReviewedBy: nullable(string),
  Diagnosis: nullable(string),
  MspProvidedSolution: nullable(string),
  ClosureRemarks: nullable(string),
  ClosedBy: nullable(string),
  ClosedOn: nullable(string),
  HoursSpent: nullable(string),
  ResponseTimeInHours: nullable(string),
  ResolutionTimeInHours: nullable(string),
  StandByTimeInHours: nullable(string),
  CallType: string,
  CustomerContactType: string,
  EndUserName: nullable(string),
  EndUserEmail: nullable(string),
  EndUserPhone: nullable(string),
  RepairReason: nullable(string),
  TicketNumber:nullable(string)
});

export interface CallCenterServiceRequestDetails {
  ServiceRequestDetails: CallCenterServiceRequestDetail;
}

export const callCenterServiceRequestDetailsDecoder: Decoder<CallCenterServiceRequestDetails> = object({
  ServiceRequestDetails: callCenterserviceRequestDetailDecoder
});
// CallCentre View Call Details End

// Call Status Details
export interface CallStatusSingleDetail {

  Id: number;
  CaseId: string;
  WorkOrderNumber: null | string;
  CustomerReportedIssue: string | null;
  CallCenterRemarks: string | null;
  CallCreatedBy: string;
  CallCreatedOn: string;
  CallSource: string;
  OptedForRemoteSupport: boolean;
  IsInterim: boolean;
  CallType: string;
  CustomerName: string;
  SiteAddress: string;
  CustomerAddress: string | null;
  EndUserEmail: string | null;
  EndUserName: string | null;
  EndUserPhone: string | null;
  ProductSerialNumber: string;
  CategoryName: string;
  Make: string;
  ModelName: string;
  WarrantyEndDate: string | null;
  IsPreAmcCompleted: boolean;
  AssigneeName: string | null;
  AssignedBy: string | null;
  AssignedOn: string | null;
  AssignedFrom: string | null;
  AssignedTo: string | null;
  ContractNumber: string;
  ContractStartDate: string;
  ContractEndDate: string;
  AgreementType: string;
}

export const callStatusSingleDetailDecoder: Decoder<CallStatusSingleDetail> = object({
  Id: number,
  CaseId: string,
  WorkOrderNumber: nullable(string),
  CustomerReportedIssue: nullable(string),
  CallCenterRemarks: nullable(string),
  CallCreatedBy: string,
  CallCreatedOn: string,
  CallSource: string,
  OptedForRemoteSupport: boolean,
  IsInterim: boolean,
  CallType: string,
  CustomerName: string,
  SiteAddress: string,
  CustomerAddress: nullable(string),
  EndUserEmail: nullable(string),
  EndUserName: nullable(string),
  EndUserPhone: nullable(string),
  ProductSerialNumber: string,
  CategoryName: string,
  Make: string,
  ModelName: string,
  WarrantyEndDate: nullable(string),
  IsPreAmcCompleted: boolean,
  AssigneeName: nullable(string),
  AssignedBy: nullable(string),
  AssignedOn: nullable(string),
  AssignedFrom: nullable(string),
  AssignedTo: nullable(string),
  ContractNumber: string,
  ContractStartDate: string,
  ContractEndDate: string,
  AgreementType: string,
});

// Call status Details End

export interface CallStatusPartIndentRequestDetail {
  PartName: string;
  StockType: string | null;
  Description: string | null;
  Quantity: string | null;
  IsWarrantyReplacement: boolean;
  RequestedDate: string;
  RequestedBy: string;
  ApprovedDate: string;
  PartIndentRequestStatus: string;
}

export const callStatusPartIndentRequestDetailDecoder: Decoder<CallStatusPartIndentRequestDetail> = object({

  PartName: string,
  StockType: nullable(string),
  Description: nullable(string),
  Quantity: nullable(string),
  IsWarrantyReplacement: boolean,
  RequestedDate: string,
  RequestedBy: string,
  ApprovedDate: string,
  PartIndentRequestStatus: string,

});

export interface CallStatusPartIndentDetails {
  CallStatusPartIndentRequestDetails: CallStatusPartIndentRequestDetail[];
}

export const callStatusPartIndentDetailsDecoder: Decoder<CallStatusPartIndentDetails> = object({
  CallStatusPartIndentRequestDetails: array(callStatusPartIndentRequestDetailDecoder)
});
// Call part allocation Details End

export interface CallStatusPartAllocationDetail {
  AllocatedBy: string | null;
  ReceivedBy: string | null;
  AllocatedOn: string | null;
  ReceivedOn: string | null;
}

export const callStatusPartAllocationDecoder: Decoder<CallStatusPartAllocationDetail> = object({
  AllocatedBy: nullable(string),
  ReceivedBy: nullable(string),
  AllocatedOn: nullable(string),
  ReceivedOn: nullable(string)
});

export interface CallStatusEngineerVisitDetail {
  ServiceEngineer: string | null;
  VisitStartsOn: string | null;
  VisitEndsOn: string | null;
  Remarks: string | null;
  CallStatus: string | null;
}

export const callStatusEngineerVisitDecoder: Decoder<CallStatusEngineerVisitDetail> = object({

  ServiceEngineer: nullable(string),
  VisitStartsOn: nullable(string),
  VisitEndsOn: nullable(string),
  Remarks: nullable(string),
  CallStatus: nullable(string)

});

export interface CallStatusEngineerVisitDetails {
  CallStatusServiceEngineerVisitsClosureDetails: CallStatusEngineerVisitDetail[];
}

export const callStatusEngineerVisitDetailsDecoder: Decoder<CallStatusEngineerVisitDetails> = object({
  CallStatusServiceEngineerVisitsClosureDetails: array(callStatusEngineerVisitDecoder)
});

export interface CallStatusDetails {
  CallStatusReportDetails: CallStatusSingleDetail;
  PartIndentRequest: CallStatusPartIndentRequestDetail[];
  PartAllocationDetails: CallStatusPartAllocationDetail[];
  ServiceEngineerVisitsDetails: CallStatusEngineerVisitDetail[];

}

export const callStatusPdfDetailsDecoder: Decoder<CallStatusDetails> = object({
  CallStatusReportDetails: callStatusSingleDetailDecoder,
  PartIndentRequest: array(callStatusPartIndentRequestDetailDecoder),
  PartAllocationDetails: array(callStatusPartAllocationDecoder),
  ServiceEngineerVisitsDetails: array(callStatusEngineerVisitDecoder)
});