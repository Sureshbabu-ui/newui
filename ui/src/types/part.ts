import { Decoder, array, boolean, nullable, number, object, string, oneOf, optional } from "decoders";

export interface EntityDetails {
    Id: number;
    Name: string;
}

export const entityDetailsDecoder: Decoder<EntityDetails> = object({
    Id: number,
    Name: string,
});

export interface StockTypes {
    StockTypes: EntityDetails[];
}

export const stockTypesDecoder: Decoder<StockTypes> = object({
    StockTypes: array(entityDetailsDecoder),
});


export interface CategoryName {
    Id: number;
    Name: string;
}

export const categoryNameDecoder: Decoder<CategoryName> = object({
    Id: number,
    Name: string,
});

export interface CategoryNames {
    CategoryNames: CategoryName[];
}

export const categoryNamesDecoder: Decoder<CategoryNames> = object({
    CategoryNames: array(categoryNameDecoder),
});

export interface PartCreate {
    ProductCategoryId: number | string;
    PartCategoryId: number | string;
    PartSubCategoryId: number | string | null;
    MakeId: number | string;
    HsnCode: string;
    PartName: string;
    OemPartNumber: string;
}

export interface PartCreateResult {
    IsPartCodificationCreated: Boolean;
}

export const partCreateResultDecoder: Decoder<PartCreateResult> = object({
    IsPartCodificationCreated: boolean,
});

export interface PartDetails {
    Id: number;
    ProductCategoryName: string;
    PartCategoryName: string;
    PartSubCategoryName: null | string;
    MakeName: string;
    HsnCode: string;
    PartCode: string;
    PartName: string;
    OemPartNumber: string;
    Description: null | string;
    CreatedBy: string;
    CreatedOn: string;
    UpdatedBy: null | string;
    UpdatedOn: null | string;
}

export interface PartList {
    Parts: PartDetails[]
    TotalRows: number
    PerPage: number
}

export const partDetailsDecoder: Decoder<PartDetails> = object({
    Id: number,
    ProductCategoryName: string,
    PartCategoryName: string,
    PartSubCategoryName: nullable(string),
    MakeName: string,
    HsnCode: string,
    PartCode: string,
    PartName: string,
    OemPartNumber: string,
    Description: nullable(string),
    CreatedBy: string,
    CreatedOn: string,
    UpdatedBy: nullable(string),
    UpdatedOn: nullable(string)
})

export const partListDecoder: Decoder<PartList> = object({
    Parts: array(partDetailsDecoder),
    TotalRows: number,
    PerPage: number
});

export interface PartNames {
    Id: number;
    PartName: string;
}

export const partNamesDecoder: Decoder<PartNames> = object({
    Id: number,
    PartName: string,
})

export interface PartNameList {
    PartsNames: PartNames[]
}

export const partNameListDecoder: Decoder<PartNameList> = object({
    PartsNames: array(partNamesDecoder),
});

export interface PartDetail {
    Id: number;
    PartName: string;
    PartCode: string;
    HsnCode: string;
    OemPartNumber: string;
    PartQuantity: number;
    PartCategoryName: string;
    ProductCategoryName: string;
    MakeName: string;
    GstRate: number;
}

export const partDetailDecoder: Decoder<PartDetail> = object({
    Id: number,
    PartName: string,
    PartCode: string,
    HsnCode: string,
    OemPartNumber: string,
    PartQuantity: number,
    PartCategoryName: string,
    ProductCategoryName: string,
    MakeName: string,
    GstRate: number
})

export interface SelectedPartDetail {
    Partdetails: PartDetail
}

export const selectedPartDetailDecoder: Decoder<SelectedPartDetail> = object({
    Partdetails: partDetailDecoder,
});

// Part Details By Part Code
export interface PartDetailByCode {
    Id: number;
    PartName: string | null;
    HsnCode: string | null;
    OemPartNumber: string | null;
}

export const partDetailByCodeDecoder: Decoder<PartDetailByCode> = object({
    Id: number,
    PartName: nullable(string),
    HsnCode: nullable(string),
    OemPartNumber: nullable(string)
})

export interface PartDetailsByCode {
    PartDetails: PartDetailByCode | null
}

export const partDetailsByCodeDecoder: Decoder<PartDetailsByCode> = object({
    PartDetails: nullable(partDetailByCodeDecoder),
});
export interface ApprovePart {
    IsApproved: Boolean;
}

export const approvePartDecoder: Decoder<ApprovePart> = object({
    IsApproved: boolean,
});

export interface PartReviewDetail {
    Id: null;
    UserId: null;
    ReviewComment: string;
    HsnCode: string;
    OemPartNumber: string;
    ReviewedBy: null,
    CreatedOn: null,
    ReviewStatus: string
}

export interface ImprestPODetails {
    Id: number;
    HsnCode: string;
    PartCode: string;
    PartName: string;
    OemPartNumber: string;
    Description: null | string;
    Quantity: number;
    StockTypeId: number | null;
    Price: number | null;
    GstRate: number;
    Sgst?: number;
    Cgst?: number;
    Igst?: number;
}

export const ImprestPODetailsDecoder: Decoder<ImprestPODetails> = object({
    Id: number,
    HsnCode: string,
    PartCode: string,
    PartName: string,
    OemPartNumber: string,
    Description: nullable(string),
    GstRate: number,
    Quantity: number,
    StockTypeId: nullable(number),
    Price: nullable(number),
})

export interface PartListImprestPo {
    Parts: ImprestPODetails[]
    TotalRows: number
    PerPage: number
}

export const PartListImprestPoDecoder: Decoder<PartListImprestPo> = object({
    Parts: array(ImprestPODetailsDecoder),
    TotalRows: number,
    PerPage: number
});

export interface PartDetailsForEdit {
    PartCategoryId: number;
    PartSubCategoryId: number | null;
    MakeId: number;
    PartProductCategoryId: number;
    Id: number;
    PartName: string;
    HsnCode: string;
    OemPartNumber: string;
}

export const partDetailForEditDecoder: Decoder<PartDetailsForEdit> = object({
    PartCategoryId: number,
    PartSubCategoryId: nullable(number),
    MakeId: number,
    PartProductCategoryId: number,
    Id: number,
    PartName: string,
    HsnCode: string,
    OemPartNumber: string,
})

export interface SelectedPartDetailsForEdit {
    Partdetails: PartDetailsForEdit
}

export const selectedPartDetailsForEditDecoder: Decoder<SelectedPartDetailsForEdit> = object({
    Partdetails: partDetailForEditDecoder,
});

export interface PartEditResult {
    IsPartUpdated: Boolean;
}

export const partEditResultDecoder: Decoder<PartEditResult> = object({
    IsPartUpdated: boolean,
});

export interface PartDeleted {
    IsDeleted: Boolean;
}

export const partDeletedDecoder: Decoder<PartDeleted> = object({
    IsDeleted: boolean,
});
