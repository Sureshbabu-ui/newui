import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface ProductCategoryCreate {
    CategoryName: string | number;
}

export interface ProductCategoryCreateResult {
    IsProductCategoryCreated: Boolean;
}

export const productCategoryCreateResultDecoder: Decoder<ProductCategoryCreateResult> = object({
    IsProductCategoryCreated: boolean,
});

export interface ProductCategoryDetails {
    Id: number;
    Code: string;
    CategoryName: string;
    CreatedBy: string;
    CreatedOn: string;
    UpdatedBy: null | string;
    UpdatedOn: null | string;
}

export const productCategoryDetailsDecoder: Decoder<ProductCategoryDetails> = object({
    Id: number,
    Code: string,
    CategoryName: string,
    CreatedBy: string,
    CreatedOn: string,
    UpdatedBy: nullable(string),
    UpdatedOn: nullable(string)
})

export interface ProductCategoryList {
    ProductCategories: ProductCategoryDetails[]
    TotalRows: number
    PerPage:number
}

export const productCategoryListDecoder: Decoder<ProductCategoryList> = object({
    ProductCategories: array(productCategoryDetailsDecoder),
    TotalRows: number,
    PerPage:number
});


export interface ProductCategoryDeleted {
    IsDeleted: Boolean;
}

export const productCategoryDeletedDecoder: Decoder<ProductCategoryDeleted> = object({
    IsDeleted: boolean,
});

export interface PartProductCategoryEdit {
    Id: number;
    CategoryName: string;
}

export interface ProductCategoryUpdateResult {
    IsProductCategoryUpdated: Boolean;
}

export const productCategoryUpdateResultDecoder: Decoder<ProductCategoryUpdateResult> = object({
    IsProductCategoryUpdated: boolean,
});