import { Decoder, array, number, object, string, boolean, nullable } from 'decoders';

export interface ServiceRequest {
  Id: number;
  CaseId: string;
  WorkOrderNumber: null | string;
  CustomerName: string | null;
  ContractNumber: string | null;
  ContractId: number | null;
  EndUserPhone: string | null;
  MspAssetId: string | null;
  ModelName: string | null;
  CategoryName: string | null;
  ProductSerialNumber: string | null;
  CustomerServiceAddress: string | null;
  ContractAssetId: number | null;
  SiteName: string | null;
  Status: string;
  CaseReportedOn: string;
  WorkOrderCreatedOn: string | null;
  ResolutionTimeInHours: number;
  StatusCode: string;
}

export const serviceRequestDecoder: Decoder<ServiceRequest> = object({
  Id: number,
  CaseId: string,
  ContractNumber: string,
  WorkOrderNumber: nullable(string),
  ContractId: nullable(number),
  CustomerName: nullable(string),
  MspAssetId: nullable(string),
  EndUserPhone: nullable(string),
  ModelName: nullable(string),
  CategoryName: nullable(string),
  ProductSerialNumber: nullable(string),
  CustomerServiceAddress: nullable(string),
  ContractAssetId: nullable(number),
  SiteName: nullable(string),
  Status: string,
  CaseReportedOn: string,
  ResolutionTimeInHours: number,
  WorkOrderCreatedOn: nullable(string),
  StatusCode: string
});

export interface ServiceRequestList {
  ServiceRequestList: ServiceRequest[];
  TotalRows: number;
  PerPage: number;
}

export const serviceRequestListDecoder: Decoder<ServiceRequestList> = object({
  ServiceRequestList: array(serviceRequestDecoder),
  TotalRows: number,
  PerPage: number
});

export interface ServiceRequestDetails {
  Id: number;
  CaseId: string;
  CaseStatusId: number;
  WorkOrderNumber: string | null;
  Status: string;
  ProductCategoryId: number;
  CustomerReportedIssue: string;
  CallcenterRemarks: string | null;
  ProductMakeId: number,
  CustomerInfoId: number,
  CaseReportedOn: string;
  CreatedBy: string;
  CallSource: string;
  ContractId: number;
  ContractAssetId: number;
  EndUserName: string | null;
  CustomerName: string | null;
  CustomerSiteName: string | null;
  CustomerSiteAddress: string | null;
  ResolutionTimeInHours: number | null;
  WorkOrderCreatedOn: string | null;
  CallStatusCode: string;
}

export const serviceRequestDetailsDecoder: Decoder<ServiceRequestDetails> = object({
  Id: number,
  CaseId: string,
  WorkOrderNumber: nullable(string),
  Status: string,
  CaseStatusId: number,
  ProductCategoryId: number,
  CallcenterRemarks: nullable(string),
  CustomerReportedIssue: string,
  ContractAssetId: number,
  ProductMakeId: number,
  CustomerInfoId: number,
  CaseReportedOn: string,
  CreatedBy: string,
  CallSource: string,
  ContractId: number,
  EndUserName: nullable(string),
  CustomerName: nullable(string),
  CustomerSiteName: nullable(string),
  CustomerSiteAddress: nullable(string),
  ResolutionTimeInHours: nullable(number),
  WorkOrderCreatedOn: nullable(string),
  CallStatusCode: string
});

export interface ServiceRequestDetailsList {
  ServiceRequestDetails: ServiceRequestDetails;
}
export const serviceRequestViewDecoder: Decoder<ServiceRequestDetailsList> = object({
  ServiceRequestDetails: serviceRequestDetailsDecoder,
});

