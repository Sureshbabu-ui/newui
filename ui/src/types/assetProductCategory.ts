import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface ProductCategoryCreate {
    CategoryName: string | number;
    PartProductCategoryId: number|string;
    GeneralNotCovered: string|null;
    SoftwareNotCovered: null | string;
    HardwareNotCovered: null | string;
}

export interface ProductCategoryCreateResult {
    IsProductCategoryCreated: Boolean;
}

export const productCategoryCreateResultDecoder: Decoder<ProductCategoryCreateResult> = object({
    IsProductCategoryCreated: boolean,
});

export interface ProductCategoryUpdateResult {
    IsUpdated: Boolean;
}

export const productCategoryUpdateResultDecoder: Decoder<ProductCategoryUpdateResult> = object({
    IsUpdated: boolean,
});

export interface ProductCategoryDetails {
    Id: number;
    Code: string;
    CategoryName: string;
    PartProductCategoryId:number;
    PartProductCategory: string;
    GeneralNotCovered: string|null;
    SoftwareNotCovered: null | string;
    HardwareNotCovered: null | string;
}


export const productCategoryDetailsDecoder: Decoder<ProductCategoryDetails> = object({
    Id: number,
    Code: string,
    CategoryName: string,
    PartProductCategoryId:number,
    PartProductCategory: string,
    GeneralNotCovered: nullable(string),
    SoftwareNotCovered: nullable(string),
    HardwareNotCovered: nullable(string),
})

export interface AssetProductCategoryList {
    Id: number;
    Code: string;
    CategoryName: string;
    PartProductCategory: string;
    GeneralNotCovered: string | null;
    SoftwareNotCovered: null | string;
    HardwareNotCovered: null | string;
}


export const AssetproductCategoryListDecoder: Decoder<AssetProductCategoryList> = object({
    Id: number,
    Code: string,
    CategoryName: string,
    PartProductCategory: string,
    GeneralNotCovered: nullable(string),
    SoftwareNotCovered: nullable(string),
    HardwareNotCovered: nullable(string),
})

export interface ProductCategoryList {
    ProductCategories: AssetProductCategoryList[]
    TotalRows: number
    PerPage: number
}

export const productCategoryListDecoder: Decoder<ProductCategoryList> = object({
    ProductCategories: array(AssetproductCategoryListDecoder),
    TotalRows: number,
    PerPage: number
});


export interface AssetCategoryName {
    Id: number;
    CategoryName: string;
  }
  
  export const AssetCategoryNameDecoder: Decoder<AssetCategoryName> = object({
    Id: number,
    CategoryName: string,
  });
  
  export interface AssetProductCategoryNames {
    AssetProductCategoryNames: AssetCategoryName[];
  }
  
  export const AssetProductCategoryNamesDecoder: Decoder<AssetProductCategoryNames> = object({
    AssetProductCategoryNames: array(AssetCategoryNameDecoder),
  });

  export interface ResponseData {
    IsPartNotCoveredUpdated: Boolean;
}

export const responseDataDecoder: Decoder<ResponseData> = object({
    IsPartNotCoveredUpdated: boolean,
});

export interface PartsNotCovered {
    productCategoryPartsNotCovered: string;
}

export const PartsNotCoveredDecoder: Decoder<PartsNotCovered> = object({
    productCategoryPartsNotCovered: string,
})

export interface SelectedProductCategoryPartsNotCovered {
    ProductCategoryPartsNotCovered: PartsNotCovered[]
}

export const selectedproductCategoryPartsNotCoveredDecoder: Decoder<SelectedProductCategoryPartsNotCovered> = object({
    ProductCategoryPartsNotCovered: array(PartsNotCoveredDecoder),
});

export interface SelectedProductCategory {
    ProductCategoryDetails: ProductCategoryDetails
}

export const productCategoryDetailDecoder: Decoder<SelectedProductCategory> = object({
    ProductCategoryDetails: productCategoryDetailsDecoder,
});

export interface DeleteAssetPCResponseData {
    IsDeleted: Boolean;
}

export const deleteAssetPCResponseDataDecoder: Decoder<DeleteAssetPCResponseData> = object({
    IsDeleted: boolean,
});