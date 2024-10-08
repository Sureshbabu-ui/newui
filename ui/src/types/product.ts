import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface ProductCreate {
  ModelName: string | number;
  Description: string | number;
  CategoryId: number;
  MakeId: number;
  ManufacturingYear: number | null;
  AmcValue: number | null;
}

export interface ProductCreateResult {
  IsProductCreated: Boolean;
}

export const productCreateResultDecoder: Decoder<ProductCreateResult> = object({
  IsProductCreated: boolean,
});

export interface CategoryName {
  Id: number;
  CategoryName: string;
}

export const CategoryNameDecoder: Decoder<CategoryName> = object({
  Id: number,
  CategoryName: string,
});

export interface ProductCategoryNames {
  ProductCategoryNames: CategoryName[];
}

export const ProductCategoryNamesDecoder: Decoder<ProductCategoryNames> = object({
  ProductCategoryNames: array(CategoryNameDecoder),
});

export interface MakeName {
  Id: number;
  Name: string;
}

export const makeNameDecoder: Decoder<MakeName> = object({
  Id: number,
  Name: string,
});

export interface MakeNames {
  MakeNames: MakeName[];
}

export const makesNamesDecoder: Decoder<MakeNames> = object({
  MakeNames: array(makeNameDecoder),
});

export interface ModelName {
  Id: number;
  ModelName: string;
}

export const modelNameDecoder: Decoder<ModelName> = object({
  Id: number,
  ModelName: string,
});

export interface ModelNames {
  ModelNames: ModelName[];
}

export const modelNamesDecoder: Decoder<ModelNames> = object({
  ModelNames: array(modelNameDecoder),
});

export interface ProductDetails {
  Id: number;
  Code: string;
  ModelName: string;
  Description: null | string;
  Category: string | null;
  Make: string | null;
  ManufacturingYear: number;
  AmcValue: number;
  CreatedBy: string;
  CreatedOn: string;
  IsDeleted: Boolean;
}

export interface ProductList {
  Products: ProductDetails[]
  TotalRows: number
  PerPage: number
}

export const productDetailsDecoder: Decoder<ProductDetails> = object({
  Id: number,
  Code: string,
  ModelName: string,
  Description: nullable(string),
  Category: nullable(string),
  Make: nullable(string),
  ManufacturingYear: number,
  AmcValue: number,
  CreatedBy: string,
  CreatedOn: string,
  IsDeleted: boolean,
})

export const productListDecoder: Decoder<ProductList> = object({
  Products: array(productDetailsDecoder),
  TotalRows: number,
  PerPage: number
});

export interface SelectedProductDetails {
  ProductId: number | string;
  ModelName: string;
  Description: string|null;
  AssetProductCategoryId: number | string;
  MakeId: number | string;
  ManufacturingYear: number | string | null;
  AmcValue: number | string | null;
}

export const selectedProductDetailsDecoder: Decoder<SelectedProductDetails> = object({
  ProductId: number,
  ModelName: string,
  Description: nullable(string),
  AssetProductCategoryId: number,
  MakeId: number,
  ManufacturingYear:nullable(number),
  AmcValue: nullable(number)
})

export interface SelectedProduct {
  ProductData: SelectedProductDetails
}

export const selectedProductDecoder: Decoder<SelectedProduct> = object({
  ProductData: selectedProductDetailsDecoder
});

export interface ProductEditResponse {
  isUpdated: Boolean;
}

export const productEditDecoder: Decoder<ProductEditResponse> = object({
  isUpdated: boolean,
});

export interface ProductDeleted {
  IsDeleted: Boolean;
}

export const productDeletedDecoder: Decoder<ProductDeleted> = object({
  IsDeleted: boolean,
});