export interface ServiceRequestForCreation {
  ContractAssetId: number | null;
  ContractId: number | null;
  TenantOfficeId: number | null;
  IncidentId: string | null;
  TicketNumber: string | null;
  CallTypeId: number | null;
  CallStatusId: number | null;
  CallSourceId: number | null;
  CustomerReportedIssue: string;
  OptedForRemoteSupport: boolean;
  RemoteSupportNotOptedReason: number | null;
  CustomerInfoId: number | null;
  CustomerContactTypeId: number | null;
  CaseReportedOn: string;
  CaseReportedCustomerEmployeeName: string | null;
  EndUserName: string | null,
  EndUserPhone: string | null,
  EndUserEmail: string | null,
  RepairReason: string | null,
  CallCenterRemarks: string | null,
  CustomerContactEmail: string | null,
  CustomerSiteId: number | null,
  IsInterimCaseId: boolean,
  IsPreAmcApproval: boolean,
  IsFinanceApproval: boolean,
  ProductCategoryId: number | string;
  CustomerServiceAddress: string | null;
  ProductMakeId: number | string;
  ProductModelNumber: number | null;
  ProductSerialNumber: null | string;
  MspAssetId: string | null;
  ClosureRemarks: string | null;
  RemotelyClose: boolean
  HoursSpent: number | null;
  CallSeverityLevelId: number | null;
}

export interface ServiceRequestAsset {
  Id: number | null;
  ContractId: number | null;
  WarrantyEndDate: string | null;
  IsPreAmcCompleted: boolean | null;
  TenantOfficeId: number | null;
  ProductCategoryId: number;
  ProductMakeId: number | string;
  ProductModelNumber: number | null;
  ProductSerialNumber: null | string;
  MspAssetId: string | null;
  CustomerInfoId: number;
  CustomerAssetId: string | null;
  EndDate: string | null;
  ContractNumber: string | null;
  Location: string | null;
  AgreementType: string | null;
  ServiceMode: string | null;
  CallExpiryDate: string | null;
  CallStopDate: string | null;
  CallStopReason: string | null;
  CustomerContactAddress: string | null;
  CustomerSiteName: string | null,
  CustomerSiteId: number | null,
  CustomerContactName: string | null,
  CustomerContactEmail: string | null,
  CustomerName: string | null;
  IsCallStopped: string | null;
  ContractStatus: string;
}

export const serviceRequestAssetDecoder: Decoder<ServiceRequestAsset> = object({
  Id: number,
  ContractId: number,
  IsPreAmcCompleted: nullable(boolean),
  WarrantyEndDate: nullable(string),
  TenantOfficeId: number,
  CustomerSiteId: nullable(number),
  ProductCategoryId: number,
  ProductMakeId: number,
  ProductModelNumber: nullable(number),
  CustomerInfoId: number,
  ProductSerialNumber: string,
  MspAssetId: nullable(string),
  CustomerAssetId: nullable(string),
  EndDate: nullable(string),
  ContractNumber: nullable(string),
  Location: nullable(string),
  AgreementType: nullable(string),
  ServiceMode: nullable(string),
  CallExpiryDate: nullable(string),
  CallStopDate: nullable(string),
  CallStopReason: nullable(string),
  CustomerContactAddress: nullable(string),
  CustomerSiteName: nullable(string),
  CustomerContactName: nullable(string),
  CustomerContactEmail: nullable(string),
  CustomerName: nullable(string),
  IsCallStopped: nullable(string),
  ContractStatus: string,
});

export interface ServiceRequestAssetDetailsList {
  AssetDetails: ServiceRequestAsset
}

export const serviceRequestAssetListDecoder: Decoder<ServiceRequestAssetDetailsList> = object({
  AssetDetails: serviceRequestAssetDecoder,
});

export interface ServiceRequestCreateResult {
  IsCreated: boolean;
  IsInterimRequest: boolean;
}

export const createDecoder: Decoder<ServiceRequestCreateResult> = object({
  IsCreated: boolean,
  IsInterimRequest: boolean
});

// interim call

export interface Select {
  value: any,
  label: any
}

export interface SelectDetails {
  SelectDetails: Select[];
}

export interface CustomerContract {
  Id: number,
  ContractNumber: string
}

export const customerContract: Decoder<CustomerContract> = object({
  Id: number,
  ContractNumber: string
});

export interface CustomerContracts {
  Contracts: CustomerContract[];
}

