import { Decoder, array, boolean, nullable, number, object, string, undefined_ } from "decoders";

export interface RequestPart {
    ServiceRequestId: string | number;
    RequestedBy: string | number;
    Remarks: string;
    TenantOfficeId: number;
    partInfoList: PartIndentCartDetails[];
}

export interface PartRequestResult {
    IsPartRequestCreated: Boolean;
}

export const partRequestResultDecoder: Decoder<PartRequestResult> = object({
    IsPartRequestCreated: boolean,
});

export interface PartIndentList {
    Id: number;
    IndentRequestNumber: string;
    RequestedBy: string;
    Remarks: string | null;
    CreatedRequestCount: number;
    ApprovedRequestCount: number;
    RejectedRequestCount: number;
    CreatedOn: string;
}

export const partIndentListListDecoder: Decoder<PartIndentList> = object({
    Id: number,
    IndentRequestNumber: string,
    Remarks: nullable(string),
    RequestedBy: string,
    CreatedRequestCount: number,
    ApprovedRequestCount: number,
    RejectedRequestCount: number,
    CreatedOn: string,
})

export interface ServiceRequestPartIndentList {
    PartIndentRequestList: PartIndentList[]
}

export const ServiceRequestPartIndentListDecoder: Decoder<ServiceRequestPartIndentList> = object({
    PartIndentRequestList: array(partIndentListListDecoder)
});

export interface Select {
    value: any,
    label: any
}

export interface SelectDetails {
    SelectDetails: Select[];
}

export interface PartIndentDetails {
    Id: number;
    PartId: number;
    ProductCategoryName: string;
    PartCategoryName: string;
    MakeName: string;
    HsnCode: string;
    PartCode: string;
    PartName: string;
    OemPartNumber: string;
    Remarks: null | string;
    Quantity: number;
    PartRequestStatus: string;
    PartRequestStatusCode: string;
    StockType: string | null;
    IsWarrantyReplacement: boolean | null;
}

export const partIndentDetailsDecoder: Decoder<PartIndentDetails> = object({
    Id: number,
    PartId: number,
    ProductCategoryName: string,
    PartCategoryName: string,
    MakeName: string,
    HsnCode: string,
    PartCode: string,
    PartName: string,
    OemPartNumber: string,
    Remarks: nullable(string),
    Quantity: number,
    PartRequestStatus: string,
    PartRequestStatusCode: string,
    StockType: nullable(string),
    IsWarrantyReplacement: nullable(boolean)
});

export interface PartRequestable {
    IsComprehensive: boolean;
    IsUnderWarranty: boolean;
    WorkOrderNumber: null | string;
    IsRequestClosed: boolean;
}

export const partRequestableDecoder: Decoder<PartRequestable> = object({
    IsComprehensive: boolean,
    IsUnderWarranty: boolean,
    WorkOrderNumber: nullable(string),
    IsRequestClosed: boolean
});

export interface IsPartRequestable {
    IsPartRequestable: PartRequestable
}

export const isPartRequestableDecoder: Decoder<IsPartRequestable> = object({
    IsPartRequestable: partRequestableDecoder
});

export interface PartIndentCartDetails {
    Id: number;
    PartCategoryId: number;
    ProductCategoryName: string;
    PartCategoryName: string;
    MakeName: string;
    HsnCode: string;
    PartCode: string;
    PartName: string;
    OemPartNumber: string;
    Description: null | string;
    Quantity: number;
    Remarks?: null | string;
    StockTypeId: number;
    IsWarrantyReplacement: boolean | null;
}

export interface PartIndentCartList {
    Parts: PartIndentCartDetails[]
    TotalRows: number
    PerPage: number
}

