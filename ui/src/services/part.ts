import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { PartCreate, PartCreateResult, PartList, partCreateResultDecoder, partListDecoder, PartNameList, partNameListDecoder, SelectedPartDetail, selectedPartDetailDecoder, PartDetailsByCode, partDetailsByCodeDecoder, ApprovePart, approvePartDecoder, PartReviewDetail, PartListImprestPo, PartListImprestPoDecoder, SelectedPartDetailsForEdit, selectedPartDetailsForEditDecoder, PartDetailsForEdit, PartEditResult, partEditResultDecoder, PartDeleted, partDeletedDecoder } from "../types/part";
import axios from "axios";
import { guard, object } from "decoders";
import { MakeNames, makesNamesDecoder } from "../types/product";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const partCreate = async (Part: PartCreate): Promise<Result<PartCreateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('approvalrequests/create/partcodification', Part);
        return Ok(guard(object({ data: partCreateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const partEdit = async (Part: PartDetailsForEdit): Promise<Result<PartEditResult, GenericErrors>> => {
    try {
        const { data } = await axios.put('part/edit', Part);
        return Ok(guard(object({ data: partEditResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getPartList = async (search?: string, searchWith?: string, index?: number): Promise<PartList> => {
    let url = `part/list?Page=${index}`;
    if (search && searchWith) {
        url += `&Search=${search}&SearchWith=${searchWith}`;
    }
    return guard(partListDecoder)((await axios.get(url)).data.data);
}

export async function getPartMake(): Promise<MakeNames> {
    return guard(makesNamesDecoder)((await axios.get(`make/name`)).data.data);
}

export async function getPartNames(Id: string | number): Promise<PartNameList> {
    return guard(partNameListDecoder)((await axios.get(`part/get/names?PartCategoryId=${Id}`)).data.data);
}

export async function getClickedPartDetails(Id: number): Promise<SelectedPartDetail> {
    return guard(selectedPartDetailDecoder)((await axios.get(`part/details?PartId=${Id}`)).data.data);
}

export async function getPartDetailsForEdit(Id: number): Promise<SelectedPartDetailsForEdit> {
    return guard(selectedPartDetailsForEditDecoder)((await axios.get(`part/details/for/edit?PartId=${Id}`)).data.data);
}

// Get Part Details By Part Code
export async function getPartDetailsByCode(PartCode: string): Promise<PartDetailsByCode> {
    return guard(partDetailsByCodeDecoder)((await axios.get(`part/get/detailsbycode?PartCode=${PartCode}`)).data.data);
}

export const downloadPartList = async () => {
    const url = `part/list/download`;
    return await axios.get(url, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function approvePart(
    ContentParsed: Object,
    FetchTime: string | null,
    ReviewDetails: PartReviewDetail,
    ReviewStatus: string,
): Promise<Result<ApprovePart, GenericErrors>> {
    try {
        const { data } = await axios.post('approvalrequests/approve/part', {
            ContentParsed,
            FetchTime,
            ReviewDetails,
            ReviewStatus,
        });
        return Ok(guard(object({ data: approvePartDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getProductCategoryPartList = async (ProductCategoryId?: number, PartCategoryId?: number, PartSubCategoryId?: number, MakeId?: number, search?: string, searchWith?: string, index?: number): Promise<PartListImprestPo> => {
    let url = `part/list/by/partproductcategory?&Page=${index}`;
    if (ProductCategoryId) {
        url += `&ProductCategoryId=${ProductCategoryId}`
    }
    if (PartCategoryId) {
        url += `&PartCategoryId=${PartCategoryId}`
    }
    if (PartSubCategoryId) {
        url += `&PartSubCategoryId=${PartSubCategoryId}`
    }
    if (MakeId) {
        url += `&MakeId=${MakeId}`
    }
    if (search && searchWith) {
        url += `&Search=${search}&SearchWith=${searchWith}`;
    }
    return guard(PartListImprestPoDecoder)((await axios.get(url)).data.data);
}

export async function deletePart(Id: number): Promise<Result<PartDeleted, GenericErrors>> {
    try {
        const { data } = await axios.put(`part/delete?Id=${Id}`);
        return Ok(guard(object({ data: partDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}