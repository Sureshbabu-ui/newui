import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { guard, object } from "decoders";
import axios from "axios";
import { StockBinCreate, StockBinCreateResponse, StockBinDeleted, StockBinEdit, StockBinEditResponse, StockBinList, createDecoder, editDecoder, stockBinDeletedDecoder, stockBinListDecoder } from "../types/stockbin";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const stockBinCreate = async (stockbin: StockBinCreate): Promise<Result<StockBinCreateResponse, GenericErrors>> => {
    try {
        const { data } = await axios.post('stockbin/create', stockbin);
        return Ok(guard(object({ data: createDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getStockBinList = async (search?: string, index?: number): Promise<StockBinList> => {
    let url = `stockbin/get/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(stockBinListDecoder)((await axios.get(url)).data.data);
}

export const stockBinEdit = async (stockbin: StockBinEdit): Promise<Result<StockBinEditResponse, GenericErrors>> => {
    try {
        const { data } = await axios.put('stockbin/update', stockbin);
        return Ok(guard(object({ data: editDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function deleteStockBin(Id: number): Promise<Result<StockBinDeleted, GenericErrors>> {
    try {
        const { data } = await axios.put(`stockbin/delete?Id=${Id}`);
        return Ok(guard(object({ data: stockBinDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}