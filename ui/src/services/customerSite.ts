import axios from "axios";
import { CustomerSiteNamesByFilter, customerSiteNamesByFilterDecoder } from "../types/customerSite";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";
import { guard } from "decoders";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 
export async function getCustomerSiteNamesByContractFilter(ContractId:null|number): Promise<CustomerSiteNamesByFilter> {
    let url = `customersite/get/names/by/contractfilter`;
    const params: string[] = [];
        if (ContractId) {
        params.push(`ContractId=${ContractId}`);
      } 
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return guard(customerSiteNamesByFilterDecoder)((await axios.get(url)).data.data);
  }