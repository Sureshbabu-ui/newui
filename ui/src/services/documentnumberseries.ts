import axios from "axios";
import { DNSList, dnsListDecoder, DocumentNumberSeriesCreate, NumberSeriesResponse, numberSeriesResponseDecoder } from "../types/documentnumberseries";
import { guard, object } from "decoders";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getDocumentNumberSeriesList = async (search?: number | null, index?: number): Promise<DNSList> => {
    let url = `documentnumberseries/list?Page=${index}`;
    if (search) {
        url += `&DocumentTypeId=${search}`;
    }
    return guard(dnsListDecoder)((await axios.get(url)).data.data);
}

export async function createDocumentNumberSeries(numberseries: DocumentNumberSeriesCreate): Promise<Result<NumberSeriesResponse, GenericErrors>> {
    try {
        const { data } = await axios.post("documentnumberseries/create", numberseries);
        return Ok(guard(object({ data: numberSeriesResponseDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}