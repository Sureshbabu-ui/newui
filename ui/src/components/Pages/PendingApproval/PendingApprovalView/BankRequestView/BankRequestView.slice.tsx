import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { ApprovalRequestDetailWithReview, ApprovalRequestReviewListDetail, SelectedPendingApprovalDetail } from '../../../../../types/pendingApproval';

export interface BankApprovalListState {
    selectedApprovals: SelectedPendingApprovalDetail,
    ReviewList: ApprovalRequestReviewListDetail[]
    ReviewStatus: string;
    approveModalStatus: boolean;
    rejectModalStatus: boolean;
    errors: ValidationErrors;
}

const initialState: BankApprovalListState = {
    selectedApprovals: {
        ApprovalRequestId: 0,
        ApprovalRequestDetailId:0,
        CaseId: 0,
        TableName: '',
        FetchTime: '',
        Content: '',
        ReviewStatus: '',
        ReviewStatusName:'',
        CreatedBy: 0,
        CreatedOn: '',
        CreatedUserName: '',
    },
    ReviewList: [],
    ReviewStatus: '',
    approveModalStatus: false,
    rejectModalStatus: false,
    errors: {}
};

const slice = createSlice({
    name: 'bankrequestview',
    initialState,
    reducers: {
        initializeBankRequestDetails: () => initialState,
        loadSelectedApproval: (
            state,
            { payload: ApprovalRequestDetails }: PayloadAction<ApprovalRequestDetailWithReview>
        ) => {
            state.selectedApprovals = ApprovalRequestDetails.ApprovalRequestDetail
            state.ReviewList =ApprovalRequestDetails.ApprovalRequestReviewList
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
        },
    },
});

export const {
    initializeBankRequestDetails,
    loadSelectedApproval,
    updateErrors,
    toggleApproveModalStatus,
    toggleRejectModalStatus,
    updateReviewStatus,
} = slice.actions;
export default slice.reducer;
