import { Decoder, array, boolean, nullable, number, object, string } from "decoders";
import { TenantInfoDetails } from "./tenantofficeinfo";
import { VendorNameList } from "./vendor";

export interface Select {
    value: any,
    label: any,
    code?: any
}

export interface SelectDetails {
    SelectDetails: Select[];
}

export interface masterDataList {
    DCType: Select[];
    TransportationMode: Select[];
    VendorTypes: Select[];
}

export interface tenantOffices {
    tenantOffice: TenantInfoDetails;
}

export interface vendorList {
    vendornames: VendorNameList;
}

export interface CreateDC {
    partstocks: number[];
    DcTypeId: number;
    DestinationTenantOfficeId: number | null;
    DestinationVendorTypeId: number | null;
    LogisticsVendorTypeId: number | null;
    DestinationEmployeeId: number | null;
    DestinationCustomerSiteId: number | null;
    DestinationVendorId: number | null;
    LogisticsVendorId: number | null;
    LogisticsReceiptNumber: string | null;
    LogisticsReceiptDate: string | null;
    ModeOfTransport: number | null;
    TrackingId: string | null;
    PartIndentDemandNumber: string | null;
    DCTypeCode: string;
}

export interface DCResponse {
    IsDCCreated: Boolean;
}

export const dcResponseDecoder: Decoder<DCResponse> = object({
    IsDCCreated: boolean,
});

export interface DeliveryChallanData {
    Id: number;
    DcNumber: string;
    DcDate: string;
    DcType: string;
    SourceTenantOfficeId: number;
    SourceTenantOffice: string;
    IssuedEmployee: string;
    DestinationEmployee:string | null;
    DestinationTenantOffice: string | null;
    DestinationVendor:string | null;
    DcTypeCode:string;
}

export const deliveryChallanDataDecoder: Decoder<DeliveryChallanData> = object({
    Id: number,
    DcNumber: string,
    DcDate: string,
    DcType: string,
    SourceTenantOfficeId: number,
    SourceTenantOffice: string,
    IssuedEmployee: string,
    DestinationEmployee: nullable(string),
    DestinationTenantOffice: nullable(string),
    DestinationVendor: nullable(string),
    DcTypeCode:string
});

export interface ListOfDeliveryChallan {
    DeliveryChallanList: DeliveryChallanData[],
    TotalRows: number;
    PerPage: number;
}

export const listOfDeliveryChallanDecoder: Decoder<ListOfDeliveryChallan> = object({
    DeliveryChallanList: array(deliveryChallanDataDecoder),
    TotalRows: number,
    PerPage: number
});

export interface DeliveryChallanDetails {
    Id: number;
    DcNumber: string;
    DcDate: string;
    DcType: string;
    IssuedEmployee: string;
    SourceTenantOffice: string;
    DestinationTenantOffice: string | null;
    DestinationVendor: string | null;
    DestinationEmployee: string | null;
    LogisticsVendor: string | null;
    LogisticsReceiptNumber: string | null;
    LogisticsReceiptDate: string | null;
    TrackingId: string | null;
    ModeOfTransport: string | null;
    DcTypeCode:string | null;
    PartIndentDemandNumber: string | null;
}

export const deliveryChallanDetailsDecoder: Decoder<DeliveryChallanDetails> = object({
    Id: number,
    DcNumber: string,
    DcDate: string,
    DcType: string,
    IssuedEmployee: string,
    SourceTenantOffice: string,
    TrackingId: nullable(string),
    DestinationTenantOffice: nullable(string),
    DestinationVendor: nullable(string),
    DestinationEmployee: nullable(string),
    LogisticsVendor: nullable(string),
    LogisticsReceiptNumber: nullable(string),
    LogisticsReceiptDate: nullable(string),
    ModeOfTransport: nullable(string),
    DcTypeCode:nullable(string),
    PartIndentDemandNumber: nullable(string)
});

export interface DeliveryChallanInfo {
    DeliveryChallanDetails: DeliveryChallanDetails
}

export const deliveryChallanInfoDecoder: Decoder<DeliveryChallanInfo> = object({
    DeliveryChallanDetails: deliveryChallanDetailsDecoder
});