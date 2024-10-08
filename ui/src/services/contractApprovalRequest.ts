import { guard, object } from "decoders";
import { ApprovalRequested, approvalRequestedDecoder, ApproveContract, approveContractDecoder, ApproversDetails, approversDetailsDecoder, ContractRequestChange, contractRequestChangeDecoder, rejectContractDecoder, RejectedContract, MandatoryReviewedDetails, mandatoryReviewedDetailsDecoder } from "../types/contractApprovalRequest";
import axios from "axios";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from "@hqoss/monads";
import { ReviewDetail } from "../components/Pages/ContractSubMenu/General/ContractApprovalRequest/RequestApproval/RequestApproval.slice";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function getContractApproverDetails(Id: number | string, IsRenewContract: Boolean): Promise<ApproversDetails> {
    return guard(approversDetailsDecoder)((await axios.get(`contract/approval/approver/details?TenantId=${Id}&IsRenewalContract=${IsRenewContract}`)).data.data);
}

export async function getContractDetailsReview(ContractId: number | string): Promise<MandatoryReviewedDetails> {
    return guard(mandatoryReviewedDetailsDecoder)((await axios.get(`contract/approval/details/review?ContractId=${ContractId}`)).data.data);
}

export async function submitContractApprovalRequest(ContractId: string, ApproverId: number, ApproverEmail: string, ApproverName: string, ColumnName: string, ReviewDetails: ReviewDetail[]): Promise<Result<ApprovalRequested, GenericErrors>> {
    try {
        const { data } = await axios.post('contract/approval/request', { ContractId, ApproverId, ApproverEmail, ApproverName, ColumnName, ReviewDetails });
        return Ok(guard(object({ data: approvalRequestedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function submitContractApprove(ContractId: string, ColumnName: string, ReviewDetails: ReviewDetail[]): Promise<Result<ApproveContract, GenericErrors>> {
    try {
        const { data } = await axios.post('contract/approval/request/approve', { ContractId, ColumnName, ReviewDetails });
        return Ok(guard(object({ data: approveContractDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function submitContractReject(ContractId: string, ReviewDetails: ReviewDetail[]): Promise<Result<RejectedContract, GenericErrors>> {
    try {
        const { data } = await axios.post('contract/approval/request/reject', { ContractId, ReviewDetails});
        return Ok(guard(object({ data: rejectContractDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function submitContractRequestChange(ContractId: string, ReviewDetails: ReviewDetail[]): Promise<Result<ContractRequestChange, GenericErrors>> {
    try {
        const { data } = await axios.post('contract/approval/request/requestchange', { ContractId, ReviewDetails });
        return Ok(guard(object({ data: contractRequestChangeDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
} 