export const partIndentCartDetailsDecoder: Decoder<PartIndentCartDetails> = object({
    Id: number,
    PartCategoryId: number,
    ProductCategoryName: string,
    PartCategoryName: string,
    MakeName: string,
    HsnCode: string,
    PartCode: string,
    PartName: string,
    OemPartNumber: string,
    Description: nullable(string),
    count: undefined_,
    Quantity: number,
    StockTypeId: number,
    IsWarrantyReplacement: nullable(boolean),
})

export const partIndentCartListDecoder: Decoder<PartIndentCartList> = object({
    Parts: array(partIndentCartDetailsDecoder),
    TotalRows: number,
    PerPage: number
});

export interface PartIndentRequests {
    Id: number;
    IndentRequestNumber: string;
    RequestedBy: string;
    Remarks: string | null;
    CreatedRequestCount: number;
    ApprovedRequestCount: number;
    RejectedRequestCount: number;
    CreatedOn: string;
    Location: string;
    CategoryName:string;
}

export const partIndentRequestDecoder: Decoder<PartIndentRequests> = object({
    Id: number,
    IndentRequestNumber: string,
    Remarks: nullable(string),
    RequestedBy: string,
    CreatedRequestCount: number,
    ApprovedRequestCount: number,
    RejectedRequestCount: number,
    CreatedOn: string,
    Location: string,
    CategoryName:string
})

export interface RequestPartIndentList {
    PartIndentRequestList: PartIndentRequests[],
    TotalRows: number;
    PerPage: number;
}

export const RequestPartIndentListDecoder: Decoder<RequestPartIndentList> = object({
    PartIndentRequestList: array(partIndentRequestDecoder),
    TotalRows: number,
    PerPage: number
});

export interface IsSmeReviewed {
    IsReviewed: boolean,
}

export const isSmeReviewedDecoder: Decoder<IsSmeReviewed> = object({
    IsReviewed: boolean
});

export interface ContractPartIndentCount {
    ApprovedPartIndentCount: number,
    RejectedPartIndentCount: number,
    TotalPartIndentCount: number,
    PendingPartIndentCount: number,
}

export const contractPartIndentCountDecoder: Decoder<ContractPartIndentCount> = object({
    ApprovedPartIndentCount: number,
    RejectedPartIndentCount: number,
    TotalPartIndentCount: number,
    PendingPartIndentCount: number
});

// PartRequest List for sme
export interface PartIndentDetailForSme {
    Id: number;
    HsnCode: string;
    PartCode: string;
    PartName: string;
    PartCategoryName: string;
    Quantity: number;
    PartRequestStatus: string;
    PartRequestStatusCode: string;
    IsWarrantyReplacement: boolean;
    StockType: string;
    StockTypeId: number;
    ReviewerComments: string | null;
}

export const partIndentDetailForSmeDecoder: Decoder<PartIndentDetailForSme> = object({
    Id: number,
    PartCategoryName: string,
    HsnCode: string,
    PartCode: string,
    PartName: string,
    Quantity: number,
    PartRequestStatus: string,
    PartRequestStatusCode: string,
    IsWarrantyReplacement: boolean,
    StockType: string,
    StockTypeId: number,
    ReviewerComments: nullable(string)
});
// Part PartRequest List for sme Ends

// selcted part indent info
export interface SelectedPartRequestInfo {
    Id: number;
    WorkOrderNumber: string;
    Location: string;
    IndentRequestNumber: string;
    RequestedBy: string;
    CreatedOn: string;
    Remarks: null | string;
    CallcenterRemarks: null | string;
    CustomerReportedIssue: string;
    ProductSerialNumber: string;
    Make: string;
    CategoryName: string;
    ModelName: string;
    IsWarranty: boolean;
    CallStatus: string,
    AssetProductCategoryId: number;
    ContractId: number;
    ServiceRequestId: number | null;
}

