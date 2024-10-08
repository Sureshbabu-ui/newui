import axios from "axios";
import settings from "../config/settings";
import { guard, object } from "decoders";
import { BusinessEventList, BusinessEventNames, businessEventListDecoder, businesseventNamesDecoder } from "../types/businessEvent";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getBusinessEventList = async (search?: string, index?: number): Promise<BusinessEventList> => {
  let url = `businessevent/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(businessEventListDecoder)((await axios.get(url)).data.data);
}

//for getting the events in notification settings from the drop down
export async function getBusinessEventTitles(): Promise<BusinessEventNames> {
  return guard(businesseventNamesDecoder)((await axios.get(`businessevent/get/titles`)).data.data);
}