export const customerContractsDecoder: Decoder<CustomerContracts> = object({
  Contracts: array(customerContract),
});

export interface InterimServiceRequestAssetDetail {
  ContractId: number | null;
  TenantOfficeId: number | null;
  CustomerInfoId: number;
  CustomerSiteId: number;
  StartDate: string | null;
  EndDate: string | null;
  ContractNumber: string | null;
  Location: string | null;
  AgreementType: string | null;
  ServiceMode: string | null;
  CallExpiryDate: string | null;
  CallStopDate: string | null;
  CallStopReason: string | null;
  CustomerContactAddress: string | null;
  CustomerSiteName: string | null,
  CustomerContactName: string | null,
  CustomerContactEmail: string | null,
  CustomerName: string | null,
}

export const interimServiceRequestAssetDetailDecoder: Decoder<InterimServiceRequestAssetDetail> = object({
  ContractId: number,
  CustomerInfoId: number,
  TenantOfficeId: number,
  CustomerSiteId: number,
  StartDate: nullable(string),
  EndDate: nullable(string),
  ContractNumber: nullable(string),
  Location: nullable(string),
  AgreementType: nullable(string),
  ServiceMode: nullable(string),
  CallExpiryDate: nullable(string),
  CallStopDate: nullable(string),
  CallStopReason: nullable(string),
  CustomerContactAddress: nullable(string),
  CustomerSiteName: nullable(string),
  CustomerContactName: nullable(string),
  CustomerContactEmail: nullable(string),
  CustomerName: nullable(string)
});

export interface InterimServiceRequestAssetDetails {
  AssetDetails: InterimServiceRequestAssetDetail;
}

export const interimServiceRequestAssetDetailsDecoder: Decoder<InterimServiceRequestAssetDetails> = object({
  AssetDetails: interimServiceRequestAssetDetailDecoder,
});

export interface CallClosureResult {
  ServiceRequestClosed: Boolean;
}

export const callClosureResultDecoder: Decoder<CallClosureResult> = object({
  ServiceRequestClosed: boolean,
});

export interface PrevTickets {
  Id: number;
  CaseId: string;
  WorkOrderNumber: string | null;
  WorkOrderCreatedOn: string | null;
  ClosedOn: string | null;
  CaseStatus: string;
  CaseStatusCode: string;
  CustomerReportedIssue: string;
}

export const prevTicketsDecoder: Decoder<PrevTickets> = object({
  Id: number,
  CaseId: string,
  WorkOrderNumber: nullable(string),
  WorkOrderCreatedOn: nullable(string),
  ClosedOn: nullable(string),
  CaseStatus: string,
  CaseStatusCode: string,
  CustomerReportedIssue: string
});

export interface PreviousTicketList {
  PreviousTickets: PrevTickets[];
  TotalRows: number;
}
export const previousTicketListDecoder: Decoder<PreviousTicketList> = object({
  PreviousTickets: array(prevTicketsDecoder),
  TotalRows: number
});

export interface InterimRequestReviewed {
  IsInterimRequestReviewed: Boolean;
}

export const interimRequestReviewedDecoder: Decoder<InterimRequestReviewed> = object({
  IsInterimRequestReviewed: boolean,
});

export interface InterimServiceRequestDetail {
  Id: number;
  CaseId: string;
  CustomerReportedIssue: string;
  CaseReportedOn: string;
  CustomerName: string
  CustomerSiteName: string | null,
  CustomerSiteAddress: string | null;
  CustomerContactName: string | null;
  CustomerContactEmail: string | null;
  AssetSerialNumber: string | null;
  CategoryName: string | null;
  Make: string | null;
  ModelName: string | null;
  ContractNumber: string | null;
  EndDate: string | null;
  Location: string | null;
  AgreementType: string | null;
  ServiceMode: string | null;
  CallExpiryDate: string | null;
  CallStopDate: string | null;
  CallStopReason: string | null;
  IsPreAmcApprovalNeeded: boolean
  IsPreAmcCompleted: boolean | null
  PreAmcCompletedDate: string | null;
  PreAmcCompletedBy: number | null;
}

