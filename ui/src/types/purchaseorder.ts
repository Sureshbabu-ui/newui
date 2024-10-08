import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface RequestPOResponse {
    IsUpdated: Boolean;
}

export const requestPoResponseDecoder: Decoder<RequestPOResponse> = object({
    IsUpdated: boolean,
});

export interface RequestForPurchaseOrder {
    Id: number;
    VendorId: number;
    VendorTypeId: number | null;
    Price: number;
    StockTypeId: number;
    WarrantyPeriod: number;
}

export interface CreatePurchaseOrder {
    PartId: number;
    DemandId: number;
    PartIndentRequestId: number;
    TenantOfficeId: number;
    VendorId: number;
    VendorTypeId: number|null;
    VendorBranchId: number | null;
    ShipToTenantOfficeInfoId: number | null;
    ShipToCustomerSiteId: number | null;
    BillToTenantOfficeInfoId: number;
    Description: string | null;
    CgstRate: number;
    SgstRate: number;
    IgstRate: number;
    StockTypeId: number,
    Price: number;
}

export interface CreatePOResponse {
    IsPOCreated: Boolean;
}

export const createPoResponseDecoder: Decoder<CreatePOResponse> = object({
    IsPOCreated: boolean,
});

export interface PurchaseOrdersList {
    Id: number;
    PoNumber: string;
    PoDate: string;
    Vendor: string;
    VendorId: number;
    TenantOffice: string;
}

export const purchaseOrdersListDecoder: Decoder<PurchaseOrdersList> = object({
    Id: number,
    PoNumber: string,
    PoDate: string,
    Vendor: string,
    VendorId: number,
    TenantOffice: string
});

export interface LocationWisePurchaseOrdersList {
    PurchaseOrders: PurchaseOrdersList[],
    TotalRows: number;
    PerPage: number;
}

export const locationWisePurchaseOrdersListDecoder: Decoder<LocationWisePurchaseOrdersList> = object({
    PurchaseOrders: array(purchaseOrdersListDecoder),
    TotalRows: number,
    PerPage: number
});

export interface PurchaseOrderDetail {
    Id: number;
    PoNumber: string;
    PoDate: string;
    Vendor: string;
    TenantOffice: string;
    BillToTenantOffice: string;
    BillToAddress: string;
    ShipToTenantOffice: string;
    ShipToAddress: string;
    IndentRequestNumber: string | null;
    PoStatus: string;
    Quantity: number;
    GrnReceivedQuantity: number;
    Price: number;
    PartName: string | null;
    CgstRate: number;
    IgstRate: number;
    SgstRate: number;
    PoPartType: string;
}

export const purchaseOrderDecoder: Decoder<PurchaseOrderDetail> = object({
    Id: number,
    PoNumber: string,
    PoDate: string,
    Vendor: string,
    TenantOffice: string,
    BillToTenantOffice: string,
    BillToAddress: string,
    ShipToTenantOffice: string,
    ShipToAddress: string,
    IndentRequestNumber: nullable(string),
    PoStatus: string,
    Quantity: number,
    GrnReceivedQuantity: number,
    Price: number,
    PartName: nullable(string),
    CgstRate: number,
    IgstRate: number,
    SgstRate: number,
    PoPartType: string
})

export interface purchaseOrderDetails {
    PurchaseOrderDetails: PurchaseOrderDetail[],
}

export const purchaseOrderDetailsDecoder: Decoder<purchaseOrderDetails> = object({
    PurchaseOrderDetails: array(purchaseOrderDecoder),
});

export interface PurchaseOrders {
    Id: number;
    PoNumber: string;
    PoDate: string;
    Vendor: string;
    VendorId: number;
    TenantOffice: string;
    PoStatus: string;
}

export const purchaseordersDecoder: Decoder<PurchaseOrders> = object({
    Id: number,
    PoNumber: string,
    PoDate: string,
    Vendor: string,
    VendorId: number,
    TenantOffice: string,
    PoStatus: string
});

export interface ListPurchaseOrders {
    PurchaseOrders: PurchaseOrders[],
    TotalRows: number;
    PerPage: number;
}

export const ListPurchaseOrdersDecoder: Decoder<ListPurchaseOrders> = object({
    PurchaseOrders: array(purchaseordersDecoder),
    TotalRows: number,
    PerPage: number
});

export interface Select {
    value: any,
    label: any,
    code?: any
}

export interface SelectDetails {
    Select: Select[]
}