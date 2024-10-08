import axios from "axios";
import {  Err, Ok, Result } from "@hqoss/monads";
import { guard, object } from "decoders";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { RoleFunctionPermissionListDetails, RoleFunctionPermissionListResponse, RoleFunctionPermissionListResponseDecoder, RoleFunctionPermissionUpdateResult, roleFunctionPermissionListDecoder, roleFunctionPermissionUpdateResultDecoder } from "../types/roleFunctionPermission";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getRoleWisePermissionList=async(Id:number,BusinessFunctionType:string, BusinessModuleId?:number|null): Promise<Result<RoleFunctionPermissionListResponse,GenericErrors>>=>{
    let url = `rolefunctionpermission/get/rolewiselist?RoleId=${Id}&BusinessFunctionType=${BusinessFunctionType}`;
  if (BusinessModuleId) {
    url += `&BusinessModuleId=${BusinessModuleId}`;
  }
    const { data } = await axios.get(url);
   return Ok(guard(object({data:RoleFunctionPermissionListResponseDecoder}))(data).data);   
}

export const updateRoleFunctionPermissions = async (RoleFunctionPermissions: RoleFunctionPermissionListDetails[]): Promise<Result<RoleFunctionPermissionUpdateResult, GenericErrors>> => {
    try {
        
        const { data } = await axios.post('rolefunctionpermission/update', {RoleFunctionPermissions:RoleFunctionPermissions}); 
        return Ok(guard(object({ data: roleFunctionPermissionUpdateResultDecoder}))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors); 
    }
}  