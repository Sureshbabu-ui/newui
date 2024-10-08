import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApprovalRequestReviewListDetail } from '../../../../../types/pendingApproval';
import { ValidationErrors } from '../../../../../types/error';
import { customerApprovalDetail, CustomerApprovalDetailWithReview } from '../../../../../types/customerpendingapproval';

export interface CustomerReviewDetail {
  Id: null;
  CustomerId: null;
  ReviewComment: string;
  ReviewedBy: null,
  CreatedOn: null,
  ReviewStatus: string
}

export interface CustomerApprovalListState {
  selectedApprovals: customerApprovalDetail,
  ReviewList: ApprovalRequestReviewListDetail[],
  ReviewDetails: CustomerReviewDetail;
  ReviewedJsonDetails: CustomerReviewDetail[];
  ReviewStatus: string;
  approveModalStatus: boolean;
  rejectModalStatus: boolean;
  requestChangeModalStatus: boolean;
  errors: ValidationErrors;
  isApprovalNeeded: boolean
}

const initialState: CustomerApprovalListState = {
  selectedApprovals: {
    Id: 0,
    CaseId: 0,
    BilledToAddress: "",
    BilledToCity: "",
    BilledToCountry: "",
    BilledToGstNumber: "",
    BilledToPincode: "",
    BilledToState: "",
    CinNumber: "",
    CreatedOn: "",
    CreatedUserName: "",
    CustomerGroup: "",
    CustomerIndustry: "",
    IsMsme: false,
    Location: "",
    MsmeRegistrationNumber: "",
    Name: "",
    NameOnPrint: "",
    PanNumber: "",
    PrimaryContactEmail: "",
    PrimaryContactName: "",
    PrimaryContactPhone: "",
    ReviewStatus: "",
    ReviewStatusName: "",
    SecondaryContactEmail: "",
    SecondaryContactName: "",
    SecondaryContactPhone: "",
    ShippedToAddress: "",
    ShippedToCity: "",
    ShippedToCountry: "",
    ShippedToGstNumber: "",
    ShippedToPincode: "",
    ShippedToState: "",
    TanNumber: "",
    TinNumber: "",
    TableName: "",
    FetchTime: ""
  },
  ReviewList: [],
  ReviewDetails: {
    ReviewComment: '',
    ReviewedBy: null,
    CreatedOn: null,
    Id: null,
    CustomerId: null,
    ReviewStatus: ''
  },
  ReviewedJsonDetails: [{
    ReviewComment: '',
    ReviewedBy: null,
    CreatedOn: null,
    Id: null,
    CustomerId: null,
    ReviewStatus: ''
  }],
  ReviewStatus: '',
  approveModalStatus: false,
  rejectModalStatus: false,
  requestChangeModalStatus: false,
  isApprovalNeeded: true,
  errors: {}
};

const slice = createSlice({
  name: 'customerrequestinfo',
  initialState,
  reducers: {
    initializeCustomerRequestDetails: () => initialState,
    loadCustomerSelectedApproval: (state, { payload: ApprovalRequestDetails }: PayloadAction<CustomerApprovalDetailWithReview>) => {
      state.selectedApprovals = ApprovalRequestDetails.CustomerDetail      
      state.ReviewList = ApprovalRequestDetails.ApprovalRequestReviewList
    },
    setReviewDetails: (state, { payload: { name, value } }: PayloadAction<{ name: keyof CustomerApprovalListState['ReviewDetails']; value: any }>
    ) => {
      state.ReviewDetails[name] = value as never;
    },
    loadReviewDetails: (state, { payload: reviewDetails }: PayloadAction<CustomerReviewDetail[]>) => {
      state.ReviewedJsonDetails = reviewDetails;
    },
    toggleApproveModalStatus: (state) => {
      state.approveModalStatus = !state.approveModalStatus;
    },
    toggleRejectModalStatus: (state) => {
      state.rejectModalStatus = !state.rejectModalStatus;
    },
    toggleRequestChangeModalStatus: (state) => {
      state.requestChangeModalStatus = !state.requestChangeModalStatus;
    },
    isApprovalNeededStatus: (state) => {
      state.isApprovalNeeded = !state.isApprovalNeeded;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    updateReviewStatus: (state, { payload: status }: PayloadAction<string>) => {
      state.ReviewStatus = status;
      state.ReviewDetails.ReviewStatus = status
    },
  },
});

export const {
  initializeCustomerRequestDetails,
  loadCustomerSelectedApproval,
  setReviewDetails,
  updateErrors,
  isApprovalNeededStatus,
  toggleApproveModalStatus,
  toggleRejectModalStatus,
  updateReviewStatus,
  loadReviewDetails,
  toggleRequestChangeModalStatus
} = slice.actions;
export default slice.reducer;
