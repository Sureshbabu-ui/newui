import { Decoder, number, object, string, boolean, nullable, array } from 'decoders';

// CallCordinator View Details
export interface CallCordiantorServiceRequestDetail {
  Id: number;
  WorkOrderNumber: null | string;
  WorkOrderCreatedOn: string | null;
  CaseId: string;
  CustomerReportedIssue: string;
  CallCenterRemarks: string | null;
  CreatedBy: string;
  EndUserName: string | null;
  EndUserPhone: string | null;
  EndUserEmail: string | null;
  CustomerName: string;
  CustomerCode: string;
  SiteAddress: string;
  CustomerServiceAddress: string | null;
  CustomerSiteName: string | null;
  CallStatusCode: string;
  CallType: string;
  CustomerContactType: string;
  CallStatus: string;
  IncidentId: string | null;
  CaseReportedOn: string;
  CaseReportedCustomerEmployeeName: string;
  OptedForRemoteSupport: boolean;
  RemoteSupportNotOptedReason: string | null;
  ContractNumber: string;
  TicketNumber:string|null;
}

export const callCordiantorServiceRequestDetailDecoder: Decoder<CallCordiantorServiceRequestDetail> = object({
  Id: number,
  WorkOrderNumber: nullable(string),
  WorkOrderCreatedOn: nullable(string),
  CaseId: string,
  CustomerReportedIssue: string,
  CallCenterRemarks: nullable(string),
  CreatedBy: string,
  EndUserName: nullable(string),
  EndUserPhone: nullable(string),
  EndUserEmail: nullable(string),
  CustomerName: string,
  CustomerCode: string,
  SiteAddress: string,
  CustomerServiceAddress: nullable(string),
  CustomerSiteName: string,
  CallStatusCode: string,
  CallType: string,
  CustomerContactType: string,
  CallStatus: string,
  IncidentId: nullable(string),
  CaseReportedOn: string,
  CaseReportedCustomerEmployeeName: string,
  OptedForRemoteSupport: boolean,
  RemoteSupportNotOptedReason: nullable(string),
  ContractNumber:string,
  TicketNumber:nullable(string)
});

export interface CallCordiantorServiceRequestDetails {
  ServiceRequestDetails: CallCordiantorServiceRequestDetail;
}

export const callCordiantorServiceRequestDetailsDecoder: Decoder<CallCordiantorServiceRequestDetails> = object({
  ServiceRequestDetails: callCordiantorServiceRequestDetailDecoder
});
// CallCordinator View Call Details End

// CallCordinator Service Request List
export interface CallCordinatorServiceRequest {
  Id: number;
  WorkOrderNumber: null | string;
  CustomerReportedIssue: null | string;
  ProductSerialNumber: string | null;
  CustomerName: string | null;
  EndUserPhone: string | null;
  EndUserName: string | null;
  ModelName: string | null;
  CustomerServiceAddress: string | null;
  Status: string;
  StatusCode: string;
  Assignee: string | null;
  ResolutionTimeInHours: number;
  WorkOrderCreatedOn: string | null;
}

export const callCordinatorServiceRequestDecoder: Decoder<CallCordinatorServiceRequest> = object({
  Id: number,
  WorkOrderNumber: nullable(string),
  CustomerReportedIssue: nullable(string),
  ProductSerialNumber: nullable(string),
  CustomerName: nullable(string),
  EndUserPhone: nullable(string),
  EndUserName: nullable(string),
  ModelName: nullable(string),
  CustomerServiceAddress: nullable(string),
  Status: string,
  StatusCode: string,
  Assignee: nullable(string),
  ResolutionTimeInHours: number,
  WorkOrderCreatedOn: nullable(string),
});

export interface CallCordinatorServiceRequestList {
  ServiceRequestList: CallCordinatorServiceRequest[];
  TotalRows: number;
  PerPage: number;
}

export const callCordinatorServiceRequestListDecoder: Decoder<CallCordinatorServiceRequestList> = object({
  ServiceRequestList: array(callCordinatorServiceRequestDecoder),
  TotalRows: number,
  PerPage: number
});
// CallCordinator Service Request List Ends

// CallCordinator Service Request Counts
export interface CallCordinatorServiceRequestCount {
  TotalCalls: number | null,
  NewCalls: number | null,
  CallResolved: number | null,
  EngAccepted: number | null,
  EngNotAccepted: number | null,
  VisitStarted: number | null,
  VisitClosed: number | null,
  OnsiteClosed: number | null,
  RemotelyClosed: number | null,
}

export interface CallCordinatorServiceRequestCounts {
  ServiceRequestCounts: CallCordinatorServiceRequestCount
}

export const callCordinatorServiceRequestCountDecoder: Decoder<CallCordinatorServiceRequestCount> = object({
  TotalCalls: nullable(number),
  NewCalls: nullable(number),
  CallResolved: nullable(number),
  EngAccepted: nullable(number),
  EngNotAccepted: nullable(number),
  VisitStarted: nullable(number),
  VisitClosed: nullable(number),
  OnsiteClosed: nullable(number),
  RemotelyClosed: nullable(number),
});

export const callCordinatorServiceRequestCountsDecoder: Decoder<CallCordinatorServiceRequestCounts> = object({
  ServiceRequestCounts: callCordinatorServiceRequestCountDecoder,
});
// CallCordinator Service Request Counts Ends

//Call cordinator tab Asset Details
export interface AssetDetailForCallCordinator {
  CategoryName: string;
  Make: string;
  ModelName: string | null;
  ProductSerialNumber: string | null;
  MspAssetId: string | null;
  WarrantyEndDate: string | null;
  IsVipProduct: boolean
  IsEnterpriseProduct: boolean
  ProductCondition: string | null;
  ResponseTimeInHours: string;
  ResolutionTimeInHours: string;
  StandByTimeInHours: string;
  IsOutSourcingNeeded: boolean;
  ProductCategoryId: number | null,
  ContractId: number | null
}

export const assetDetailForCallCordinatorDecoder: Decoder<AssetDetailForCallCordinator> = object({
  CategoryName: string,
  Make: string,
  ModelName: string,
  ProductSerialNumber: nullable(string),
  MspAssetId: nullable(string),
  WarrantyEndDate: nullable(string),
  IsVipProduct: boolean,
  IsEnterpriseProduct: boolean,
  ProductCondition: nullable(string),
  ResponseTimeInHours: string,
  ResolutionTimeInHours: string,
  StandByTimeInHours: string,
  IsOutSourcingNeeded: boolean,
  ProductCategoryId: nullable(number),
  ContractId: nullable(number)
});

export interface AssetDetailsForCallCordinator {
  AssetDetails: AssetDetailForCallCordinator;
}

export const assetDetailsForCallCordinatorDecoder: Decoder<AssetDetailsForCallCordinator> = object({
  AssetDetails: assetDetailForCallCordinatorDecoder,
});
//Call cordinator tab Asset Details ends