import { Decoder, array, boolean, nullable, number, object, string } from "decoders";
import { PartIndentDetails } from "./partIndent";
import { bool } from "yup";

export interface Select {
    value: any,
    label: any,
    code?: any
}

export interface SelectDetails {
    SelectDetails: Select[]
}

export interface Configurations {
    UnitOfMeasurement: Select[],
}

export interface PartIndentDemandList {
    Id: number;
    DemandDate: string;
    DemandNumber: string;
    PartIndentRequestNumber: string;
    Remarks: string;
    TenantOfficeName: string;
    UnitOfMeasurement: string;
    CreatedBy: string;
    WorkOrderNumber: string;
    Quantity: number;
    PartName: string;
    PartId: number;
    RecipientUserId: number;
    TenantOfficeId: number;
    IsCwhAttentionNeeded: Boolean;
    PartCode: string;
    VendorId: number;
    Price: number;
    AllocatedOn?: string | null;
    CLPartCount?: number | null;
}

export const PartIndentDemandDecoder: Decoder<PartIndentDemandList> = object({
    Id: number,
    DemandDate: string,
    DemandNumber: string,
    PartIndentRequestNumber: string,
    Remarks: string,
    TenantOfficeName: string,
    UnitOfMeasurement: string,
    CreatedBy: string,
    WorkOrderNumber: string,
    Quantity: number,
    PartName: string,
    PartId: number,
    RecipientUserId: number,
    TenantOfficeId: number,
    IsCwhAttentionNeeded: boolean,
    PartCode: string,
    VendorId: number,
    Price: number,
    AllocatedOn: nullable(string),
    CLPartCount: nullable(number)
});

export interface partIndentDemandList {
    PartIndentDemandList: PartIndentDemandList[],
    TotalRows: number;
    PerPage: number;
}

export const partIndentDemandListDecoder: Decoder<partIndentDemandList> = object({
    PartIndentDemandList: array(PartIndentDemandDecoder),
    TotalRows: number,
    PerPage: number
});

export interface IsGIRNCreated {
    IsGirnCreated: Boolean;
}

export const isGirnCreatedDecoder: Decoder<IsGIRNCreated> = object({
    IsGirnCreated: boolean,
});

export interface ForPartStock {
    PartId: number;
    DemandQuantity: number;
    TenantOfficeId: number;
    PartIndentDemandId: number;
}

export interface PartIndentDemandDetail {
    Id: number;
    LocationId: number;
    PartIndentRequestId: number;
    DemandDate: string;
    DemandNumber: string;
    PartIndentRequestNumber: string;
    Remarks: string;
    TenantOfficeName: string;
    UnitOfMeasurement: string;
    WorkOrderNumber: string;
    DemandQuantity: number;
    PartName: string;
    PartCode: string;
    HsnCode: string;
    OemPartNumber: string;
    PartQuantity: number;
    Recipient: string;
    CLPartCount: number;
    OLPartCount: number;
    CWHPartCount: number;
    POCount: number;
    GIRNCount: number;
    Price: number | null;
    VendorId: number | null;
    VendorTypeId: number | null;
    RecipientUserId: number;
    PartId: number;
    CallCreatedBy: string;
    CallCreatedOn: string;
    TenantOfficeId: number;
    IsCwhAttentionNeeded: Boolean | null;
    StockTypeId: number;
    CustomerInfoId: number;
}

export const partIndentDemandDecoder: Decoder<PartIndentDemandDetail> = object({
    Id: number,
    LocationId: number,
    PartIndentRequestId: number,
    DemandDate: string,
    DemandNumber: string,
    PartIndentRequestNumber: string,
    Remarks: string,
    TenantOfficeName: string,
    UnitOfMeasurement: string,
    WorkOrderNumber: string,
    DemandQuantity: number,
    PartName: string,
    PartCode: string,
    HsnCode: string,
    OemPartNumber: string,
    PartQuantity: number,
    Recipient: string,
    CLPartCount: number,
    OLPartCount: number,
    CWHPartCount: number,
    Price: nullable(number),
    VendorId: nullable(number),
    VendorTypeId: nullable(number),
    RecipientUserId: number,
    PartId: number,
    CallCreatedBy: string,
    CallCreatedOn: string,
    TenantOfficeId: number,
    IsCwhAttentionNeeded: nullable(boolean),
    POCount: number,
    GIRNCount: number,
    StockTypeId: number,
    CustomerInfoId: number
});

export interface IndentDemandDetail {
    Indentdemandetails: PartIndentDemandDetail
}

export const indentDemandDetailDecoder: Decoder<IndentDemandDetail> = object({
    Indentdemandetails: partIndentDemandDecoder,
});

export interface IsCwhAttentionAdded {
    IsUpdated: Boolean;
}

export const isCwhAttentionAddedDecoder: Decoder<IsCwhAttentionAdded> = object({
    IsUpdated: boolean,
});

export interface PartAllocation {
    PartIndentDemandId: number;
    TenantOfficeId: number;
}

