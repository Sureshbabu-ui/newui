import { array, boolean, Decoder, nullable, number, object, string } from "decoders";
import { ApprovalRequestReviewListDetail, approvalRequestReviewListDetailDecoder } from "./pendingApproval";

export interface customerApprovalDetail {
    Id: number;
    CaseId: number;
    TableName: string;
    Name: string;
    NameOnPrint: string;
    CustomerGroup: string | null;
    CustomerIndustry: string | null;
    Location: string;
    BilledToAddress: string;
    BilledToCity: string;
    BilledToState: string;
    BilledToCountry: string;
    BilledToPincode: string;
    BilledToGstNumber: string;
    ShippedToAddress: string;
    ShippedToCity: string;
    ShippedToState: string;
    ShippedToCountry: string;
    ShippedToPincode: string;
    ShippedToGstNumber: string;
    ReviewStatus: string;
    CreatedOn: string;
    CreatedUserName: string;
    PrimaryContactEmail: string;
    PrimaryContactName: string;
    PrimaryContactPhone: string;
    SecondaryContactName: string | null;
    SecondaryContactEmail: string | null;
    SecondaryContactPhone: string | null;
    PanNumber: string | null;
    TinNumber: string | null;
    TanNumber: string | null;
    CinNumber: string | null;
    IsMsme: boolean;
    MsmeRegistrationNumber: string | null;
    ReviewStatusName: string;
    FetchTime: string;
}

export const CustomerApprovalDetailDecoder: Decoder<customerApprovalDetail> = object({
    Id: number,
    CaseId: number,
    TableName: string,
    Name: string,
    NameOnPrint: string,
    CustomerGroup: nullable(string),
    CustomerIndustry: nullable(string),
    Location: string,
    BilledToAddress: string,
    BilledToCity: string,
    BilledToState: string,
    BilledToCountry: string,
    BilledToPincode: string,
    BilledToGstNumber: string,
    ShippedToAddress: string,
    ShippedToCity: string,
    ShippedToState: string,
    ShippedToCountry: string,
    ShippedToPincode: string,
    ShippedToGstNumber: string,
    ReviewStatus: string,
    CreatedOn: string,
    CreatedUserName: string,
    PrimaryContactEmail: string,
    PrimaryContactName: string,
    PrimaryContactPhone: string,
    SecondaryContactName: nullable(string),
    SecondaryContactEmail: nullable(string),
    SecondaryContactPhone: nullable(string),
    PanNumber: nullable(string),
    TinNumber: nullable(string),
    TanNumber: nullable(string),
    CinNumber: nullable(string),
    IsMsme: boolean,
    MsmeRegistrationNumber: nullable(string),
    ReviewStatusName: string,
    FetchTime: string
});

export interface CustomerApprovalDetailWithReview {
    CustomerDetail: customerApprovalDetail;
    ApprovalRequestReviewList: ApprovalRequestReviewListDetail[]
}

export const customerApprovalDetailWithReviewDecoder: Decoder<CustomerApprovalDetailWithReview> = object({
    CustomerDetail: CustomerApprovalDetailDecoder,
    ApprovalRequestReviewList: array(approvalRequestReviewListDetailDecoder)
});

// Approve Customer
export interface ApproveCustomer {
    IsApproved: boolean;
}

export const approveCustomerDecoder: Decoder<ApproveCustomer> = object({
    IsApproved: boolean,
});

export interface ResponseCustomerDeleted {
    IsDeleted: Boolean;
  }
  
  export const responseCustomerDeletedDecoder: Decoder<ResponseCustomerDeleted> = object({
    IsDeleted: boolean
  })
