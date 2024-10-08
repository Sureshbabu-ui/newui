import { Decoder, array, boolean, dict, nullable, number, object, string } from 'decoders';

export interface AssetsCreation {
  ContractId: number | string;
  SiteNameId: number | string;
  ProductCategoryId: number | string;
  ProductMakeId: number | string;
  ProductId: number | string;
  CustomerAssetId: string | null;
  AssetSerialNumber: number | string;
  IsEnterpriseAssetId: number | string;
  ResponseTimeInHours: number | string;
  ResolutionTimeInHours: number | string;
  StandByTimeInHours: number | string;
  IsVipAssetId: number | string;
  AMCValue: number | string;
  IsOutsourcingNeededId: number | string;
  IsPreAmcCompleted: number | string;
  PreAmcCompletedDate: null | string;
  PreAmcCompletedBy: null | number;
  AssetConditionId: number | string;
  AccelAssetId: number | string | null;
  IsPreventiveMaintenanceNeededId: number | string;
  PreventiveMaintenanceFrequencyId: number | string | null;
  AssetSupportTypeId: number | string;
  WarrantyEndDate: number | string | null;
  AmcStartDate: string;
  AmcEndDate: string;
  IsRenewedAsset: number | string;
}

export interface AssetsList {
  Id: number;
  IsActive: boolean;
  IsPreAmcCompleted: boolean;
  Location: string | null;
  CustomerSiteId: number | null;
  CustomerName: string | null;
  CustomerSiteName: string | null;
  CategoryName: null | string;
  ProductMake: null | string;
  ModelName: null | string;
  ProductSerialNumber: number | string | null;
  WarrantyEndDate: string | null;
  AssetAddedMode: string;
}

export const assetsListDecoder: Decoder<AssetsList> = object({
  Id: number,
  IsActive: boolean,
  IsPreAmcCompleted: boolean,
  Location: nullable(string),
  CustomerSiteId: nullable(number),
  CustomerSiteName: nullable(string),
  CustomerName: nullable(string),
  CategoryName: nullable(string),
  ProductMake: nullable(string),
  ModelName: nullable(string),
  ProductSerialNumber: nullable(string),
  WarrantyEndDate: nullable(string),
  AssetAddedMode: string,
});

export interface MultipleAssetsList {
  ContractAssetsList: AssetsList[];
  TotalRows: number;
  PerPage: number;
}

export const multipleAssetsListDecoder: Decoder<MultipleAssetsList> = object({
  ContractAssetsList: array(assetsListDecoder),
  TotalRows: number,
  PerPage: number
});

export interface IsAssetCreated {
  IsAssetUpdated: boolean
}

export const isAssetCreatedDecoder: Decoder<IsAssetCreated> = object({
  IsAssetUpdated: boolean
});

export interface AssetCreatedResponse {
  IsAssetCreated: boolean
}

export const assetCreatedResponseDecoder: Decoder<AssetCreatedResponse> = object({
  IsAssetCreated: boolean
});

export interface EntitiesDetails {
  Id: number;
  Name: string;
}

export interface CustomerDetails {
  Id: number;
  SiteName: string;
}

export interface Configurations {
  CustomerSiteId: CustomerDetails[];
}

export interface Select {
  value: any,
  label: any
}

export interface SelectDetails {
  Select: Select[]
}

export interface AssetDetails {
  Id: number,
  SiteName: string | null;
  SiteNameId: number | null;
  Product: string | null;
  ProductCategory: string | null;
  ProductMake: string | null;
  ProductCategoryId: number | null;
  ProductMakeId: number | null;
  ProductId: number | null;
  AssetSerialNumber: string | null;
  IsSerialNumberExist: boolean;
  AmcValue: string | null;
  ResponseTimeInHours: string | null;
  ResolutionTimeInHours: string | null;
  StandByTimeInHours: string | null;
  AMCStartDate: string | null;
  AMCEndDate: string | null;
  AssetSupportType: string | null;
  AssetSupportTypeId: number | null
  WarrantyEndDate: string | null;
  CallType: string | null
  ContractNumber: string | null
  IsContractNOValid: boolean;
  Location: string | null;
  LocationId: number | null;
  IsAmcValueValid: boolean;
  IsResponseTimeInHoursValid: boolean;
  IsResolutionTimeInHoursValid: boolean;
  IsStandByTimeInHoursValid: boolean;
  IsCallTypeValid: boolean;
  IsPreAmcCompleted: number;
  IsPreAmcCompletedValue: string | null;
  IsPreAmcCompletedValid: boolean;
  IsRenewedAsset: number;
  IsRenewedAssetValue: string | null;
  IsRenewedAssetValid: boolean;
}

