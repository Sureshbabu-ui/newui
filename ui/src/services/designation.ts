import axios from "axios";
import settings from "../config/settings";
import { DesignationList, designationListDecoder, DesignationCreate, DesignationCreateResult, createDecoder, GetDesignations, getDesignationsDecoder, DesignationUpdate, DesignationUpdateResult, updateDecoder, DesignationDeleted, designationDeletedDecoder } from "../types/designation";
import { guard, object } from "decoders";
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getDesignationList = async (search?: string, index?: number): Promise<DesignationList> => {
    let url = `designation/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(designationListDecoder)((await axios.get(url)).data.data);
}

export const designationCreate = async (designation: DesignationCreate): Promise<Result<DesignationCreateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('designation/create', designation);
        return Ok(guard(object({ data: createDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function getDesignations(): Promise<GetDesignations> {
    return guard(getDesignationsDecoder)((await axios.get(`designation/get/names`)).data.data);
  }

export const designationUpdate = async (designation: DesignationUpdate): Promise<Result<DesignationUpdateResult, GenericErrors>> => {
    try {
        const { data } = await axios.put('designation/update', designation);
        return Ok(guard(object({ data: updateDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function deleteDesignation(Id: number): Promise<Result<DesignationDeleted, GenericErrors>> {
    try {
        const { data } = await axios.put(`designation/delete?Id=${Id}`);
        return Ok(guard(object({ data: designationDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}