export const selectedpartRequestInfoDecoder: Decoder<SelectedPartRequestInfo> = object({
    Id: number,
    WorkOrderNumber: string,
    Location: string,
    IndentRequestNumber: string,
    RequestedBy: string,
    CreatedOn: string,
    Remarks: nullable(string),
    CallcenterRemarks: nullable(string),
    CustomerReportedIssue: string,
    ProductSerialNumber: string,
    Make: string,
    CategoryName: string,
    ModelName: string,
    CallStatus: string,
    IsWarranty: boolean,
    AssetProductCategoryId: number,
    ContractId: number,
    ServiceRequestId: nullable(number)
});
// selcted part indent info Ends

export interface PartIndentDetailsForSme {
    PartRequestInfo: PartIndentDetailForSme[],
    SelectedPartIndentInfo: SelectedPartRequestInfo;
}

export const partIndentDetailsForSmeDecoder: Decoder<PartIndentDetailsForSme> = object({
    PartRequestInfo: array(partIndentDetailForSmeDecoder),
    SelectedPartIndentInfo: selectedpartRequestInfoDecoder,
});

// PartRequest Stock Availability
export interface PartRequestStockAvailability {
    Quantity: number;
    Location: string;
}

export const partRequestStockAvailabilityDecoder: Decoder<PartRequestStockAvailability> = object({
    Quantity: number,
    Location: string,
});
// PartRequest Stock Availability

// PartRequest Location Wise Stock Availability
export interface PartRequestLocationWiseStockAvailability {
    Quantity: number;
    Location: string;
}

export const partRequestLocationWiseStockAvailabilityDecoder: Decoder<PartRequestLocationWiseStockAvailability> = object({
    Quantity: number,
    Location: string,
});
// PartRequest Location Wise Stock Availability

export interface PartRequestStockAvailabilityDetails {
    PartRequestAvailability: PartRequestStockAvailability[],
    PartRequestLocationWiseAvailability: PartRequestLocationWiseStockAvailability[];
}

export const partRequestStockAvailabilityDetailsDecoder: Decoder<PartRequestStockAvailabilityDetails> = object({
    PartRequestAvailability: array(partRequestStockAvailabilityDecoder),
    PartRequestLocationWiseAvailability: array(partRequestLocationWiseStockAvailabilityDecoder),
});

// part indent request update Details
export interface PartRequestEditDetail {
    Id: number;
    Quantity: number;
    PartCode: string;
    StockTypeId: number;
    IsWarrantyReplacement: boolean;
}

export const partRequestEditDetailDecoder: Decoder<PartRequestEditDetail> = object({
    Id: number,
    Quantity: number,
    PartCode: string,
    StockTypeId: number,
    IsWarrantyReplacement: boolean,
});

export interface PartRequestEditDetails {
    PartIntendDetails: PartRequestEditDetail;
}

export const partRequestEditDetailsDecoder: Decoder<PartRequestEditDetails> = object({
    PartIntendDetails: partRequestEditDetailDecoder,
});
// part indent request update Details Ends

// Part Request Update Result
export interface PartRequestUpdate {
    IsPartRequestUpdated: Boolean;
}

export const partRequestUpdateDecoder: Decoder<PartRequestUpdate> = object({
    IsPartRequestUpdated: boolean,
});
// Part Request Update Result Ends

export interface PartCategoryList {
    Id: number;
    Name: string;
}
export const partCategoryListDecoder: Decoder<PartCategoryList> = object({
    Id: number,
    Name: string
});
export interface PartCategoryNameList {
    PartCategories: PartCategoryList[]
}

export const partCategoryNameListDecoder: Decoder<PartCategoryNameList> = object({
    PartCategories: array(partCategoryListDecoder),
});

export interface PartSubCategoryList {
    Id: number;
    Name: string;
}
export const partSubCategoryListDecoder: Decoder<PartSubCategoryList> = object({
    Id: number,
    Name: string
});
export interface PartSubCategoryNameList {
    PartSubCategories: PartSubCategoryList[]
}

export const partSubCategoryNameListDecoder: Decoder<PartSubCategoryNameList> = object({
    PartSubCategories: array(partSubCategoryListDecoder),
});

