import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApproverDetails, MandatoryReviewedDetail } from '../../../../../../types/contractApprovalRequest';
import { ValidationErrors } from '../../../../../../types/error';

export interface ReviewDetail {
  Id: null;
  ReviewComment: string;
  UserId: null,
  CreatedOn: null,
  ReviewStatus: string,
  ReviewedBy: string
}

export interface RequestApprovalState {
  ReviewDetails: ReviewDetail;
  ContractMandatoryDetails: MandatoryReviewedDetail; 
  ApproverDetails: ApproverDetails;
  ReviewedJsonDetails: ReviewDetail[];
  ReviewStatus: string;
  ApprovalModalStatus: Boolean;
  TenantId: number;
  errors: ValidationErrors;
}

const initialState: RequestApprovalState = {
  ApproverDetails:
  {
    FirstApproverEmail: '',
    SecondApproverEmail: '',
    FirstApproverEmployeeCode:'',
    SecondApproverEmployeeCode:'',
    FirstApprover: '',
    FirstApproverId: 0,
    FirstApproverDesignation: '',
    SecondApprover: '',
    SecondApproverId: 0,
    SecondApproverDesignation: '',
    Location: ''
  },
  ReviewDetails: {
    ReviewComment: '',
    UserId: null,
    CreatedOn: null,
    Id: null,
    ReviewStatus: '',
    ReviewedBy: ''
  },
  ContractMandatoryDetails: {
    IsAssetSummary: false,
    IsContractDocuments: false,
    IsMandatoryDetails: false,
    IsManpower: false,
    IsPaymentDetails:false
  },
  ReviewedJsonDetails: [{
    ReviewComment: '',
    UserId: null,
    CreatedOn: null,
    Id: null,
    ReviewStatus: '',
    ReviewedBy: ''
  }],
  ReviewStatus: '',
  ApprovalModalStatus: false,
  TenantId: 0,
  errors: {}
};

const slice = createSlice({
  name: 'contractapprovalrequest',
  initialState,
  reducers: {
    initializeContractApproval: () => initialState,
    loadApproverDetails: (state, { payload: approverDetails }: PayloadAction<ApproverDetails>) => {
      state.ApproverDetails = approverDetails;
    },
    loadContractMandatoryDetails: (state, { payload: mandatoryReviewedDetail }: PayloadAction<MandatoryReviewedDetail>) => {
      state.ContractMandatoryDetails = mandatoryReviewedDetail;
    },
    loadReviewDetails: (state, { payload: reviewDetails }: PayloadAction<ReviewDetail[]>) => {
      state.ReviewedJsonDetails = reviewDetails;
    },
    setReviewComment: (state, { payload: comment }: PayloadAction<string>) => {
      state.ReviewDetails.ReviewComment = comment
    },
    updateReviewStatus: (state, { payload: status }: PayloadAction<string>) => {
      state.ReviewStatus = status;
      state.ReviewDetails.ReviewStatus = status
    },
    toggleApprovalModalStatus: (state) => {
      state.ApprovalModalStatus = !state.ApprovalModalStatus;
    },
    setTenantId: (state, { payload: tenantId }: PayloadAction<any>) => {
      state.TenantId = tenantId;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
  },
});

export const {
  initializeContractApproval, loadReviewDetails, loadContractMandatoryDetails, toggleApprovalModalStatus, setReviewComment, updateReviewStatus, setTenantId,
  loadApproverDetails, updateErrors } = slice.actions;

export default slice.reducer;