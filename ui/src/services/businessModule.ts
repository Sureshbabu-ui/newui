import axios from "axios";
import settings from "../config/settings";
import { BusinessModuleList, BusinessModuleNamesFromServerList, BusinessModuleNamesList, businessModuleListDecoder, businessModuleNamesFromServerListDecoder } from "../types/businessModule";
import { guard } from "decoders";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getBusinessModuleList = async (search?: string, index?: number): Promise<BusinessModuleList> => {
  let url = `businessmodule/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(businessModuleListDecoder)((await axios.get(url)).data.data);
}

export const getBusinessModuleListForDropDown = async (): Promise<BusinessModuleNamesFromServerList> => {
  const url = `businessmodule/listnames`;
  return guard(businessModuleNamesFromServerListDecoder)((await axios.get(url)).data.data);
}