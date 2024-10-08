import axios from "axios";
import settings from "../config/settings";
import { guard } from "decoders";
import { setupInterceptorsTo } from "../interceptor";
import { PmScheduleList, pmScheduleListDecoder, PmScheduleListDetail, pmScheduleListDetailDecoder, PmScheduleView, pmScheduleViewDecoder } from "../types/pmSchedule";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export const pmScheduleList = async (ContractId: number): Promise<PmScheduleListDetail> => {
    const url = `pmschedule/list?&ContractId=${ContractId}`;
    return guard(pmScheduleListDetailDecoder)((await axios.get(url)).data.data);
}

export const pmScheduleDetails = async (PmScheduleId: number): Promise<PmScheduleView> => {
    const url = `pmschedule/details?&PmScheduleId=${PmScheduleId}`;
    return guard(pmScheduleViewDecoder)((await axios.get(url)).data.data);
}