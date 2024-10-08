import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard, object } from 'decoders';
import settings from '../config/settings';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { MultipleTenantDetails, SelectedTenant, TenantData, TenantUpdate, TenantUpdateDetails, TenentForCreation, UpdateTenant, multipleTenantDetailsDecoder, selectedtenantDetailsDecoder, tenantDataDecoder, tenantUpdateDetailsDecoder, updateTenantDecoder } from '../types/tenant';
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function createTenant(tenant: TenentForCreation): Promise<Result<TenantData, GenericErrors>> {
  try {
    const { data } = await axios.post("tenant/create", tenant);
    return Ok(guard(object({ data: tenantDataDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getTenantList(index: number, search: string): Promise<MultipleTenantDetails> {
  var url = `tenant/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(multipleTenantDetailsDecoder)((await axios.get(url)).data.data);
}
export async function getClickedTenantDetails(id: string): Promise<SelectedTenant> {
  return guard(selectedtenantDetailsDecoder)((await axios.get(`tenant/get/details?TenantId=${id}`)).data.data);
}

export async function getTenantUpdateDetails(id: string): Promise<TenantUpdate> {
  return guard(tenantUpdateDetailsDecoder)((await axios.get(`tenant/get/update/details?TenantId=${id}`)).data.data);
}

export async function updateTenant(tenant: TenantUpdateDetails): Promise<Result<UpdateTenant, GenericErrors>> {
  try {
    const { data } = await axios.post("tenant/update", tenant);
    return Ok(guard(object({ data: updateTenantDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}