export const interimServiceRequestDetailDecoder: Decoder<InterimServiceRequestDetail> = object({
  Id: number,
  CaseId: string,
  CustomerReportedIssue: string,
  CaseReportedOn: string,
  CustomerName: string,
  CustomerSiteName: nullable(string),
  CustomerSiteAddress: nullable(string),
  CustomerContactName: nullable(string),
  CustomerContactEmail: nullable(string),
  AssetSerialNumber: nullable(string),
  CategoryName: nullable(string),
  Make: nullable(string),
  ModelName: nullable(string),
  ContractNumber: nullable(string),
  EndDate: nullable(string),
  Location: nullable(string),
  AgreementType: nullable(string),
  ServiceMode: nullable(string),
  CallExpiryDate: nullable(string),
  CallStopDate: nullable(string),
  CallStopReason: nullable(string),
  IsPreAmcApprovalNeeded: boolean,
  IsPreAmcCompleted: nullable(boolean),
  PreAmcCompletedDate: nullable(string),
  PreAmcCompletedBy: nullable(number)
});

export interface InterimServiceRequestDetails {
  InterimServiceRequestDetails: InterimServiceRequestDetail;
}

export const interimServiceRequestDetailsDecoder: Decoder<InterimServiceRequestDetails> = object({
  InterimServiceRequestDetails: interimServiceRequestDetailDecoder,
});

export interface GetServiceRequestCallTotalCount {
  data: {
    RegularCallTotalCount: number;
    InterimCallTotalCount: number;
  };
  status: number;
}

export const getServiceRequestCallTotalCountDecoder: Decoder<GetServiceRequestCallTotalCount> = object({
  data: object({
    RegularCallTotalCount: number,
    InterimCallTotalCount: number,
  }),
  status: number,
})

export interface ContractServiceRequestCount {
  OpenServiceRequestCount: number,
  ClosedServiceRequestCount: number,
  TotalServiceRequestCount: number,
}

export const contractServiceRequestCountDecoder: Decoder<ContractServiceRequestCount> = object({
  OpenServiceRequestCount: number,
  ClosedServiceRequestCount: number,
  TotalServiceRequestCount: number,
});

export interface ServiceRequestCount {
  ContractServiceRequestCount: ContractServiceRequestCount;
}

export const serviceRequestCountDecoder: Decoder<ServiceRequestCount> = object({
  ContractServiceRequestCount: contractServiceRequestCountDecoder,
});

export interface ServiceRequestSummary {
  Id: number | string;
  WorkOrderNumber: string | null;
  CustomerReportedIssue: string;
  CallCenterRemarks: string | null;
  MspProvidedSolution: string | null;
  CaseReportedOn: string;
  ClosedBy: string | null;
  IncidentId: string | null;
  CallStatus: string;
  CallType: string;
  ContractStartDate: string,
  ContractEndDate: string,
  ContractNumber: string;
  SiteName: string;
  SiteAddress: string;
  CustomerSiteState: string;
  CustomerSiteCity: string;
  CustomerSitePincode: string;
  SiteCreatedBy: string;
  ResponseTimeInHours: string;
  StandByTimeInHours: string;
  CustomerName: string;
  ResolutionTimeInHours: string;
  ProductCategory: string;
  ModelNo: string | null;
  Make: string | null;
  Serialno: string | null;
  VipAsset: boolean | null;
  WarrantyType: string | null;
  CallClosedDateTime: string | null;
  CallloggedDateTime: string;
  ServiceWindow: string;
  PartCategoryNames: string | null;
  BilledToAddress: string;
  CustomerCity: string;
  CustomerState: string;
  BilledToPincode: string;
  ContactEmail: string | null;
  ContactName: string | null;
  ContactPhone: string | null;
  EngAssignDateTime: string | null;
  Engineer: string | null;
}