export interface PartIndentDetailForSmeAll {
    PartIndentRequestId: number;
    PartIndentRequestDetailId: number;
    HsnCode: string;
    PartCode: string;
    PartName: string;
    PartCategoryName: string;
    Quantity: number;
    PartRequestStatus: string;
    PartRequestStatusCode: string;
    IsWarrantyReplacement: boolean;
    StockType: string;
    StockTypeId: number;
    ReviewerComments: string | null;
    IndentRequestNumber: string | null;
}

export const partIndentDetailForSmeAllDecoder: Decoder<PartIndentDetailForSmeAll> = object({
    PartIndentRequestId: number,
    PartIndentRequestDetailId: number,
    PartCategoryName: string,
    HsnCode: string,
    PartCode: string,
    PartName: string,
    Quantity: number,
    PartRequestStatus: string,
    PartRequestStatusCode: string,
    IsWarrantyReplacement: boolean,
    StockType: string,
    StockTypeId: number,
    ReviewerComments: nullable(string),
    IndentRequestNumber:nullable(string)
});

export interface PartIndentDetailsForSmeList {
    PartIndentRequestDetailsList: PartIndentDetailForSmeAll[],
    TotalRows: number;
    PerPage: number;
}

export const partIndentDetailsForSmeListDecoder: Decoder<PartIndentDetailsForSmeList> = object({
    PartIndentRequestDetailsList: array(partIndentDetailForSmeAllDecoder),
    TotalRows: number,
    PerPage: number
});

export interface PartIndentStatusCountItem {
    New: string;
    Hold: string;
    Approved: string;
    Rejected: string;
}

export const partIndentStatusCountItemDecoder: Decoder<PartIndentStatusCountItem> = object({
    New: string,
    Hold: string,
    Approved: string,
    Rejected: string
});

export interface PartIndentStatusCountResponse {
    PartIndentStatusCount: PartIndentStatusCountItem[];
}

export const partIndentStatusCountResponseDecoder: Decoder<PartIndentStatusCountResponse> = object({
    PartIndentStatusCount: array(partIndentStatusCountItemDecoder)
});

export interface SelectedPartRequestCommonDetails {
    Id: number;
    WorkOrderNumber: string;
    Location: string;
    IndentRequestNumber: string;
    RequestedBy: string;
    CreatedOn: string;
    Remarks: null | string;
    CallcenterRemarks: null | string;
    CustomerReportedIssue: string;
    ProductSerialNumber: string;
    Make: string;
    CategoryName: string;
    ModelName: string;
    IsWarranty: boolean;
    CallStatus: string,
    AssetProductCategoryId: number;
    ContractId: number;
    ServiceRequestId: number | null;
    ReviewedBy:string|null,
    ReviewedOn:string|null,
    ReviewerComments:string|null
}

export const selectedPartRequestCommonDetailsDecoder: Decoder<SelectedPartRequestCommonDetails> = object({
    Id: number,
    WorkOrderNumber: string,
    Location: string,
    IndentRequestNumber: string,
    RequestedBy: string,
    CreatedOn: string,
    Remarks: nullable(string),
    CallcenterRemarks: nullable(string),
    CustomerReportedIssue: string,
    ProductSerialNumber: string,
    Make: string,
    CategoryName: string,
    ModelName: string,
    CallStatus: string,
    IsWarranty: boolean,
    AssetProductCategoryId: number,
    ContractId: number,
    ServiceRequestId: nullable(number),
    ReviewedBy:nullable(string),
    ReviewedOn:nullable(string),
    ReviewerComments:nullable(string)
});

export interface PartIndentDetailsForSmeView {
    SelectedPartIndentInfo: SelectedPartRequestCommonDetails;
}

export const partIndentDetailsForSmeViewDecoder: Decoder<PartIndentDetailsForSmeView> = object({
    SelectedPartIndentInfo: selectedPartRequestCommonDetailsDecoder,
});