export interface IsPartAllocated {
    IsAllocated: Boolean;
}

export const isPartAllocatedDecoder: Decoder<IsPartAllocated> = object({
    IsAllocated: boolean,
});


export interface PartIndentDemandLogistics {
    Id: number;
    DemandDate: string;
    DemandNumber: string;
    PartIndentRequestNumber: string;
    Remarks: string;
    TenantOfficeName: string;
    UnitOfMeasurement: string;
    CreatedBy: string;
    WorkOrderNumber: string;
    Quantity: number;
    PartName: string;
    PartId: number;
    RecipientUserId: number;
    TenantOfficeId: number;
    IsCwhAttentionNeeded: Boolean;
    PartCode: string;
    VendorId: number;
    Price: number;
    AllocatedOn: string | null;
    CLPartCount: number;
    StockTypeId: number;
}

export const partIndentDemandLogisticsDecoder: Decoder<PartIndentDemandLogistics> = object({
    Id: number,
    DemandDate: string,
    DemandNumber: string,
    PartIndentRequestNumber: string,
    Remarks: string,
    TenantOfficeName: string,
    UnitOfMeasurement: string,
    CreatedBy: string,
    WorkOrderNumber: string,
    Quantity: number,
    PartName: string,
    PartId: number,
    RecipientUserId: number,
    TenantOfficeId: number,
    IsCwhAttentionNeeded: boolean,
    PartCode: string,
    VendorId: number,
    Price: number,
    AllocatedOn: nullable(string),
    CLPartCount: number,
    StockTypeId: number
});

export interface PartIndentDemandLogisticsList {
    PartIndentDemandList: PartIndentDemandLogistics[],
    TotalRows: number;
    PerPage: number;
}

export const partIndentDemandLogisticsListDecoder: Decoder<PartIndentDemandLogisticsList> = object({
    PartIndentDemandList: array(partIndentDemandLogisticsDecoder),
    TotalRows: number,
    PerPage: number
});

export interface IsPartsIssued {
    IsPartIssued: Boolean;
}

export const isPartIssuedDecoder: Decoder<IsPartsIssued> = object({
    IsPartIssued: boolean,
});

export interface GinDetail {
    GinDate: string | null;
    Id: number;
    GinNumber: string | null;
    AllocatedOn: string;
    RecipientUser: string | null;
    ReceivedOn: string | null;
    Remarks: string | null;
    TenantOffice: string;
    DeliveryChallanId: number | null;
}

export const ginDetailDecoder: Decoder<GinDetail> = object({
    GinDate: nullable(string),
    Id: number,
    GinNumber: nullable(string),
    AllocatedOn: string,
    RecipientUser: nullable(string),
    ReceivedOn: nullable(string),
    Remarks: nullable(string),
    TenantOffice: string,
    DeliveryChallanId: nullable(number)
});

export interface GoodsissuereceivednoteDetail {
    GinDetails: GinDetail
}

export const goodsissuereceivednoteDetailDecoder: Decoder<GoodsissuereceivednoteDetail> = object({
    GinDetails: ginDetailDecoder,
});

export interface Demands {
    DemandList: UnprocessedDemands[];
}

export interface UnprocessedDemands {
    Id: number;
    DemandNumber: string;
    DemandAddress: string;
}

export const unprocessedDemandsDecoder: Decoder<UnprocessedDemands> = object({
    Id: number,
    DemandNumber: string,
    DemandAddress: string
});

export interface UnprocessedDemandList {
    DemandList: UnprocessedDemands[];
}

export const unprocessedDemandListDecoder: Decoder<UnprocessedDemandList> = object({
    DemandList: array(unprocessedDemandsDecoder),
});


export interface DemandReport {
    DateFrom: string;
    DateTo: string;
    TenantRegionId: number;
    TenantOfficeId: number;
}

export interface DemandList {
    DemandId: number;
    PartId: number;
    StockTypeId: number;
    Price: number | null;
    PartName: string;
    PartCode: string;
    HsnCode: string;
    OemPartNumber: string;
    Quantity: number;
    PartCategoryName: string;
    ProductCategoryName: string;
    MakeName: string;
    GstRate: number;
    Description: string;
    Cgst?: number;
    Sgst?: number;
    Igst?: number;
    PartIndentRequestId: number;
}

export const demandListDecoder: Decoder<DemandList> = object({
    DemandId: number,
    PartId: number,
    StockTypeId: number,
    Price: nullable(number),
    PartName: string,
    PartCode: string,
    HsnCode: string,
    OemPartNumber: string,
    Quantity: number,
    PartCategoryName: string,
    ProductCategoryName: string,
    MakeName: string,
    GstRate: number,
    Description: string,
    PartIndentRequestId: number
});

export interface IndentDemandDetailList {
    Indentdemandetails: DemandList[];
}

export const indentDemandDetailListDecoder: Decoder<IndentDemandDetailList> = object({
    Indentdemandetails: array(demandListDecoder),
});
