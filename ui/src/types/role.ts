
import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface RoleCreate {
    Name: string;
    Code:string;
    IsActive: string;
}

export interface RoleCreateResponse {
    IsRoleCreated: Boolean;
}

export const createDecoder: Decoder<RoleCreateResponse> = object({
    IsRoleCreated: boolean,
});

export interface RoleDetails {
    Id: number;
    Name: string;
    IsActive: boolean;
    IsSystemRole:boolean;
    CreatedBy: string;
    CreatedOn: string;
    UpdatedBy: null | string;
    UpdatedOn: null | string;
}

export const roleDetailsDecoder: Decoder<RoleDetails> = object({
    Id: number,
    Name: string,
    IsActive: boolean,
    IsSystemRole:boolean,
    CreatedBy: string,
    CreatedOn: string,
    UpdatedBy: nullable(string),
    UpdatedOn: nullable(string)
});
export interface RoleList {
    Roles: RoleDetails[],
    TotalRows: number;
    PerPage:number;
}

export const roleListDecoder: Decoder<RoleList> = object({
    Roles: array(roleDetailsDecoder),
    TotalRows: number,
    PerPage:number
});

export interface RoleTitleDetail {
    Id: number;
    RoleName: string;
}

export const roleDetailDecoder: Decoder<RoleTitleDetail> = object({
    Id: number,
    RoleName: string,
});

export interface RoleNames {
    RoleTitles: RoleTitleDetail[];
}

export const roleNamesDecoder: Decoder<RoleNames> = object({
    RoleTitles: array(roleDetailDecoder),
});

// Role Edit
export interface RoleEdit {
    RoleId: null | number
    Name: string;
    IsActive: boolean;
}

export interface RoleEditResponse {
    IsRoleUpdated: Boolean;
}

export const editDecoder: Decoder<RoleEditResponse> = object({
    IsRoleUpdated: boolean,
});
// Role Edit End

export interface RoleDeleteResponse {
    IsDeleted: boolean;
  }
  
  export const roleDeleteResponseDecoder: Decoder<RoleDeleteResponse> = object({
    IsDeleted: boolean,
  });