export const assetDetailsDecoder: Decoder<AssetDetails> = object({
  Id: number,
  SiteName: nullable(string),
  SiteNameId: nullable(number),
  Product: nullable(string),
  ProductCategory: nullable(string),
  ProductMake: nullable(string),
  ProductCategoryId: nullable(number),
  ProductMakeId: nullable(number),
  ProductId: nullable(number),
  AssetSerialNumber: nullable(string),
  IsSerialNumberExist: boolean,
  AmcValue: nullable(string),
  ResponseTimeInHours: nullable(string),
  ResolutionTimeInHours: nullable(string),
  StandByTimeInHours: nullable(string),
  AMCStartDate: nullable(string),
  AMCEndDate: nullable(string),
  AssetSupportType: nullable(string),
  AssetSupportTypeId: nullable(number),
  WarrantyEndDate: nullable(string),
  CallType: nullable(string),
  ContractNumber: nullable(string),
  IsContractNOValid: boolean,
  Location: nullable(string),
  LocationId: nullable(number),
  IsAmcValueValid: boolean,
  IsResponseTimeInHoursValid: boolean,
  IsResolutionTimeInHoursValid: boolean,
  IsStandByTimeInHoursValid: boolean,
  IsCallTypeValid: boolean,
  IsPreAmcCompleted: number,
  IsPreAmcCompletedValue: nullable(string),
  IsPreAmcCompletedValid: boolean,
  IsRenewedAsset: number,
  IsRenewedAssetValue: nullable(string),
  IsRenewedAssetValid: boolean
});

export interface AssetsDetails {
  AssetDetails: AssetDetails[]
  ContractId: number | null;
  AssetValidations: Record<number, string[] | null>;
}

export const assetsDetailsDecoder: Decoder<AssetsDetails> = object({
  AssetDetails: array(assetDetailsDecoder),
  ContractId: nullable(number),
  AssetValidations: dict(array(string))
});

export interface AssetDocumentPreview {
  ContractId: string;
  DocumentFile: File | null;
}

export interface SelectedAssetDetails {
  Id: number,
  MspAssetId: string | null;
  CustomerAssetId: string | null;
  AssetProductCategory: string;
  ProductMake: string;
  ProductModel: string | null;
  ProductSerialNumber: string;
  IsEnterpriseProduct: boolean;
  IsOutSourcingNeeded: boolean;
  VendorBranch: string | null;
  ResolutionTimeInHours: number;
  ResponseTimeInHours: number;
  StandByTimeInHours: number;
  IsVipProduct: boolean;
  ProductCondition: string | null;
  IsPreventiveMaintenanceNeeded: boolean;
  PreventiveMaintenanceFrequency: string | null;
  ProductSupportType: string | null;
  WarrantyEndDate: string | null;
  AmcEndDate: string | null;
  CustomerSite: string
}

export const selectedAssetDetailsDecoder: Decoder<SelectedAssetDetails> = object({
  Id: number,
  MspAssetId: nullable(string),
  CustomerAssetId: nullable(string),
  AssetProductCategory: string,
  ProductMake: string,
  ProductModel: nullable(string),
  ProductSerialNumber: string,
  IsEnterpriseProduct: boolean,
  IsOutSourcingNeeded: boolean,
  VendorBranch: nullable(string),
  ResolutionTimeInHours: number,
  ResponseTimeInHours: number,
  StandByTimeInHours: number,
  IsVipProduct: boolean,
  ProductCondition: nullable(string),
  IsPreventiveMaintenanceNeeded: boolean,
  PreventiveMaintenanceFrequency: nullable(string),
  ProductSupportType: nullable(string),
  WarrantyEndDate: nullable(string),
  AmcEndDate: nullable(string),
  CustomerSite: string
})

