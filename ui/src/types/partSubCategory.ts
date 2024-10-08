import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

// Part SubCategory List
export interface PartSubCategoryDetails {
    Id: number;
    Name: string;
    Code: string;
    PartCategory: string;
    ProductCategory: string;
    IsActive: boolean;
}

export const partSubCategoryDetailsDecoder: Decoder<PartSubCategoryDetails> = object({
    Id: number,
    Name: string,
    Code: string,
    PartCategory: string,
    ProductCategory: string,
    IsActive: boolean,
});
export interface PartSubCategoryList {
    PartSubCategories: PartSubCategoryDetails[],
    TotalRows: number;
    PerPage:number;
}

export const partSubCategoryListDecoder: Decoder<PartSubCategoryList> = object({
    PartSubCategories: array(partSubCategoryDetailsDecoder),
    TotalRows: number,
    PerPage:number
});

// PartSubCategory Edit
export interface PartSubCategoryEditDetails {
    Id: null | number
    Name: string;
    IsActive: boolean;
}

export interface PartSubCategoryEditResponse {
    IsPartSubCategoryUpdated: Boolean;
}

export const partSubCategoryEditDecoder: Decoder<PartSubCategoryEditResponse> = object({
    IsPartSubCategoryUpdated: boolean,
});
// PartSubCategory Edit End

export interface PartSubCategoryNames {
    Id: number;
    Name: string;
}

export const partSubCategoryNamesDecoder: Decoder<PartSubCategoryNames> = object({
    Id: number,
    Name: string,
})

export interface PartSubCategoryNameList {
    PartSubCategoryDetails: PartSubCategoryNames[]
}

export const partSubCategoryNameListDecoder: Decoder<PartSubCategoryNameList> = object({
    PartSubCategoryDetails: array(partSubCategoryNamesDecoder),
});

export interface PartSubCategoryCreate {
    ProductCategoryId: number | string;
    PartProductCategoryToPartCategoryMappingId: number | string|null;
    PartSubCategoryName: string;
}

export interface PartSubCategoryCreateResult {
    IsPartSubCategoryCreated: Boolean; 
}

export const partSubCategoryCreateResultDecoder: Decoder<PartSubCategoryCreateResult> = object({
    IsPartSubCategoryCreated: boolean,
});

export interface PartSubCategoryDeleted {
    IsDeleted: Boolean;
}

export const partsubCategoryDeletedDecoder: Decoder<PartSubCategoryDeleted> = object({
    IsDeleted: boolean,
});