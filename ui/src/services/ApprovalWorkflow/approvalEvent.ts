import axios from "axios";
import settings from "../../config/settings";
import { guard } from "decoders";
import { ApprovalEventList, approvalEventListDecoder, ApprovalEventNames, approvalEventNamesDecoder} from "../../types/ApprovalWorkflow/approvalEvent";
import { setupInterceptorsTo } from "../../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getApprovalEventList = async (search?: string): Promise<ApprovalEventList> => {
  let url = `approvalevent/list`;
  if (search) {
    url += `?Search=${search}`;
  }
  return guard(approvalEventListDecoder)((await axios.get(url)).data.data);
}

export async function getApprovalEventNames(): Promise<ApprovalEventNames> {
  return guard(approvalEventNamesDecoder)((await axios.get(`approvalevent/get/names`)).data.data);
}

export async function getApprovalEventNamesByUser(): Promise<ApprovalEventNames> {
  return guard(approvalEventNamesDecoder)((await axios.get(`approvalevent/get/names/by/user`)).data.data);
}

