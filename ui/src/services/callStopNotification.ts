import { guard} from "decoders";
import { CallStopCount, CallStopCountDecoder } from "../types/callStopNotification";
import axios from "axios";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function getCallStopCount(): Promise<CallStopCount> {
    return guard(CallStopCountDecoder)((await axios.get(`contractsetting/get/callstopcount`)).data.data);
}