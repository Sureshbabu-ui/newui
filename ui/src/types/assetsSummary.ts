import { Decoder, array, boolean, nullable, number, object, string } from 'decoders';

export interface AssetSummaryCreation {
  ContractId: number | string ;
	ProductCategoryId: number | string ;
	ProductCountAtBooking: number | string ;
	AmcValue: number |null ;
  PartCategoryId:string;
	IsPreventiveMaintenanceNeeded: Boolean ;
}

export interface AssetsSummaryList {
  Id: number;
  PartCategoryNames: string | null;
  CategoryName: string;
  ProductCountAtBooking: number;
  InterimAssetCount:number;
  PreAmcAssetCount:number;
  PendingAssetCount:number;
  AmcValue: number;
  AssetProductCategoryId:number;
}

export const assetsSummaryListDecoder: Decoder<AssetsSummaryList> = object({
  Id: number,
  CategoryName: string,
  PartCategoryNames: nullable(string),
  ProductCountAtBooking: number,
  AmcValue: number,
  InterimAssetCount: number,
  PreAmcAssetCount: number,
  PendingAssetCount: number,
  AssetProductCategoryId:number
});

export interface MultipleAssetsSummaryList {
  ContractAssetsSummaryList: AssetsSummaryList[];
  TotalRows: number;
  PerPage: number;
}

export const multipleAssetsSummaryDecoder: Decoder<MultipleAssetsSummaryList> = object({
  ContractAssetsSummaryList: array(assetsSummaryListDecoder),
  TotalRows: number,
  PerPage:number
});

export interface IsAssetSummaryCreated {
  IsAssetSummaryCreated: boolean
}

export const isAssetSummaryCreatedDecoder: Decoder<IsAssetSummaryCreated> = object({
  IsAssetSummaryCreated: boolean
});
 
export interface ProductCategoryPartnotCovered {
  Id: number,
  Name: string,
  IsActive: boolean
}

export const productCategoryPartnotCoveredDecoder: Decoder<ProductCategoryPartnotCovered> = object({
  Id: number,
  Name: string,
  IsActive: boolean
})

export interface ProductCategoryPartnotCoveredList {
  ProductCategoryPartnotCovered: ProductCategoryPartnotCovered[]
}

export const productCategoryPartnotCoveredListDecoder: Decoder<ProductCategoryPartnotCoveredList> = object({
  ProductCategoryPartnotCovered: array(productCategoryPartnotCoveredDecoder),
});

export interface selectedPartCategory {
  PartCategoryList: string;
  PartCategoryNames:string;
}

export const selectedPartnotCoveredDecoder: Decoder<selectedPartCategory> = object({
  PartCategoryList: string,
  PartCategoryNames:string
})

export interface SelectedPartnotCoveredList {
  ProductCategoryPartnotCovered: selectedPartCategory[]
}

export const selectedPartnotCoveredListDecoder: Decoder<SelectedPartnotCoveredList> = object({
  ProductCategoryPartnotCovered: array(selectedPartnotCoveredDecoder),
});

export interface EditAssetsSummary {
  Id: number | string;
  CategoryName:string;
  PartCategoryList: string;
  ContractId: string | number;
  ProductCategoryId: number | string;
  ProductCountAtBooking: number | string;
  AmcValue: number | string;
}

export interface AssetsSummary {
  Id: number | string;
  ContractId: string |number;
  CategoryName:string;
  ProductCategoryId: number | string;
  ProductCountAtBooking: number | string;
  AmcValue: number|string;
}

export const assetsSummaryDecoder: Decoder<AssetsSummary> = object({
  Id: number,
  ContractId:number,
  CategoryName: string,
  ProductCategoryId: number,
  ProductCountAtBooking: number,
  AmcValue: number,
});

export interface SelectedAssetSummary {
  AssetSummary: AssetsSummary;
}

export const selectedAssetsSummaryDecoder: Decoder<SelectedAssetSummary> = object({
  AssetSummary: assetsSummaryDecoder,
});

export interface SummaryEditResponse {
  IsUpdated: Boolean;
}

export const summaryEditResponseDecoder: Decoder<SummaryEditResponse> = object({
  IsUpdated: boolean,
});

export interface AssetSiteWiseSummaryListDetail {
  TenantOfficeName: string | null;
  SiteName: string | null;
  CategoryName: string|null;
  AssetCount: number;
}

export const assetSitewiseSummaryListDetailDecoder: Decoder<AssetSiteWiseSummaryListDetail> = object({
  TenantOfficeName: nullable(string),
  SiteName: nullable(string),
  CategoryName: nullable(string),
  AssetCount: number,
}); 

export interface AssetSitewiseSummaryList {
  SiteWiseSummaryList: AssetSiteWiseSummaryListDetail[];
}

export const assetSitewiseSummaryListDecoder: Decoder<AssetSitewiseSummaryList> = object({
  SiteWiseSummaryList: array(assetSitewiseSummaryListDetailDecoder),
});