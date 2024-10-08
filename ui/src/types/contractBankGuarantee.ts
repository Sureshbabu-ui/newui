import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface BankGuaranteeCreate {
    ContractId: string;
    GuaranteeType: number;
    GuaranteeNumber: string;
    BankBranchInfoId: number;
    GuaranteeStartDate: string;
    GuaranteeEndDate: string;
    GuaranteeAmount: number;
    Remarks: string;
    GuaranteeClaimPeriodInDays: number;
}

export interface BankGuaranteeCreateResult {
    IsBankGuaranteeCreated: Boolean;
}

export const bankGuaranteeCreateResultDecoder: Decoder<BankGuaranteeCreateResult> = object({
    IsBankGuaranteeCreated: boolean,
});

export interface BankGuaranteeDetails {
    Id: number;
    GuaranteeStatusId: number;
    GuaranteeStatus: string;
    GuaranteeType: string;
    GuaranteeNumber: string;
    BranchName: string;
    GuaranteeEndDate: string;
    GuaranteeAmount: number;
    Remarks: string;
    GuaranteeClaimPeriodInDays: number;
    CreatedBy: string;
    CreatedOn: string;
}

export interface BankGuaranteeList {
    BankGuarantees: BankGuaranteeDetails[]
}

export const bankGuaranteeDetailsDecoder: Decoder<BankGuaranteeDetails> = object({
    Id: number,
    GuaranteeStatusId: number,
    GuaranteeStatus: string,
    GuaranteeType: string,
    GuaranteeNumber: string,
    BranchName: string,
    GuaranteeEndDate: string,
    GuaranteeAmount: number,
    Remarks: string,
    GuaranteeClaimPeriodInDays: number,
    CreatedBy: string,
    CreatedOn: string,
})

export const bankGuaranteeListDecoder: Decoder<BankGuaranteeList> = object({
    BankGuarantees: array(bankGuaranteeDetailsDecoder),
});

export interface BankGuaranteeEditDetail {
    Id: number;
    GuaranteeType: number;
    GuaranteeNumber: string;
    BankBranchInfoId: number;
    GuaranteeStartDate: string;
    GuaranteeEndDate: string;
    GuaranteeAmount: number;
    Remarks: string;
    GuaranteeClaimPeriodInDays: number;
}

export const bankGuaranteeEditDetailDecoder: Decoder<BankGuaranteeEditDetail> = object({
    Id: number,
    GuaranteeType: number,
    GuaranteeNumber: string,
    BankBranchInfoId: number,
    GuaranteeStartDate: string,
    GuaranteeEndDate: string,
    GuaranteeAmount: number,
    Remarks: string,
    GuaranteeClaimPeriodInDays: number,
});

export interface BankGuaranteeEditDetails {
    BankGuaranteeDetails: BankGuaranteeEditDetail;
}

export const bankGuaranteeEditDetailsDecoder: Decoder<BankGuaranteeEditDetails> = object({
    BankGuaranteeDetails: bankGuaranteeEditDetailDecoder,
});

export interface BankGuaranteeEditResponse {
    IsBankGuaranteeUpdated: Boolean;
}

export const bankGuaranteeEditDecoder: Decoder<BankGuaranteeEditResponse> = object({
    IsBankGuaranteeUpdated: boolean,
});

export interface Select {
    value: any,
    label: any
}

export interface SelectDetails {
    Select: Select[]
}

export interface Configurations {
    GuaranteeType: Select[],
    BankBranchNames: Select[],
}
