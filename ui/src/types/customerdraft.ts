import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';

export interface SelectedCustomerDraft {
    ApprovalRequestId: number;
    CaseId: number;
    EventCode: string;
    EventName?: string;
    ReviewStatus: string;
    ReviewStatusName: string;
    CreatedOn: string;
    CreatedUserName: string;
    Content: string;
    CreatedBy: number;
}

export const selectedCustomerdraftDecoder: Decoder<SelectedCustomerDraft> = object({
    ApprovalRequestId: number,
    CaseId: number,
    EventCode: string,
    EventName: string,
    ReviewStatus: string,
    ReviewStatusName: string,
    CreatedOn: string,
    CreatedUserName: string,
    Content: string,
    CreatedBy: number
});

export interface CustomerDraftList {
    CustomerDrafts: SelectedCustomerDraft[];
    TotalRows: number;
    CurrentPage: number;
    PerPage: number
}

export const customerDraftListDecoder: Decoder<CustomerDraftList> = object({
    CustomerDrafts: array(selectedCustomerdraftDecoder),
    TotalRows: number,
    CurrentPage: number,
    PerPage: number
});