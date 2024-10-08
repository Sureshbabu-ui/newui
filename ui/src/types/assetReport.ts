export interface PMAssetDetailReportFilter {
    StatusType:string|null
    DateFrom: string|null;
    DateTo: string|null;
    TenantRegionId: number|null;
    TenantOfficeId: number|null;
    CustomerId:number|null;
    ContractId:number|null;
    CustomerSiteId:number|null;
    AssetProductCategoryId:number|null;
    MakeId:number|null;
    ProductModelId:number|null;
}

export interface PMAssetSummaryReportFilter {
    DateFrom: string|null;
    DateTo: string|null;
    TenantRegionId: number|null;
    TenantOfficeId: number|null;
    CustomerId:number|null;
    ContractId:number|null;
    CustomerSiteId:number|null;
}

export interface PreAmcAssetDetailReportFilter {
    AssetConditionId:number|null
    DateFrom: string|null;
    DateTo: string|null;
    TenantRegionId: number|null;
    TenantOfficeId: number|null;
    CustomerId:number|null;
    ContractId:number|null;
    CustomerSiteId:number|null;
    AssetProductCategoryId:number|null;
    MakeId:number|null;
    ProductModelId:number|null;
    OutSourceNeeded:string|null
}

export interface PreAmcAssetSummaryReportFilter {
    DateFrom: string|null;
    DateTo: string|null;
    TenantRegionId: number|null;
    TenantOfficeId: number|null;
    CustomerId:number|null;
    ContractId:number|null;
    CustomerSiteId:number|null;
}