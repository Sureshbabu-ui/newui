import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { StockRoomCreate, StockRoomCreateResponse, StockRoomDeleted, StockRoomEdit, StockRoomList, StockRoomNamesList, StockRoomUpdateResponse, createDecoder, stockRoomDeletedDecoder, stockRoomListDecoder, stockRoomNamesListDecoder, updateRoomDecoder } from "../types/stockroom";
import { guard, object } from "decoders";
import axios from "axios";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const stockRoomCreate = async (stockroom: StockRoomCreate): Promise<Result<StockRoomCreateResponse, GenericErrors>> => {
    try {
        const { data } = await axios.post('stockroom/create', stockroom);
        return Ok(guard(object({ data: createDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getStockRoomList = async (search?: string, index?: number): Promise<StockRoomList> => {
    let url = `stockroom/get/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(stockRoomListDecoder)((await axios.get(url)).data.data);
}

export const getStockRoomNames = async (): Promise<StockRoomNamesList> => {
    return guard(stockRoomNamesListDecoder)((await axios.get(`stockroom/names`)).data.data);
}

export const stockRoomUpdate = async (stockroom: StockRoomEdit): Promise<Result<StockRoomUpdateResponse, GenericErrors>> => {
    try {
        const { data } = await axios.put('stockroom/update', stockroom);
        return Ok(guard(object({ data: updateRoomDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function deleteStockRoom(Id: number): Promise<Result<StockRoomDeleted, GenericErrors>> {
    try {
        const { data } = await axios.put(`stockroom/delete?Id=${Id}`);
        return Ok(guard(object({ data: stockRoomDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}