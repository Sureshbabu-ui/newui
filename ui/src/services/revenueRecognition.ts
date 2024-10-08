import { guard } from "decoders";
import { ContractRevenueRecognitionFilter, ContractRevenueRecognitionList, contractRevenueRecognitionListDecoder } from "../types/revenueRecognition";
import axios from "axios";
import { setupInterceptorsTo } from "../interceptor";
import settings from "../config/settings";

setupInterceptorsTo(axios)
axios.defaults.baseURL = settings.baseApiUrl;

export const getRevenueRecognitionListByContract = async (ContractId: string,filters?:ContractRevenueRecognitionFilter): Promise<ContractRevenueRecognitionList> => {
    let url = `revenuerecognition/list/contract/${ContractId}`;
    if (filters) {
        url += `?StartDate=${filters.StartDate}&EndDate=${filters.EndDate}`;
      } 
    return guard(contractRevenueRecognitionListDecoder)((await axios.get(url)).data.data);
  } 