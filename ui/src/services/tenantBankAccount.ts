import axios from "axios";
import { guard, object } from "decoders";
import settings from "../config/settings";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from '@hqoss/monads';
import { TenantBankAccountCreate, TenantBankAccountCreateResult, TenantBankAccountDeleteResponse, TenantBankAccountDetails, TenantBankAccountList, TenantBankAccountNameList, createDecoder, tenantBankAccountDeleteResponseDecoder, tenantBankAccountDetailsDecoder, tenantBankAccountListDecoder, tenantBankAccountNameListDecoder } from "../types/tenantBankAccount";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getTenantBankAccountList = async (tenantId:string, search?: string, index?: number): Promise<TenantBankAccountList> => {
  let url = `tenantbankaccount/list?TenantId=${tenantId}&Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(tenantBankAccountListDecoder)((await axios.get(url)).data.data);
}

export const getTenantBankAccountDetails = async (tenantBankAccountId: number): Promise<TenantBankAccountDetails> => {
   const url = `tenantbankaccount/get/details?TenantBankAccountId=${tenantBankAccountId}`;
  return guard(tenantBankAccountDetailsDecoder)((await axios.get(url)).data.data);
}

export const tenantBankAccountCreate=async(tenantBankAccount: TenantBankAccountCreate): Promise<Result<TenantBankAccountCreateResult, GenericErrors>>=> {
  try {
    const { data } = await axios.post('tenantbankaccount/create', tenantBankAccount);
    return Ok(guard(object({ data: createDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getTenantBankAccountNames=async(): Promise<TenantBankAccountNameList> =>{
  return guard(tenantBankAccountNameListDecoder)((await axios.get(`tenantbankaccount/get/names`)).data.data);
}

export async function deleteTenantBankAccount(Id: number): Promise<Result<TenantBankAccountDeleteResponse, GenericErrors>> {
  try {
    const { data } = await axios.post(`tenantbankaccount/delete?Id=${Id}`);
    return Ok(guard(object({ data: tenantBankAccountDeleteResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}
 