export interface SelectedAsset {
  AssetDetails: SelectedAssetDetails;
}
export const selectedAssetDecoder: Decoder<SelectedAsset> = object({
  AssetDetails: (selectedAssetDetailsDecoder),
});

export interface AssetSiteChangeResponse {
  isUpdated: Boolean;
}

export const assetSiteChangeDecoder: Decoder<AssetSiteChangeResponse> = object({
  isUpdated: boolean,
})

export interface SelectedAssetDetail {
  SiteNameId: number | null;
  ProductCategoryId: number | null;
  ProductMakeId: number | null;
  ProductId: number | null;
  AssetSerialNumber: string | null;
  AmcValue: string | null;
  ResponseTimeInHours: string | null;
  ResolutionTimeInHours: string | null;
  StandByTimeInHours: string | null;
  AMCStartDate: string | null;
  AMCEndDate: string | null;
  AssetSupportTypeId: number | null
  WarrantyEndDate: string | null;
  CallType: string | null
  LocationId: number | null;
  IsPreAmcCompleted: number
}

export interface UpdateAssetDetail {
  Id: number | string;
  AssetSerialNumber: number | string;
  IsVipAssetId: number | string;
  AMCValue: number | string;
  IsPreAmcCompleted: number | string;
  IsOutsourcingNeededId: number | string;
  PreAmcStartDate: null | string;
  PreAmcEndDate: null | string;
  AmcStartDate: number | string;
  AmcEndDate: number | string;
}

export interface SelectedAssetInfo {
  Id: string | number;
  ProductCategoryId: number;
  ProductMakeId: number;
  ProductModelId: number | null;
  ProductSerialNumber: string;
  MspAssetId: string | null;
  CustomerAssetId: string | null;
  AmcEndDate: string | null;
  AmcStartDate: string | null;
  AmcValue: string | number;
  IsEnterpriseProduct: boolean | string;
  IsOutSourcingNeeded: boolean | string;
  IsPreAmcCompleted: boolean | string;
  IsPreventiveMaintenanceNeeded: string;
  ResolutionTimeInHours: number;
  ResponseTimeInHours: number;
  StandByTimeInHours: number;
  IsVipProduct: boolean | string;
  ProductConditionId: number | null;
  WarrantyEndDate: string | null;
  CustomerSiteId: string | number;
  PreAmcCompletedBy: number | null;
  PreAmcCompletedDate: string | null;
  ProductSupportTypeId: number | null;
  PreventiveMaintenanceFrequencyId: number | null;
  IsActive: boolean
}

export const selectedAssetInfoDecoder: Decoder<SelectedAssetInfo> = object({
  Id: number,
  ProductCategoryId: number,
  ProductMakeId: number,
  ProductModelId: nullable(number),
  ProductSerialNumber: string,
  MspAssetId: nullable(string),
  CustomerAssetId: nullable(string),
  AmcEndDate: nullable(string),
  AmcStartDate: nullable(string),
  AmcValue: number,
  IsEnterpriseProduct: string,
  IsOutSourcingNeeded: string,
  IsPreAmcCompleted: string,
  IsPreventiveMaintenanceNeeded: string,
  ResolutionTimeInHours: number,
  ResponseTimeInHours: number,
  StandByTimeInHours: number,
  IsVipProduct: string,
  ProductConditionId: nullable(number),
  WarrantyEndDate: nullable(string),
  CustomerSiteId: number,
  PreAmcCompletedBy: nullable(number),
  PreAmcCompletedDate: nullable(string),
  ProductSupportTypeId: nullable(number),
  PreventiveMaintenanceFrequencyId: nullable(number),
  IsActive: boolean
})

