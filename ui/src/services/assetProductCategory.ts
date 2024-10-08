import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { AssetProductCategoryNames, AssetProductCategoryNamesDecoder, DeleteAssetPCResponseData, ProductCategoryCreate, ProductCategoryCreateResult, ProductCategoryDetails, ProductCategoryList, ProductCategoryUpdateResult, ResponseData, SelectedProductCategory, SelectedProductCategoryPartsNotCovered, deleteAssetPCResponseDataDecoder, productCategoryCreateResultDecoder, productCategoryDetailDecoder, productCategoryListDecoder, productCategoryUpdateResultDecoder, responseDataDecoder, selectedproductCategoryPartsNotCoveredDecoder } from "../types/assetProductCategory";
import axios from "axios";
import { guard, object } from "decoders";
import { PCPartsNotCovered } from "../components/Pages/MasterData/AssetProductCategory/AssetProductCategorySubMenu/ProductCategoryPartsNotCovered/ProductCategoryPartsNotCovered.slice";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const assetProductCategoryCreate = async (productCategory: ProductCategoryCreate): Promise<Result<ProductCategoryCreateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('assetproductcategory/create', productCategory);
        return Ok(guard(object({ data: productCategoryCreateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const assetProductCategoryEdit = async (productCategory: ProductCategoryDetails): Promise<Result<ProductCategoryUpdateResult, GenericErrors>> => {
    try {
        const { data } = await axios.put('assetproductcategory/update', productCategory);
        return Ok(guard(object({ data: productCategoryUpdateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getAssetProductCategoryList = async (search?: string, index?: number): Promise<ProductCategoryList> => {
    let url = `assetproductcategory/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(productCategoryListDecoder)((await axios.get(url)).data.data);
}

export async function getAssetProductCategoryNames(): Promise<AssetProductCategoryNames> {
    return guard(AssetProductCategoryNamesDecoder)((await axios.get(`assetproductcategory/get/names`)).data.data);
}

export async function UpdatePartsNotCovered(selectedpartscategory: PCPartsNotCovered): Promise<Result<ResponseData, GenericErrors>> {
    try {
        const { data } = await axios.post("assetproductcategory/update/partsnotcovered", selectedpartscategory);
        return Ok(guard(object({ data: responseDataDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function getProductCategoryPartsNotCovered(id:string): Promise<SelectedProductCategoryPartsNotCovered> {
    return guard(selectedproductCategoryPartsNotCoveredDecoder)((await axios.get(`assetproductcategory/partsnotcovered?ProductCategoryId=${id}`)).data.data);
}

export async function getProductCategoryDetails(Id: string): Promise<SelectedProductCategory> {
    return guard(productCategoryDetailDecoder)((await axios.get(`assetproductcategory/get/details?ProductCategoryId=${Id}`)).data.data);
}

export async function deleteAssetProductCategory(Id: number): Promise<Result<DeleteAssetPCResponseData, GenericErrors>> {
    try {
        const { data } = await axios.put(`assetproductcategory/delete?Id=${Id}`);
        return Ok(guard(object({ data: deleteAssetPCResponseDataDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}