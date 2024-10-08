import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { ApprovalRequestReviewListDetail } from '../../../../../types/pendingApproval';
import { customerApprovalDetail, CustomerApprovalDetailWithReview } from '../../../../../types/customerpendingapproval';

export interface CustomerPendingDetailState {
  selectedApprovals: customerApprovalDetail,
  ReviewDetails: ApprovalRequestReviewListDetail[];
  errors: ValidationErrors;
  SelectedId:number|null;
}

const initialState: CustomerPendingDetailState = {
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
  SelectedId:null,
  ReviewDetails:[],
  errors: {}
};

const slice = createSlice({
  name: 'customerpendingview',
  initialState,
  reducers: {
    initializeCustomerPendingDetails: () => initialState,
    loadSelectedApproval: (
      state,
      { payload: ApprovalRequestDetails }: PayloadAction<CustomerApprovalDetailWithReview>
    ) => {
      state.selectedApprovals = ApprovalRequestDetails.CustomerDetail
      state.ReviewDetails = ApprovalRequestDetails.ApprovalRequestReviewList
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    setSelectedIdForPendingView: (state, { payload: Id }: PayloadAction<number|null>) => {
      state.SelectedId = Id;
    },
  },
});

export const {
  initializeCustomerPendingDetails,
  loadSelectedApproval,
  updateErrors,
  setSelectedIdForPendingView
} = slice.actions;
export default slice.reducer;
