import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import axios from "axios";
import { guard, object } from "decoders";
import { CustomerGroupCreate, CustomerGroupCreateResult, CustomerGroupDeleted, CustomerGroupList, CustomerGroupUpdate, CustomerGroupUpdatedResult, GroupNames, customerGroupCreateResultDecoder, customerGroupListDecoder, customerGroupNamesDecoder, customerGroupUpdatedResultDecoder, customergroupDeletedDecoder } from "../types/customerGroup";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const customerGroupCreate = async (Make: CustomerGroupCreate): Promise<Result<CustomerGroupCreateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('customer/group/create', Make);
        return Ok(guard(object({ data: customerGroupCreateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getCustomerGroupList = async ( index?: number,search?: string): Promise<CustomerGroupList> => {
    let url = `customer/group/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(customerGroupListDecoder)((await axios.get(url)).data.data);
}

export async function getCustomerGroupNames(): Promise<GroupNames> {
    return guard(customerGroupNamesDecoder)((await axios.get(`customer/group/name`)).data.data);
  }

export const customerGroupUpdate = async (Make: CustomerGroupUpdate): Promise<Result<CustomerGroupUpdatedResult, GenericErrors>> => {
    try {
        const { data } = await axios.put('customer/group/update', Make);
        return Ok(guard(object({ data: customerGroupUpdatedResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function deleteCustomerGroup(Id: number): Promise<Result<CustomerGroupDeleted, GenericErrors>> {
    try {
        const { data } = await axios.put(`customer/group/delete?Id=${Id}`);
        return Ok(guard(object({ data: customergroupDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}