export const serviceRequestsummaryDecoder: Decoder<ServiceRequestSummary> = object({
  Id: number,
  WorkOrderNumber: nullable(string),
  CustomerReportedIssue: string,
  CallCenterRemarks: nullable(string),
  MspProvidedSolution: nullable(string),
  CaseReportedOn: string,
  ClosedBy: nullable(string),
  IncidentId: nullable(string),
  CallStatus: string,
  CallType: string,
  ContractStartDate: string,
  ContractEndDate: string,
  ContractNumber: string,
  SiteName: string,
  SiteAddress: string,
  CustomerSiteState: string,
  CustomerSiteCity: string,
  CustomerSitePincode: string,
  SiteCreatedBy: string,
  ResponseTimeInHours: string,
  StandByTimeInHours: string,
  CustomerName: string,
  ResolutionTimeInHours: string,
  ProductCategory: string,
  ModelNo: nullable(string),
  Make: nullable(string),
  Serialno: nullable(string),
  VipAsset: nullable(boolean),
  WarrantyType: nullable(string),
  CallClosedDateTime: nullable(string),
  CallloggedDateTime: string,
  ServiceWindow: string,
  PartCategoryNames: nullable(string),
  BilledToAddress: string,
  CustomerCity: string,
  CustomerState: string,
  BilledToPincode: string,
  ContactEmail: nullable(string),
  ContactName: nullable(string),
  ContactPhone: nullable(string),
  EngAssignDateTime: nullable(string),
  Engineer: nullable(string),
});

export interface ServiceRequestSummaryDetails {
  ServiceRequestSummary: ServiceRequestSummary;
}
export const serviceRequestSummaryDetailsDecoder: Decoder<ServiceRequestSummaryDetails> = object({
  ServiceRequestSummary: serviceRequestsummaryDecoder,
});

export interface InterimAssetDetail {
  CustomerSiteAddress: string | null;
  CustomerContactName: string | null;
  CustomerContactEmail: string | null;
  AssetSerialNumber: string;
  ContractId: number;
  CustomerSiteId: number;
  ProductMakeId: number;
  ProductModelId: number;
  ProductCategoryId: number;
  CustomerSiteName: string;
  ServiceRequestId: number;
  InterimAssetId: number | null;
  IsProductCountExceeded: boolean
  InterimAssetStatusId: number;
  CategoryName: string | null;
  Make: string | null;
  ModelName: string | null;
}

export const interimAssetDetailDecoder: Decoder<InterimAssetDetail> = object({
  CustomerSiteAddress: nullable(string),
  CustomerContactName: nullable(string),
  CustomerContactEmail: nullable(string),
  AssetSerialNumber: string,
  ContractId: number,
  CustomerSiteId: number,
  ProductMakeId: number,
  ProductModelId: number,
  ProductCategoryId: number,
  CustomerSiteName: string,
  ServiceRequestId: number,
  InterimAssetId: nullable(number),
  IsProductCountExceeded: boolean,
  InterimAssetStatusId: number,
  CategoryName: nullable(string),
  Make: nullable(string),
  ModelName: nullable(string),
});

export interface InterimAssetInfo {
  InterimAssetDetails: InterimAssetDetail;
}

export const interimAssetInfoDecoder: Decoder<InterimAssetInfo> = object({
  InterimAssetDetails: interimAssetDetailDecoder,
});

// Service Request update

export interface ServiceRequestEdit {
  Id: number,
  IncidentId: string | null;
  TicketNumber: string | null;
  CallStatusId: number | null;
  CustomerReportedIssue: string;
  CaseReportedCustomerEmployeeName: string | null;
  CaseReportedOn: string;
  EndUserName: string | null,
  EndUserPhone: string | null,
  EndUserEmail: string | null,
  CallTypeId: number | null;
  RepairReason: string | null,
  CallCenterRemarks: string | null,
  OptedForRemoteSupport: boolean;
  RemoteSupportNotOptedReason: number | null;
  CustomerContactTypeId: number | null;
  CallSourceId: number | null;
  CustomerServiceAddress: string | null;
  IsInterimCaseId: boolean
  RemotelyClose?: boolean;
  ClosureRemarks?: string | null;
  HoursSpent?: number | null;
  CallSeverityLevelId: number | null;
}

