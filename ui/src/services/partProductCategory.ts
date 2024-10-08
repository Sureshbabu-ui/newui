import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { PartProductCategoryEdit, ProductCategoryCreate, ProductCategoryCreateResult, ProductCategoryDeleted, ProductCategoryList, ProductCategoryUpdateResult, productCategoryCreateResultDecoder, productCategoryDeletedDecoder, productCategoryListDecoder, productCategoryUpdateResultDecoder } from "../types/partProductCategory";
import axios from "axios";
import { guard, object } from "decoders";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const productCategoryCreate = async (productCategory: ProductCategoryCreate): Promise<Result<ProductCategoryCreateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('partproductcategory/create', productCategory);
        return Ok(guard(object({ data: productCategoryCreateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getPartProductCategoryList = async (search?: string, index?: number): Promise<ProductCategoryList> => {
    let url = `partproductcategory/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(productCategoryListDecoder)((await axios.get(url)).data.data);
}

export async function productCategoryDelete(Id: number): Promise<Result<ProductCategoryDeleted, GenericErrors>> {
    try {
        const { data } = await axios.post('partproductcategory/delete', { Id });
        return Ok(guard(object({ data: productCategoryDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}
export const downloadProductCategoryList = async () => {
    const url = `partproductcategory/list/download`;
    return await axios.get(url, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const productCategoryEdit = async (productCategory: PartProductCategoryEdit): Promise<Result<ProductCategoryUpdateResult, GenericErrors>> => {
    try {
        const { data } = await axios.put('partproductcategory/update', productCategory);
        return Ok(guard(object({ data: productCategoryUpdateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}