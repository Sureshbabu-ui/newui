import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface RoleFunctionPermissionListDetails {
  Id: number;
  RoleId: number;
  Name: string;
  BusinessFunctionId: number;
  BusinessModuleId:number;
  BusinessModuleName:string;
  BusinessModuleDescription:string | null;
  Description:string | null;
  Status:boolean;
}

export const roleFunctionPermissionListDecoder: Decoder<RoleFunctionPermissionListDetails> = object({
  Id: number,
  RoleId: number,
  Name: string,
  BusinessFunctionId: number,
  BusinessModuleId:number,
  BusinessModuleName:string,
  BusinessModuleDescription: nullable(string),
  Description: nullable(string),
  Status:boolean
});

export interface RoleFunctionPermissionListResponse {
    RoleFunctionPermissionList: RoleFunctionPermissionListDetails[],
}

export const RoleFunctionPermissionListResponseDecoder: Decoder<RoleFunctionPermissionListResponse> = object({
    RoleFunctionPermissionList: array(roleFunctionPermissionListDecoder),
});

export interface NotificationEdit {
    Id: number;
    RoleId: number;
    Name: string;
    BusinessFunctionId: number;
}

export interface RoleFunctionPermissionUpdateResult {
  IsRoleFunctionPermissionUpdated: boolean;
}

export const roleFunctionPermissionUpdateResultDecoder: Decoder<RoleFunctionPermissionUpdateResult> = object({
  IsRoleFunctionPermissionUpdated: boolean,
});

export interface RoleFunctionPermissionSelectTitleDetails {
  value: any,
  label: any
}

export interface RoleFunctionPermissionSelectTitle {
    RoleFunctionPermissionTitles: RoleFunctionPermissionSelectTitleDetails[];
}