export interface ServiceRequestEditDetail {
  ServiceRequestId: number,
  IncidentId: string | null;
  TicketNumber: string | null;
  CaseStatusId: number | null;
  CustomerReportedIssue: string;
  CaseReportedCustomerEmployeeName: string | null;
  CaseReportedOn: string;
  EndUserName: string | null,
  EndUserPhone: string | null,
  EndUserEmail: string | null,
  CallTypeId: number | null;
  RepairReason: string | null,
  CallCenterRemarks: string | null,
  OptedForRemoteSupport: boolean;
  RemoteSupportNotOptedReason: number | null;
  CustomerContactTypeId: number | null;
  CallSourceId: number | null;
  CustomerServiceAddress: string | null;
  AssetId: number;
  ContractId: number | null;
  WarrantyEndDate: string | null;
  IsPreAmcCompleted: boolean | null;
  IsInterimCaseId: boolean
  TenantOfficeId: number | null;
  ProductCategoryId: number;
  ProductMakeId: number | string;
  ProductModelId: number | null;
  ProductSerialNumber: null | string;
  MspAssetId: string | null;
  CustomerAssetId: string | null;
  EndDate: string | null;
  ContractNumber: string | null;
  Location: string | null;
  AgreementType: string | null;
  ServiceMode: string | null;
  CallExpiryDate: string | null;
  CallStopReason: string | null;
  CustomerContactAddress: string | null;
  CustomerSiteName: string | null,
  CustomerContactName: string | null,
  CustomerContactEmail: string | null,
  CustomerName: string | null;
  ContractStatus: string;
  CallSeverityLevelId: number | null;
}

export interface ServiceRequestEditDetails {
  ServiceRequestDetails: ServiceRequestEditDetail;
}

export const serviceRequestEditDetails: Decoder<ServiceRequestEditDetail> = object({
  ServiceRequestId: number,
  IncidentId: nullable(string),
  TicketNumber: nullable(string),
  CaseStatusId: nullable(number),
  CustomerReportedIssue: string,
  CaseReportedCustomerEmployeeName: nullable(string),
  CaseReportedOn: string,
  EndUserName: nullable(string),
  EndUserPhone: nullable(string),
  EndUserEmail: nullable(string),
  CallTypeId: nullable(number),
  RepairReason: nullable(string),
  CallCenterRemarks: nullable(string),
  OptedForRemoteSupport: boolean,
  IsInterimCaseId: boolean,
  RemoteSupportNotOptedReason: nullable(number),
  CustomerContactTypeId: nullable(number),
  CallSourceId: nullable(number),
  CustomerServiceAddress: nullable(string),
  AssetId: number,
  ContractId: number,
  IsPreAmcCompleted: nullable(boolean),
  WarrantyEndDate: nullable(string),
  TenantOfficeId: number,
  ProductCategoryId: number,
  ProductMakeId: number,
  ProductModelId: nullable(number),
  ProductSerialNumber: string,
  MspAssetId: nullable(string),
  CustomerAssetId: nullable(string),
  EndDate: nullable(string),
  ContractNumber: nullable(string),
  Location: nullable(string),
  AgreementType: nullable(string),
  ServiceMode: nullable(string),
  CallExpiryDate: nullable(string),
  CallStopReason: nullable(string),
  CustomerContactAddress: nullable(string),
  CustomerSiteName: nullable(string),
  CustomerContactName: nullable(string),
  CustomerContactEmail: nullable(string),
  CustomerName: nullable(string),
  ContractStatus: string,
  CallSeverityLevelId:nullable(number)
});

export const serviceRequestEditDetailsDecoder: Decoder<ServiceRequestEditDetails> = object({
  ServiceRequestDetails: serviceRequestEditDetails,
});


export interface ServiceRequestUpdateResult {
  IsUpdated: boolean;
}

export const serviceRequestUpdateDecoder: Decoder<ServiceRequestUpdateResult> = object({
  IsUpdated: boolean,
});

