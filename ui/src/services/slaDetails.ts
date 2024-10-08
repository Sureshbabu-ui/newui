import { guard } from "decoders";
import { SlaDetails, slaDetailsDecoder } from "../types/slaDetails";
import axios from "axios";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function getSlaDetails(Id: number): Promise<SlaDetails> {
    return guard(slaDetailsDecoder)((await axios.get(`sla/details?AssetId=${Id}`)).data.data);
} 