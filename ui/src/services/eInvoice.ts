import axios from "axios";
import { EInvoiceList, eInvoiceListDecoder } from "../types/eInvoice";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";
import { guard } from "decoders";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 
export const getEInvoiceList = async (search?: string, index?: number): Promise<EInvoiceList> => {
    let url = `einvoice/list?Page=${index}`;
    if (search) {
      url += `&Search=${search}`;
    }
    return guard(eInvoiceListDecoder)((await axios.get(url)).data.data);
} 