// Interim Service Request List
export interface InterimServiceRequest {
  Id: number;
  CaseId: string;
  CustomerName: string | null;
  ContractNumber: string | null;
  EndUserPhone: string | null;
  ModelName: string | null;
  CategoryName: string | null;
  ProductSerialNumber: string | null;
  CustomerServiceAddress: string | null;
  SiteName: string | null;
  Status: string;
  CallSource: string;
  StatusCode: string;
  CaseReportedOn: string;
}

export const interimServiceRequestDecoder: Decoder<InterimServiceRequest> = object({
  Id: number,
  CaseId: string,
  ContractNumber: string,
  CustomerName: nullable(string),
  EndUserPhone: nullable(string),
  ModelName: nullable(string),
  CategoryName: nullable(string),
  ProductSerialNumber: nullable(string),
  CustomerServiceAddress: nullable(string),
  SiteName: nullable(string),
  Status: string,
  CallSource: string,
  StatusCode: string,
  CaseReportedOn: string,
});

export interface InterimServiceRequestList {
  ServiceRequestList: InterimServiceRequest[];
  TotalRows: number;
  PerPage: number;
}

export const interimServiceRequestListDecoder: Decoder<InterimServiceRequestList> = object({
  ServiceRequestList: array(interimServiceRequestDecoder),
  TotalRows: number,
  PerPage: number
});
// Interim Service Request List Ends

// Call Create Asset Exist Check Details
export interface AssetExistDetail {
  AssetId: number | null;
  IsRegularAssetExist: boolean | null;
  IsInterimAssetExist: boolean | null;
  IsCallOpen: boolean | null;
  WorkOrderNumber: string | null;
}

export const assetExistDetailDecoder: Decoder<AssetExistDetail> = object({
  AssetId: nullable(number),
  IsRegularAssetExist: nullable(boolean),
  IsInterimAssetExist: nullable(boolean),
  IsCallOpen: nullable(boolean),
  WorkOrderNumber: nullable(string)
});

export interface AssetExistDetails {
  AssetExistDetails: AssetExistDetail;
}

export const assetExistDetailsDecoder: Decoder<AssetExistDetails> = object({
  AssetExistDetails: assetExistDetailDecoder,
});

export interface CallDetailsForSmeView {
  Id: number,
  CaseId?: string | null;
  WorkOrderNumber?: string | null;
  ContractNumber?: string | null;
  Status?: string | null;
  StatusCode?: string | null;
  ModelName?: string | null;
  CategoryName?: string | null;
  ProductSerialNumber?: string | null;
  CustomerName?: string | null;
  CustomerServiceAddress?: string | null;
  EndUserPhone?: string | null;
  CustomerReportedIssue?: string | null;
  CallcenterRemarks?: string | null;
  CreatedBy?: string | null;
  ResolutionTimeInHours?: string | null;
  WorkOrderCreatedOn?: string | null;
}

export const callDetailsForSmeViewDecoder: Decoder<CallDetailsForSmeView> = object({
  Id: number,
  CaseId: nullable(string),
  WorkOrderNumber: nullable(string),
  ContractNumber: nullable(string),
  Status: nullable(string),
  StatusCode: nullable(string),
  ModelName: nullable(string),
  CategoryName: nullable(string),
  ProductSerialNumber: nullable(string),
  CustomerName: nullable(string),
  CustomerServiceAddress: nullable(string),
  EndUserPhone: nullable(string),
  CustomerReportedIssue: nullable(string),
  CallcenterRemarks: nullable(string),
  CreatedBy: nullable(string),
  ResolutionTimeInHours: nullable(string),
  WorkOrderCreatedOn: nullable(string),
})

export interface CallDetailsForSme {
  ServiceRequestListDetailsForSme: CallDetailsForSmeView[];
  TotalRows: number;
  PerPage: number;
}

export const callDetailsForSmeDecoder: Decoder<CallDetailsForSme> = object({
  ServiceRequestListDetailsForSme: array(callDetailsForSmeViewDecoder),
  TotalRows: number,
  PerPage: number
})