import axios from "axios";
import { ApproverCreate, ApproverCreateResponse, ApproverEdit, ApproverEditResponse, ApproverList, ApproverUpdateDetails, TenantOfficeInfo, approveUpdateDetailsDecoder, approverCreateDecoder, approverEditDecoder, approverListDecoder, tenantOfficeInfoDecoder } from "../types/contractApproverSetting";
import { guard, object } from "decoders";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

// Approver List
export const getContractApproverList = async (search?: string, index?: number): Promise<ApproverList> => {
    let url = `generalcontract/get/approverlist?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(approverListDecoder)((await axios.get(url)).data.data);
}

// Approver Create
export const contractApproverCreate = async (ApproverDetails: ApproverCreate): Promise<Result<ApproverCreateResponse, GenericErrors>> => {
    try {
        const { data } = await axios.post('generalcontract/approvercreate', ApproverDetails);
        return Ok(guard(object({ data: approverCreateDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

// Approver Edit
export const contractApproverEdit = async (ApproverDetails: ApproverEdit): Promise<Result<ApproverEditResponse, GenericErrors>> => {
    try {
        const { data } = await axios.post('generalcontract/approverupdate', ApproverDetails);
        return Ok(guard(object({ data: approverEditDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

//Approver Update Details
export async function getContractApproverUpdateDetails(ApprovalFlowId: number|null): Promise<ApproverUpdateDetails> {
    return guard(approveUpdateDetailsDecoder)((await axios.get(`generalcontract/approverupdate/details?ApprovalFlowId=${ApprovalFlowId}`)).data.data);
}

//tenant office names
export async function getTenantOfficeName(): Promise<TenantOfficeInfo> {
    return guard(tenantOfficeInfoDecoder)((await axios.get(`generalcontract/tenantlocationexcluded/namelist`)).data.data);
}