export interface AssetEditDetails {
  ContractAssetInfo: SelectedAssetInfo;
}

export const assetEditDetailsDecoder: Decoder<AssetEditDetails> = object({
  ContractAssetInfo: selectedAssetInfoDecoder,
})

export interface IsAssetUpdated {
  IsAssetUpdated: boolean
}

export const isAssetUpdatedDecoder: Decoder<IsAssetUpdated> = object({
  IsAssetUpdated: boolean
});

export interface InterimAssetsCreation {
  ContractId: number | string;
  SiteNameId: number | string;
  ProductCategoryId: number | string;
  ProductMakeId: number | string;
  ProductId: number | string;
  CustomerAssetId: string;
  AssetSerialNumber: number | string;
  IsEnterpriseAssetId: number | string;
  ResponseTimeInHours: number | string;
  ResolutionTimeInHours: number | string;
  StandByTimeInHours: number | string;
  IsVipAssetId: number | string;
  AmcValue: number | string;
  IsOutsourcingNeededId: number | string;
  IsPreAmcCompleted: number | string;
  PreAmcCompletedBy: null | number;
  PreAmcCompletedDate: null | string;
  AssetConditionId: number | string;
  AccelAssetId: number | string;
  IsPreventiveMaintenanceNeededId: number | string;
  PreventiveMaintenanceFrequencyId: number | string | null;
  AssetSupportTypeId: number | string;
  WarrantyEndDate: number | string | null;
  AmcStartDate: string;
  AmcEndDate: string;
  ReviewStatus: string;
  ReviewRemarks: string;
  ServiceRequestId: number | string;
  AssetAddModeId: number | string;
  InterimAssetId: number | null;
}

export interface AssetDetail {
  ProductSerialNumber: string;
  Make: string;
  CategoryName: string;
  ModelName: string;
  IsWarranty: boolean;
}

export const assetDetailDecoder: Decoder<AssetDetail> = object({
  ProductSerialNumber: string,
  Make: string,
  CategoryName: string,
  ModelName: string,
  IsWarranty: boolean
})

export interface AssetDetailsForSme {
  AssetDetails: AssetDetail;
}

export const assetDetailsForSmeDecoder: Decoder<AssetDetailsForSme> = object({
  AssetDetails: assetDetailDecoder,
})

// PreAmc Pending Assets Count
export interface PreAmcPendingAssetsCount {
  PreAmcPendingAssetsCount: number
}

export const preAmcPendingAssetsCountDecoder: Decoder<PreAmcPendingAssetsCount> = object({
  PreAmcPendingAssetsCount: number
});

export interface AssetDetailsForSmeView {
  MspAssetId?: string | null;
  CustomerAssetId?: string | null;
  AssetProductCategory?: string | null;
  Make?: string | null;
  ModelName?: string | null;
  ProductSerialNumber?: string | null;
  WarrantyEndDate?: string | null;
  CustomerSite?: string | null;
  AmcValue?: string | null;
  ContractNumber?: string | null;
  ResolutionTimeInHours?: string | null;
  ResponseTimeInHours?: string | null;
  StandByTimeInHours?: string | null;
  IsOutSourcingNeeded?: string | null;
  IsPreAmcCompleted?: string | null;
  AmcStartDate?: string | null;
  AmcEndDate?: string | null;
}

export const assetDetailsForSmeViewDecoder: Decoder<AssetDetailsForSmeView> = object({
  MspAssetId: nullable(string),
  CustomerAssetId: nullable(string),
  AssetProductCategory: nullable(string),
  Make: nullable(string),
  ModelName: nullable(string),
  ProductSerialNumber: nullable(string),
  WarrantyEndDate: nullable(string),
  CustomerSite: nullable(string),
  AmcValue: nullable(string),
  ContractNumber: nullable(string),
  ResolutionTimeInHours: nullable(string),
  ResponseTimeInHours: nullable(string),
  StandByTimeInHours: nullable(string),
  IsOutSourcingNeeded: nullable(string),
  IsPreAmcCompleted: nullable(string),
  AmcStartDate: nullable(string),
  AmcEndDate: nullable(string),
})

