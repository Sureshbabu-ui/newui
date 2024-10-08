import axios from "axios";
import settings from "../config/settings";
import { guard, object } from "decoders";
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { RoleCreate, RoleCreateResponse, RoleList, roleListDecoder, createDecoder, RoleNames, roleNamesDecoder, RoleEditResponse, RoleEdit, editDecoder, RoleDeleteResponse, roleDeleteResponseDecoder } from "../types/role";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getRoleList = async (search?: string, index?: number): Promise<RoleList> => {
    let url = `role/get/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(roleListDecoder)((await axios.get(url)).data.data);
}

export const roleCreate = async (role: RoleCreate): Promise<Result<RoleCreateResponse, GenericErrors>> => {
    try {
        const { data } = await axios.post('role/create', role);
        return Ok(guard(object({ data: createDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getRoleTitles = async (): Promise<RoleNames> => {
    return guard(roleNamesDecoder)((await axios.get(`role/get/titles`)).data.data);
}

// Role Edit
export const roleEdit = async (role: RoleEdit): Promise<Result<RoleEditResponse, GenericErrors>> => {
    try {
        const { data } = await axios.post('role/update', role);
        return Ok(guard(object({ data: editDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function deleteRole(Id: number): Promise<Result<RoleDeleteResponse, GenericErrors>> {
    try {
      const { data } = await axios.post(`role/delete?Id=${Id}`);
      return Ok(guard(object({ data: roleDeleteResponseDecoder}))(data).data);
    } catch ({ response: { data } }) {
      return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
  }
  