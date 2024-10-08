import { guard, object } from 'decoders';
import { ManagersList, ResponseTenantOfficeDeleted, SelectedTenantOffice, TenantOfficeCreate, TenantOfficeCreateResult, TenantOfficeEdit, TenantOfficeEditDetails, TenantOfficeInfo, TenantOfficeList, TenantOfficeNameInfo, TenantOfficeUpdateResult, managerDecoder, responseTenantOfficeDeletedDecoder, selectedTenantOfficeDecoder, tenantOfficeCreateDecoder, tenantOfficeEditDetailsDecoder, tenantOfficeInfoDecoder, tenantOfficeInfoNameDecoder, tenantOfficeListDecoder, tenantOfficeUpdateDecoder } from '../types/tenantofficeinfo';
import axios from 'axios';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { Err, Ok, Result } from '@hqoss/monads';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export async function getTenantOfficeInfo(TenantOfficeId?: number): Promise<TenantOfficeInfo> {
  let url = "tenantlocation/list";
  if (TenantOfficeId) {
    url += `?TenantOfficeId=${TenantOfficeId}`
  }
  return guard(tenantOfficeInfoDecoder)((await axios.get(url)).data.data);
}

export async function getTenantOfficeName(): Promise<TenantOfficeNameInfo> {
  return guard(tenantOfficeInfoNameDecoder)((await axios.get(`tenantlocation/namelist`)).data.data);
}

export const getTenantOfficeList = async (SearchWith?: string, index?: number): Promise<TenantOfficeList> => {
  let url = `tenantlocation/get/list/?Page=${index}`;
  if (SearchWith) {
    url += `&SearchWith=${SearchWith}`;
  }
  return guard(tenantOfficeListDecoder)((await axios.get(url)).data.data);
}

export const tenantOfficeCreate = async (tenantOffice: TenantOfficeCreate): Promise<Result<TenantOfficeCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('tenantlocation/create', tenantOffice);
    return Ok(guard(object({ data: tenantOfficeCreateDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getManagersList(): Promise<ManagersList> {
  return guard(managerDecoder)((await axios.get(`user/managers`)).data.data);
}

export async function getTenantOfficeDetails(Id: string): Promise<SelectedTenantOffice> {
  return guard(selectedTenantOfficeDecoder)((await axios.get(`tenantlocation/details?TenantOfficeId=${Id}`)).data.data);
}

export async function getRegionWiseTenantOfficeList(RegionId: string): Promise<TenantOfficeNameInfo> {
  return guard(tenantOfficeInfoNameDecoder)((await axios.get(`tenantlocation/regionwise/locations?RegionId=${RegionId}`)).data.data);
}

export async function getRegionAndCategoryWiseWiseTenantOfficeList(RegionId: string): Promise<TenantOfficeNameInfo> {
  return guard(tenantOfficeInfoNameDecoder)((await axios.get(`tenantlocation/regionwise/categorywise/locations?RegionId=${RegionId}`)).data.data);
}

export async function deleteTenantOffice(Id: number): Promise<Result<ResponseTenantOfficeDeleted, GenericErrors>> {
  try {
    const { data } = await axios.put(`tenantlocation/delete?Id=${Id}`);
    return Ok(guard(object({ data: responseTenantOfficeDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getTenantOfficeEditDetails(Id: number): Promise<TenantOfficeEditDetails> {
  return guard(tenantOfficeEditDetailsDecoder)((await axios.get(`tenantlocation/update/details?TenantOfficeId=${Id}`)).data.data);
}

export const tenantOfficeUpdate = async (tenantOffice: TenantOfficeEdit): Promise<Result<TenantOfficeUpdateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('tenantlocation/update', tenantOffice);
    return Ok(guard(object({ data: tenantOfficeUpdateDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}