import axios from "axios";
import { CallExpiryUpdateResult, CallStatusUpdateResult, CallStopHistoryDetails, CallStopStatus, CallStopUpdateData, ContractCloseDetail, ContractCloseResult, ContractExpiryDetail, callExpiryUpdateResultDecoder, callStatusUpdateResultDecoder, callStopHistoryDetailsDecoder, callStopStatusDecoder, contractCloseDetailDecoder, contractCloseResultDecoder, contractExpiryDetailDecoder } from "../types/contractSetting";
import { guard, object } from "decoders";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getCallStopStatus = async (contractId: string): Promise<CallStopStatus> => {
    const url = `contractsetting/get/details?ContractId=${contractId}`;
    return guard(callStopStatusDecoder)((await axios.get(url)).data.data);
}

export const getContractExpiryDetail = async (contractId: string): Promise<ContractExpiryDetail> => {
    const url = `contractsetting/get/contractexpirydetail?ContractId=${contractId}`;
    return guard(contractExpiryDetailDecoder)((await axios.get(url)).data.data);
}

export const updateContractCallExpiry = async (contractId: string, CallExpiryDate: string): Promise<Result<CallExpiryUpdateResult, GenericErrors>> => {
    try {
        const { data } = await axios.put(`contractsetting/${contractId}/updatecallexpiry?CallExpiryDate=${CallExpiryDate}`);
        return Ok(guard(object({ data: callExpiryUpdateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getCallStopHistory = async (contractId: string): Promise<CallStopHistoryDetails> => {
    const url = `contractsetting/get/callstophistory?ContractId=${contractId}`;
    return guard(callStopHistoryDetailsDecoder)((await axios.get(url)).data.data);
}

export const updateCallStatusDetails = async (contractId: string, callStatusData: CallStopUpdateData): Promise<Result<CallStatusUpdateResult, GenericErrors>> => {
    try {
        const { data } = await axios.put(`contractsetting/${contractId}/updatecallstatus`, callStatusData);
        return Ok(guard(object({ data: callStatusUpdateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const closeContract = async (contractId: string): Promise<Result<ContractCloseResult, GenericErrors>> => {
    try {
        const { data } = await axios.put(`contract/${contractId}/close`);
        return Ok(guard(object({ data: contractCloseResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getCloseContractDetail = async (contractId: string): Promise<ContractCloseDetail> => {
    return guard(contractCloseDetailDecoder)((await axios.get(`contractsetting/${contractId}/get/close/detail`)).data.data);
}  