export interface AssetDetailsForSmeOnly {
  AssetDetail: AssetDetailsForSmeView;
}

export const assetDetailsForSmeOnlyDecoder: Decoder<AssetDetailsForSmeOnly> = object({
  AssetDetail: assetDetailsForSmeViewDecoder,
})

export interface AssetBulkDeactivation {
  IsUpdated: Boolean;
}

export const assetBulkDeactivationDecoder: Decoder<AssetBulkDeactivation> = object({
  IsUpdated: boolean,
})

export interface InterimPreAmcReviewedAssetsDetails {
  IsPreAmcCompleted: number | string;
  PreAmcCompletedDate: null | string;
  PreAmcCompletedBy: null | number;
  ReviewRemarks: string;
  ServiceRequestId: number | string;
}

// preamc contracts
export interface PreAmcContractList {
  ContractId: number;
  ContractNumber: string | null;
  CustomerName: string | null;
  TotalSite: number | null;
  TotalAsset: number | null;
  PreAmcPendingAssets: number | null;
  PreAmcCompletedAssets: number | null;
}

export const preAmcContractListDecoder: Decoder<PreAmcContractList> = object({
  ContractId: number,
  ContractNumber: nullable(string),
  CustomerName: nullable(string),
  TotalSite: nullable(number),
  TotalAsset: nullable(number),
  PreAmcPendingAssets: nullable(number),
  PreAmcCompletedAssets: nullable(number),
});

export interface MultiplePreAmcContractList {
  ContractList: PreAmcContractList[];
  TotalRows: number | null;
  PerPage: number;
}

export const multiplePreAmcContractListDecoder: Decoder<MultiplePreAmcContractList> = object({
  ContractList: array(preAmcContractListDecoder),
  TotalRows: nullable(number),
  PerPage: number
});

// PreAmc SiteWise List
export interface PreAmcSiteWiseList {
  SiteId: number;
  SiteName: string | null;
  TotalAsset: number | null;
  PreAmcPendingAssets: number | null;
  PreAmcCompletedAssets: number | null;
}

export const preAmcSiteWiseListDecoder: Decoder<PreAmcSiteWiseList> = object({
  SiteId: number,
  SiteName: nullable(string),
  TotalAsset: nullable(number),
  PreAmcPendingAssets: nullable(number),
  PreAmcCompletedAssets: nullable(number),
});

export interface MultiplePreAmcSiteWiseList {
  SiteList: PreAmcSiteWiseList[];
  TotalRows: number | null;
  PerPage: number;
}

export const multiplePreAmcSiteWiseListDecoder: Decoder<MultiplePreAmcSiteWiseList> = object({
  SiteList: array(preAmcSiteWiseListDecoder),
  TotalRows: nullable(number),
  PerPage: number
});

export interface PreAmcAssetUpdateDetail {
  Id: number;
  IsPreAmcCompleted: boolean;
  PreAmcCompletedDate: string | null;
  EngineerId: number | null;
}

export interface PreAmcPendingAssetList {
  Id: number;
  IsActive: boolean;
  IsOutSourcingNeeded: boolean;
  VendorBranch: string | null;
  Location: string | null;
  CustomerSiteId: number | null;
  CustomerName: string | null;
  CustomerSiteName: string | null;
  CategoryName: null | string;
  ProductMake: null | string;
  ModelName: null | string;
  ProductSerialNumber: number | string | null;
  ContractNumber: string | null;
  AssetAddedMode: string;
}

export const preAmcPendingAssetListDecoder: Decoder<PreAmcPendingAssetList> = object({
  Id: number,
  IsActive: boolean,
  IsOutSourcingNeeded: boolean,
  Location: nullable(string),
  VendorBranch: nullable(string),
  CustomerSiteId: nullable(number),
  CustomerSiteName: nullable(string),
  CustomerName: nullable(string),
  CategoryName: nullable(string),
  ProductMake: nullable(string),
  ModelName: nullable(string),
  ProductSerialNumber: nullable(string),
  ContractNumber: nullable(string),
  AssetAddedMode: string,
});

