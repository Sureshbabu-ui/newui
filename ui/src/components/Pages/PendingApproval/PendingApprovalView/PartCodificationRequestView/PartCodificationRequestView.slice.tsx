import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartApprovalDetail} from '../../../../../types/pendingApproval';
import { ValidationErrors } from '../../../../../types/error';
import { PartReviewDetail } from '../../../../../types/part';

export interface PartApprovalListState {
  selectedApprovals: PartApprovalDetail,
  ReviewDetails: PartReviewDetail;
  ReviewedJsonDetails: PartReviewDetail[];
  ReviewStatus: string;
  approveModalStatus: boolean;
  rejectModalStatus: boolean;
  errors: ValidationErrors;
}

const initialState: PartApprovalListState = {
  selectedApprovals: {
    Id: 0,
    CaseId: 0,
    TableName: '',
    FetchTime: '',
    Content: '',
    ProductCategoryName:'',
    PartCategoryName:'',
    PartSubCategoryName:null,
    MakeName:'',
    ReviewedOn: '',
    ReviewStatus: '',
    ReviewComment: '',
    CreatedBy: 0,
    CreatedOn: '',
    CreatedUserName: '',
    ReviewedUserName: '',
  },
  ReviewDetails: {
    ReviewComment: '',
    ReviewedBy: null,
    CreatedOn: null,
    HsnCode:'',
    OemPartNumber:'',
    Id: null,
    UserId: null,
    ReviewStatus: ''
  },
  ReviewedJsonDetails: [{
    ReviewComment: '',
    ReviewedBy: null,
    CreatedOn: null,
    HsnCode:'',
    OemPartNumber:'',
    Id: null,
    UserId: null,
    ReviewStatus: ''
  }],
  ReviewStatus: '',
  approveModalStatus: false,
  rejectModalStatus: false,
  errors:{}
};

const slice = createSlice({
  name: 'partcodificationrequestview',
  initialState,
  reducers: {
    initializePartRequestDetails: () => initialState,
    loadSelectedApproval: (
      state,
      { payload: ApprovalRequestDetails }: PayloadAction<PartApprovalDetail>
    ) => {
      state.selectedApprovals = ApprovalRequestDetails
    },
      setReviewDetails: (state, { payload: { name, value } }: PayloadAction<{ name: keyof PartApprovalListState['ReviewDetails']; value: any }>
      ) => {
        state.ReviewDetails[name] = value as never;
      },
      loadReviewDetails: (state, { payload: reviewDetails }: PayloadAction<PartReviewDetail[]>) => {
        state.ReviewedJsonDetails = reviewDetails;
      },
      toggleApproveModalStatus: (state) => {
        state.approveModalStatus = !state.approveModalStatus;
      },
      toggleRejectModalStatus: (state) => {
        state.rejectModalStatus = !state.rejectModalStatus;
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
    initializePartRequestDetails,
     loadSelectedApproval,
     setReviewDetails,
     updateErrors,
     toggleApproveModalStatus,
     toggleRejectModalStatus,
     updateReviewStatus,
     loadReviewDetails     
    } = slice.actions;
export default slice.reducer;
