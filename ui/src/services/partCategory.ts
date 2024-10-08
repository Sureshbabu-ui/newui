import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { AssetProductCategoryPartCategoryNameList, AssetProductCategoryPartCategoryNameListDecoder, PartCategoryCreate, PartCategoryCreateResult, PartCategoryDeleted, PartCategoryEdit, PartCategoryList, PartCategoryNameList, PartCategoryNameListForPO, PartCategoryNameListForPODecoder, PartCategoryUpdateResult, partCategoryCreateResultDecoder, partCategoryDeletedDecoder, partCategoryListDecoder, partCategoryNameListDecoder, partCategoryUpdateResultDecoder } from "../types/partCategory";
import axios from "axios";
import { guard, object } from "decoders";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const partCategoryCreate = async (PartCategory: PartCategoryCreate): Promise<Result<PartCategoryCreateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('partcategory/create', PartCategory);
        return Ok(guard(object({ data: partCategoryCreateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getPartCategoryList = async (search?: string, SearchWith?: string, index?: number): Promise<PartCategoryList> => {
    let url = `partcategory/list?Page=${index}`;
    if (SearchWith && search) {
        url += `&Search=${search}&SearchWith=${SearchWith}`;
    } else if (SearchWith) {
        url += `&SearchWith=${SearchWith}`;
    } else if (search) {
        url += `&Search=${search}`;
    }
    return guard(partCategoryListDecoder)((await axios.get(url)).data.data);
}

export async function getProductPartsCategory(Id: string | number): Promise<PartCategoryNameList> {
    return guard(partCategoryNameListDecoder)((await axios.get(`partproductcategory/partproductcategorymapping?ProductCategoryId=${Id}`)).data.data);
}
export const downloadPartCategoryList = async () => {
    const url = `partcategory/list/download`;
    return await axios.get(url, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function getPartCategoryNames(Id: number): Promise<PartCategoryNameListForPO> {
    return guard(PartCategoryNameListForPODecoder)((await axios.get(`partcategory/names?PartProductCategoryId=${Id}`)).data.data);
}
export async function getAssetProductCategoryPartsCategoryMapping(Id: string | number): Promise<AssetProductCategoryPartCategoryNameList> {
    return guard(AssetProductCategoryPartCategoryNameListDecoder)((await axios.get(`assetproductcategory/partcategorymapping?AssetProductCategoryId=${Id}`)).data.data);
}

export const partCategoryEdit = async (PartCategory: PartCategoryEdit): Promise<Result<PartCategoryUpdateResult, GenericErrors>> => {
    try {
        const { data } = await axios.put('partcategory/update', PartCategory);
        return Ok(guard(object({ data: partCategoryUpdateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function deletePartCategory(Id: number): Promise<Result<PartCategoryDeleted, GenericErrors>> {
    try {
        const { data } = await axios.put(`partcategory/delete?Id=${Id}`);
        return Ok(guard(object({ data: partCategoryDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}