export interface MultiplePreAmcPendingAssetList {
  ContractAssetsList: PreAmcPendingAssetList[];
  TotalRows: number;
  PerPage: number;
}

export const multiplePreAmcPendingAssetListDecoder: Decoder<MultiplePreAmcPendingAssetList> = object({
  ContractAssetsList: array(preAmcPendingAssetListDecoder),
  TotalRows: number,
  PerPage: number
});

export interface AssetFilter {
  TenantRegionId: number | null;
  TenantOfficeId: number | null;
  PreAmcStatus: boolean | null;
  AssetProductCategoryId: number | null;
}
// Back to Back vendor Bulk Update

export interface SelectedBackToBackAssetDetails {
  AssetId: number | null;
  VendorBranchId: number | null,
  TollFreeNumber: string | null;
  Email: string | null;
  VendorContractNumber: string | null;
}

export interface BackToBackAssetDetails {
  Id: number,
  AssetId: number | null,
  VendorBranchId: number | null,
  AssetSerialNumber: string | null;
  BranchName: string | null;
  TollFreeNumber: string | null;
  Email: string | null;
  VendorContractNumber: string | null;
  ContractNumber: string | null;
  IsContractNumValid: boolean;
}

export const backToBackAssetDetailsDecoder: Decoder<BackToBackAssetDetails> = object({
  Id: number,
  AssetId: nullable(number),
  VendorBranchId: nullable(number),
  AssetSerialNumber: nullable(string),
  BranchName: nullable(string),
  ContractNumber: nullable(string),
  TollFreeNumber: nullable(string),
  VendorContractNumber: nullable(string),
  Email: nullable(string),
  IsContractNumValid: boolean,
});

export interface BackToBackAssetsDetails {
  AssetDetails: BackToBackAssetDetails[]
}

export const backToBackAssetsDetailsDecoder: Decoder<BackToBackAssetsDetails> = object({
  AssetDetails: array(backToBackAssetDetailsDecoder),
});

// Pre Amc Done Upload
export interface SelectedPreAmcDoneAssetDetails {
  AssetId: number | null;
  PreAmcCompletedById: number | null,
  PreAmcCompletedDate: string | null;
  PreAmcVendorBranchId: number | null,
}

export interface PreAmcDoneAssetDetails {
  Id: number,
  AssetId: number | null,
  ContractNumber: string | null;
  AssetSerialNumber: string | null;
  PreAmcCompletedById: number | null,
  PreAmcCompletedBy: string | null;
  PreAmcCompletedDate: string | null;
  IsCompletedDateValid: boolean;
  IsContractNumValid: boolean;
  PreAmcVendorBranch: string | null;
  PreAmcVendorBranchId: number | null,
}

export const preAmcDoneAssetDetailsDecoder: Decoder<PreAmcDoneAssetDetails> = object({
  Id: number,
  AssetId: nullable(number),
  ContractNumber: nullable(string),
  AssetSerialNumber: nullable(string),
  PreAmcCompletedById: nullable(number),
  PreAmcCompletedBy: nullable(string),
  PreAmcCompletedDate: nullable(string),
  IsCompletedDateValid: boolean,
  IsContractNumValid: boolean,
  PreAmcVendorBranch: nullable(string),
  PreAmcVendorBranchId: nullable(number),
});

export interface PreAmcDoneAssetsDetails {
  AssetDetails: PreAmcDoneAssetDetails[]
}

export const preAmcDoneAssetsDetailsDecoder: Decoder<PreAmcDoneAssetsDetails> = object({
  AssetDetails: array(preAmcDoneAssetDetailsDecoder),
});

export interface ContractAssetDownloadFilter {
  PreAmcStatus:number|null;
  SupportType:number|null
}
