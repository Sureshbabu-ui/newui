import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { MakeCreate, MakeCreateResult, MakeDeleted, MakeEditDetails, MakeEditResponse, MakeList, makeCreateResultDecoder, makeDeletedDecoder, makeEditDecoder, makeListDecoder } from "../types/make";
import axios from "axios";
import { guard, object } from "decoders";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const makeCreate = async (Make: MakeCreate): Promise<Result<MakeCreateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('make/create', Make);
        return Ok(guard(object({ data: makeCreateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getMakeList = async (search?: string, index?: number): Promise<MakeList> => {
    let url = `make/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(makeListDecoder)((await axios.get(url)).data.data);
}

export async function editMake(makeDetails: MakeEditDetails): Promise<Result<MakeEditResponse, GenericErrors>> {
    try {
        const { data } = await axios.put('make/update', makeDetails);
        return Ok(guard(object({ data: makeEditDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function makeDelete(Id: number): Promise<Result<MakeDeleted, GenericErrors>> {
    try {
        const { data } = await axios.post(`make/delete?MakeId=${Id}`);
        return Ok(guard(object({ data: makeDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}
export const downloadMakeList = async () => {
    const url = `make/list/download`;
    return await axios.get(url, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json',
        }
    });
  }