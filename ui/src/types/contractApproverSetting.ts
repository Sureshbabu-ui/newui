import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

//Approver List
export interface ApproverDetails {
    Id: number;
    ApprovalFlowId: number|null
    AccelLocation: string;
    FirstApprover: string | null;
    SecondApprover: string | null;
    RenewalFirstApprover: string | null;
    RenewalSecondApprover: string | null;
}

export const approverDetailsDecoder: Decoder<ApproverDetails> = object({
    Id: number,
    ApprovalFlowId: nullable(number), 
    AccelLocation: string,
    FirstApprover: nullable(string),
    SecondApprover: nullable(string),
    RenewalFirstApprover: nullable(string),
    RenewalSecondApprover: nullable(string),
});

export interface ApproverList {
    ApproverDetails: ApproverDetails[],
    TotalRows: number;
    PerPage:number;
}

export const approverListDecoder: Decoder<ApproverList> = object({
    ApproverDetails: array(approverDetailsDecoder),
    TotalRows: number,
    PerPage:number
});
//Approver List End

//Approver Edit
export interface ApproverEdit {
    ApprovalFlowId: number,
    TenantOfficeId: number,
    FirstApproverId: number,
    SecondApproverId: number,
    RenewalFirstApproverId: number,
    RenewalSecondApproverId: number,
}

export interface ApproverEditResponse {
    IsApproverUpdated: Boolean;
}

export const approverEditDecoder: Decoder<ApproverEditResponse> = object({
    IsApproverUpdated: boolean,
});
//Approver Edit End

//Approver Create
export interface ApproverCreate {
    TenantOfficeId: number,
    FirstApproverId: number,
    SecondApproverId: number,
    RenewalFirstApproverId: number,
    RenewalSecondApproverId: number,
}

export interface ApproverCreateResponse {
    IsApproverCreated: Boolean;
}

export const approverCreateDecoder: Decoder<ApproverCreateResponse> = object({
    IsApproverCreated: boolean,
});
//Approver Create End

//React Select Details
export interface Select {
    value: any,
    label: any
}

export interface SelectDetails {
    Select: Select[]
}
//React Select Details Ends

//Approver Update details
export interface ApproverUpdateDetail {
    ApprovalFlowId: number
    TenantOfficeId: number,
    FirstApproverId: number,
    SecondApproverId: number,
    RenewalFirstApproverId: number,
    RenewalSecondApproverId: number,
}

export const approveUpdateDetailDecoder: Decoder<ApproverUpdateDetail> = object({
    ApprovalFlowId: number,
    TenantOfficeId: number,
    FirstApproverId: number,
    SecondApproverId: number,
    RenewalFirstApproverId: number,
    RenewalSecondApproverId: number,
});

export interface ApproverUpdateDetails {
    ApproverUpdateDetails: ApproverUpdateDetail,
}

export const approveUpdateDetailsDecoder: Decoder<ApproverUpdateDetails> = object({
    ApproverUpdateDetails: (approveUpdateDetailDecoder),
});
//Approver Update details Ends

// Tenant excluded
export interface TenantInfoDetails {
    Id: number;
    OfficeName: string;
}

export const tenantinfoDetailsDecoder: Decoder<TenantInfoDetails> = object({
    Id: number,
    OfficeName: string,
});

export interface TenantOfficeInfo {
    TenantOfficeInfo: TenantInfoDetails[];
}

export const tenantOfficeInfoDecoder: Decoder<TenantOfficeInfo> = object({
    TenantOfficeInfo: array(tenantinfoDetailsDecoder),
});
// Tenant excluded Ends