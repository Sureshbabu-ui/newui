import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface PartCategoryCreate {
    Name: string;
    ProductCategoryId: number | string;
}

export interface PartCategoryEdit {
    Id:number;
    Name: string;
    MappingId:number;
    PartProductCategoryId: number | string;
}

export interface PartCategoryCreateResult {
    IsPartCategoryCreated: Boolean;
}

export const partCategoryCreateResultDecoder: Decoder<PartCategoryCreateResult> = object({
    IsPartCategoryCreated: boolean,
});

export interface PartCategoryUpdateResult {
    IsPartCategoryUpdated: Boolean;
}

export const partCategoryUpdateResultDecoder: Decoder<PartCategoryUpdateResult> = object({
    IsPartCategoryUpdated: boolean,
});

export interface PartCategoryDeleted {
    IsPartCategoryUpdated: Boolean;
}

export const partCategoryDeletedDecoder: Decoder<PartCategoryDeleted> = object({
    IsPartCategoryUpdated: boolean,
});

export interface PartCategoryDetails {
    Id: number;
    Code: string;
    Name: string;
    PartProductCategoryId:number;
    ProductCategory: string;
    CreatedBy: string;
    CreatedOn: string;
    UpdatedBy: null | string;
    UpdatedOn: null | string;
    MappingId:number;
}

export interface PartCategoryList {
    PartCategories: PartCategoryDetails[]
    TotalRows: number
    PerPage: number
}

export const partCategoryDetailsDecoder: Decoder<PartCategoryDetails> = object({
    Id: number,
    Code: string,
    Name: string,
    PartProductCategoryId:number,
    ProductCategory: string,
    CreatedBy: string,
    CreatedOn: string,
    UpdatedBy: nullable(string),
    UpdatedOn: nullable(string),
    MappingId:number
})

export const partCategoryListDecoder: Decoder<PartCategoryList> = object({
    PartCategories: array(partCategoryDetailsDecoder),
    TotalRows: number,
    PerPage: number
});

export interface PartCategoryNames {
    Id: number;
    Name: string;
    PartProductCategoryToPartCategoryMappingId: number | null
}

export const partCategoryNamesDecoder: Decoder<PartCategoryNames> = object({
    Id: number,
    Name: string,
    PartProductCategoryToPartCategoryMappingId: nullable(number)
})

export interface PartCategoryNameList {
    PartProductCategoryDetails: PartCategoryNames[]
}


export const partCategoryNameListDecoder: Decoder<PartCategoryNameList> = object({
    PartProductCategoryDetails: array(partCategoryNamesDecoder),
});

export interface PartCategoryName {
    Id: number;
    Code:string;
    Name: string;
}

export const PartCategoryNameDecoder: Decoder<PartCategoryName> = object({
    Id: number,
    Code: string,
    Name: string
});

export interface PartCategoryNameListForPO {
    PartCategoryNames: PartCategoryName[];
}

export const PartCategoryNameListForPODecoder: Decoder<PartCategoryNameListForPO> = object({
    PartCategoryNames: array(PartCategoryNameDecoder),
})

export interface AssetProductCategoryPartCategoryNames {
    Id: number;
    Name: string;
    PartProductCategoryToPartCategoryMappingId: number | null
}

export const assetProductCategoryPartCategoryNamesDecoder: Decoder<AssetProductCategoryPartCategoryNames> = object({
    Id: number,
    Name: string,
    PartProductCategoryToPartCategoryMappingId: nullable(number)
})

export interface AssetProductCategoryPartCategoryNameList {
    PartProductCategoryDetails: AssetProductCategoryPartCategoryNames[]
}


export const AssetProductCategoryPartCategoryNameListDecoder: Decoder<AssetProductCategoryPartCategoryNameList> = object({
    PartProductCategoryDetails: array(assetProductCategoryPartCategoryNamesDecoder),
});