import axios from "axios";
import settings from "../config/settings";
import { guard, object } from "decoders";
import { PartSubCategoryCreate, PartSubCategoryCreateResult, PartSubCategoryDeleted, PartSubCategoryEditDetails, PartSubCategoryEditResponse, PartSubCategoryList, PartSubCategoryNameList, partSubCategoryCreateResultDecoder, partSubCategoryEditDecoder, partSubCategoryListDecoder, partSubCategoryNameListDecoder, partsubCategoryDeletedDecoder } from "../types/partSubCategory";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getPartSubCategoryList = async (search?: string, index?: number): Promise<PartSubCategoryList> => {
    let url = `partsubcategory/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(partSubCategoryListDecoder)((await axios.get(url)).data.data);
}

export const partSubCategoryEdit = async (partSubCategory: PartSubCategoryEditDetails): Promise<Result<PartSubCategoryEditResponse, GenericErrors>> => {
    try {
        const { data } = await axios.post('partsubcategory/update', partSubCategory);
        return Ok(guard(object({ data: partSubCategoryEditDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getPartSubCategoryNames=async(Id:string|number|null): Promise<PartSubCategoryNameList> =>{
 return guard(partSubCategoryNameListDecoder)((await axios.get(`partsubcategory/get/names/by/categorymapping?PartProductCategoryToPartCategoryMappingId=${Id}`)).data.data);
} 

export const partSubCategoryCreate = async (Part: PartSubCategoryCreate): Promise<Result<PartSubCategoryCreateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('partsubcategory/create', Part);
        return Ok(guard(object({ data: partSubCategoryCreateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
} 

export async function deletePartSubCategory(Id: number): Promise<Result<PartSubCategoryDeleted, GenericErrors>> {
    try {
        const { data } = await axios.put(`partsubcategory/delete?Id=${Id}`);
        return Ok(guard(object({ data: partsubCategoryDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}