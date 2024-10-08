export interface InvoiceCollectionReportFilter {
    DateFrom: string|null;
    DateTo: string|null;
    TenantRegionId: number|null;
    TenantOfficeId: number|null;
    CustomerGroupId:number|null;
    CustomerId:number|null;
}

export interface OutstandingPaymentReportFilter {
    DateFrom: string|null;
    DateTo: string|null;
    TenantRegionId: number|null;
    TenantOfficeId: number|null;
    CustomerGroupId:number|null;
    CustomerId:number|null;
}

export interface RevenueDueReportFilter {
    DateFrom: string|null;
    DateTo: string|null;
    TenantRegionId: number|null;
    TenantOfficeId: number|null;
    CustomerGroupId:number|null;
    CustomerId:number|null;
}

export interface BillingDetailReportFilter {
    DateFrom: string|null;
    DateTo: string|null;
    TenantRegionId: number|null;
    TenantOfficeId: number|null;
    CustomerGroupId:number|null;
    CustomerId:number|null;
}