
import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface DesignationCreate {
    Code: string;
    Name: string;
    IsActive: string;
}

export interface DesignationUpdate {
    Id:number;
    Name: string;
    IsActive: string;
}

export interface DesignationCreateResult {
    IsDesignationCreated: Boolean;
}

export const createDecoder: Decoder<DesignationCreateResult> = object({
    IsDesignationCreated: boolean,
});

export interface DesignationDetails {
    Id: number;
    Code: string;
    Name: string;
    IsActive: boolean;
    CreatedByFullName: string;
    CreatedOn: string;
    UpdatedByFullName: null | string;
    UpdatedOn: null | string;
}

export interface DesignationList {
    Designations: DesignationDetails[],
    TotalRows: number;
    PerPage: number;
}

export const designationDetailsDecoder: Decoder<DesignationDetails> = object({
    Id: number,
    Code: string,
    Name: string,
    IsActive: boolean,
    CreatedByFullName: string,
    CreatedOn: string,
    UpdatedByFullName: nullable(string),
    UpdatedOn: nullable(string)
});

export const designationListDecoder: Decoder<DesignationList> = object({
    Designations: array(designationDetailsDecoder),
    TotalRows: number,
    PerPage: number
});

export interface EntityDetails {
    Id: number;
    Name: string;
    Code: string;
}

export const entityDetailsDecoder: Decoder<EntityDetails> = object({
    Id: number,
    Name: string,
    Code: string
});

export interface GetDesignations {
    Designations: EntityDetails[];
}

export const getDesignationsDecoder: Decoder<GetDesignations> = object({
    Designations: array(entityDetailsDecoder),
});

export interface DesignationUpdateResult {
    IsDesignationUpdated: Boolean;
}

export const updateDecoder: Decoder<DesignationUpdateResult> = object({
    IsDesignationUpdated: boolean,
});

export interface DesignationDeleted {
    IsDeleted: Boolean;
}

export const designationDeletedDecoder: Decoder<DesignationDeleted> = object({
    IsDeleted: boolean,
});
