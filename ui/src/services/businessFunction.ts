import axios from "axios";
import { BusinessFunctionList, businessFunctionListDecoder } from "../types/businessFunction";
import { guard } from "decoders";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

axios.defaults.baseURL = settings.baseApiUrl;

export const getBusinessFunctionList = async (search?: string, index?: number): Promise<BusinessFunctionList> => {
  let url = `businessfunction/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(businessFunctionListDecoder)((await axios.get(url)).data.data);
}