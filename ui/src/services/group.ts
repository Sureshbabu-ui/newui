import { guard } from "decoders";
import { GroupNames, groupNameDecoder } from "../types/group";
import axios from "axios";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

//for getting the groups in notification settings from the drop down
export async function getGroupTitles(): Promise<GroupNames> {
    return guard(groupNameDecoder)((await axios.get(`group/get/titles`)).data.data);
  }