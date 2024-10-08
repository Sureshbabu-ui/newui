import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { SelectedPendingApprovalDetail } from '../../../../types/pendingApproval';

export interface AprovalRequestReviewState {
  approvalReviewDetails: SelectedPendingApprovalDetail;
  ReviewComment: string;
  ReviewStatus: string;
  approveModalStatus: boolean;
  rejectModalStatus: boolean;
  requestChangeModalStatus: boolean 
  errors: ValidationErrors
}

const initialState: AprovalRequestReviewState = {
  approvalReviewDetails: {
    ApprovalRequestId: 0,
    ApprovalRequestDetailId: 0,
    CaseId: 0,
    FetchTime: '',
    TableName: '',
    Content: '',
    ReviewStatusName: '',
    ReviewStatus: '',
    CreatedBy: 0,
    CreatedOn: '',
    CreatedUserName: '',
  },
  errors: {},
  ReviewComment:'',
  ReviewStatus: '',
  approveModalStatus: false,
  rejectModalStatus: false,
  requestChangeModalStatus: false,
};
const slice = createSlice({
  name: 'approvalrequestreview',
  initialState,
  reducers: {
    initializeRequestReview: () => initialState,
    setContent: (state, { payload: Content }) => {
      state.approvalReviewDetails = Content;
    },
    setReviewComment: (state, { payload: value  }: PayloadAction<string>
    ) => {
      state.ReviewComment = value;
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
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    updateReviewStatus: (state, { payload: status }: PayloadAction<string>) => {
      state.ReviewStatus = status;
    },
  },
});

export const { initializeRequestReview,
  setContent,
  setReviewComment,
  updateErrors,
  toggleApproveModalStatus,
  toggleRejectModalStatus,
  toggleRequestChangeModalStatus,
  updateReviewStatus,
} = slice.actions;
export default slice.reducer;
