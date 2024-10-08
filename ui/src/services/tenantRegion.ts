import axios from "axios";
import { RegionEditResponse, RegionNames, ResponseTenantRegionDeleted, SelectedRegion, TenantRegionCreateResult, TenantRegions, TenantRegionsCreate, TenantRegionsEdit, regionEditDecoder, regionNamesNamesDecoder, responseTenantRegionDeletedDecoder, selectedRegionDecoder, tenantRegionsDecoder, tenantregionCreateDecoder } from "../types/tenantRegion";
import { guard, object } from "decoders";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getTenantRegionsList = async (search?: string, index?: number): Promise<TenantRegions> => {
    let url = `/tenantregion/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(tenantRegionsDecoder)((await axios.get(url)).data.data);
}

export const tenantRegionCreate = async (tenantRegion: TenantRegionsCreate): Promise<Result<TenantRegionCreateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('tenantregion/create', tenantRegion);
        return Ok(guard(object({ data: tenantregionCreateDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function getClickedRegionDetails(Id: string): Promise<SelectedRegion> {
    return guard(selectedRegionDecoder)((await axios.get(`tenantregion/details?TenantRegionId=${Id}`)).data.data);
}

export async function editRegion(region: TenantRegionsEdit): Promise<Result<RegionEditResponse, GenericErrors>> {
    try {
        const { data } = await axios.put('tenantregion/update', region);
        return Ok(guard(object({ data: regionEditDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function getTenantRegionNames(): Promise<RegionNames> {
    return guard(regionNamesNamesDecoder)((await axios.get(`tenantregion/get/names`)).data.data);
}

export async function getCategoryWiseTenantRegionNames(): Promise<RegionNames> {
    return guard(regionNamesNamesDecoder)((await axios.get(`tenantregion/get/categorywise/names`)).data.data);
}

export async function deleteTenantRegion(Id: number): Promise<Result<ResponseTenantRegionDeleted, GenericErrors>> {
    try {
        const { data } = await axios.put(`tenantregion/delete?Id=${Id}`);
        return Ok(guard(object({ data: responseTenantRegionDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}  