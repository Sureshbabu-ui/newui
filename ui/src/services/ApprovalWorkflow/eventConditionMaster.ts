import axios from "axios";
import settings from "../../config/settings";
import { guard } from "decoders";
import { EventConditionMasterList, eventConditionMasterListDecoder} from "../../types/ApprovalWorkflow/eventConditionMaster";
import { setupInterceptorsTo } from "../../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getEventConditionMasterList = async (ApprovalEventId: number): Promise<EventConditionMasterList> => {
  const url = `eventconditionmaster/list?ApprovalEventId=${ApprovalEventId}`;
  return guard(eventConditionMasterListDecoder)((await axios.get(url)).data.data);
}