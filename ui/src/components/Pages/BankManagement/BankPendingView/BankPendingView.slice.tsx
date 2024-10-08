import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApprovalRequestReviewListDetail } from '../../../../types/pendingApproval';
import { ValidationErrors } from '../../../../types/error';
import { BankPendingDetail, BankPendingDetailWithReview } from '../../../../types/bankManagement';

export interface BankApprovalListState {
    BankDetail: BankPendingDetail,
    ApprovalRequestId:number|null;
    ReviewList: ApprovalRequestReviewListDetail[]
    ReviewStatus: string;
    displayInformationModal: boolean;
    errors: ValidationErrors;
}

const initialState: BankApprovalListState = {
    ApprovalRequestId:null,
    BankDetail: {
        ApprovalRequestId: 0,
        ApprovalRequestDetailId:0,
        CaseId: 0,
        TableName: '',
        BankCode: null,
        BankName: null,
        ReviewStatus: '',
        ReviewStatusName:'',
        CreatedBy: 0,
        CreatedOn: '',
        CreatedUserName: '',
    },
    ReviewList: [],
    ReviewStatus: '',
    displayInformationModal:false,
    errors: {}
};

const slice = createSlice({
    name: 'bankpendingview',
    initialState,
    reducers: {
        initializeBankRequestDetails: () => initialState,
        loadSelectedPendingBankDetail: (
            state,
            { payload: BankPendingResult}: PayloadAction<BankPendingDetailWithReview>
        ) => {
            state.BankDetail = BankPendingResult.BankPendingDetail
            state.ReviewList =BankPendingResult.ApprovalRequestReviewList
        },

        toggleModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        updateReviewStatus: (state, { payload: status }: PayloadAction<string>) => {
            state.ReviewStatus = status;
        },
        updateBankPendingViewApprovalRequestId: (state, { payload: Id }: PayloadAction<number|null>) => {
            state.ApprovalRequestId= Id;
        },
    },
});

export const {
    initializeBankRequestDetails,
    loadSelectedPendingBankDetail,
    updateErrors,
    toggleModalStatus,
    updateReviewStatus,
    updateBankPendingViewApprovalRequestId
} = slice.actions;
export default slice.reducer;
