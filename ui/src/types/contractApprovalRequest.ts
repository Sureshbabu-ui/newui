import { Decoder, array, boolean, number, object, string } from "decoders";

export interface ApproverDetails {
    FirstApprover: string,
    FirstApproverEmployeeCode: string,
    FirstApproverEmail: string,
    FirstApproverId: number,
    SecondApproverId: number,
    FirstApproverDesignation: string,
    SecondApprover: string,
    SecondApproverEmployeeCode: string,
    SecondApproverEmail: string,
    SecondApproverDesignation: string,
    Location: string
}

export const approverDetailsDecoder: Decoder<ApproverDetails> = object({
    FirstApprover: string,
    FirstApproverEmployeeCode: string,
    FirstApproverEmail: string,
    FirstApproverDesignation: string,
    SecondApprover: string,
    SecondApproverEmployeeCode: string,
    SecondApproverEmail: string,
    SecondApproverDesignation: string,
    Location: string,
    FirstApproverId: number,
    SecondApproverId: number,
});

export interface ApproversDetails {
    ApproversDetails: ApproverDetails
}

export const approversDetailsDecoder: Decoder<ApproversDetails> = object({
    ApproversDetails: (approverDetailsDecoder)
});


export interface ApprovalRequested {
    IsApprovalRequested: boolean
}

export const approvalRequestedDecoder: Decoder<ApprovalRequested> = object({
    IsApprovalRequested: boolean
});

export interface ApproveContract {
    IsContractApproved: boolean
}

export const approveContractDecoder: Decoder<ApproveContract> = object({
    IsContractApproved: boolean
});

export interface RejectedContract {
    IsContractRejected: boolean
}

export const rejectContractDecoder: Decoder<RejectedContract> = object({
    IsContractRejected: boolean
});

export interface ContractRequestChange {
    IsContractChangeRequested: boolean
}

export const contractRequestChangeDecoder: Decoder<ContractRequestChange> = object({
    IsContractChangeRequested: boolean
});

//Reviewed Details

export interface MandatoryReviewedDetail {
    IsMandatoryDetails: boolean,
    IsManpower: boolean,
    IsAssetSummary: boolean,
    IsContractDocuments: boolean,
    IsPaymentDetails:boolean
}

export const mandatoryReviewedDetailDecoder: Decoder<MandatoryReviewedDetail> = object({
    IsMandatoryDetails: boolean,
    IsManpower: boolean,
    IsAssetSummary: boolean, 
    IsContractDocuments: boolean,
    IsPaymentDetails: boolean, 
});

export interface MandatoryReviewedDetails {
    ReviewedDetails: MandatoryReviewedDetail
}

export const mandatoryReviewedDetailsDecoder: Decoder<MandatoryReviewedDetails> = object({
    ReviewedDetails: mandatoryReviewedDetailDecoder
});
