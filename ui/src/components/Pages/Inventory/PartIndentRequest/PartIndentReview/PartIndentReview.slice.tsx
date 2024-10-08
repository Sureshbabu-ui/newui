import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';


export interface SMEReview {
    Id: number;
    RequestStatus: string;
    ReviewerComments: string;
    StockTypeId: number
}


export interface PartIndentReviewState {
    smereview: SMEReview;
    displayInformationModal: boolean;
    errors: ValidationErrors;
}

const initialState: PartIndentReviewState = {
    smereview: {
        Id: 0,
        RequestStatus: '',
        ReviewerComments: '',
        StockTypeId: 0
    },
    errors: {},
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partindentreview',
    initialState,
    reducers: {
        initializePartIndentReview: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof PartIndentReviewState['smereview']; value: any; }>
        ) => {
            state.smereview[name] = value as never;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        }
    },
});

export const {
    initializePartIndentReview,
    updateField,
    toggleInformationModalStatus,
} = slice.actions;

export default slice.reducer;