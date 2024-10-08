import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";
import axios from "axios";
import { guard, object} from "decoders";
import { editDecoder, GstTaxRateEdit, GstTaxRateEditResponse, GstTaxRateList, GstTaxRateListDecoder } from "../types/GstTaxRate";
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from "../types/error";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getGstTaxRateList = async (search?: string): Promise<GstTaxRateList> => {
    let url = `gst/list`;
    if (search) {
        url += `?Search=${search}`;
    }
    return guard(GstTaxRateListDecoder)((await axios.get(url)).data.data);
}

export const gstEdit = async (role: GstTaxRateEdit): Promise<Result<GstTaxRateEditResponse, GenericErrors>> => {
    try {
        const { data } = await axios.put('gst/update', role);
        return Ok(guard(object({ data: editDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}