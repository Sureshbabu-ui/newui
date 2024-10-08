import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { FutureUpdateEdit, FutureUpdatesMasterDataItems, SelectDetails } from '../../../../../types/futureupdates';

export interface EditFutureUpdateState {
    futureupdate: FutureUpdateEdit;
    masterentity: FutureUpdatesMasterDataItems;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditFutureUpdateState = {
    futureupdate: {
        Id: 0,
        StatusId: 0,
        SubStatusId: 0,
        ProbabilityPercentage: 0,
        TargetDate: null
    },
    masterentity: {
        ContractFutureUpdateStatus: [],
        ContractFutureUpdateSubStatus: []
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'editfutureupdate',
    initialState,
    reducers: {
        initializeFutureUpdateEdit: () => initialState,
        loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof EditFutureUpdateState['masterentity']; value: SelectDetails }>) => {
            state.masterentity[name] = Select.map((masterData) => (masterData))
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditFutureUpdateState['futureupdate']; value: any }>
        ) => {
            state.futureupdate[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        loadFutureUpdateEditDetails: (state, { payload: futureupdateDetails }: PayloadAction<FutureUpdateEdit>) => {
            state.futureupdate = futureupdateDetails
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        initializeFutureUpdate: (state) => {
            state.futureupdate = initialState.futureupdate;
        },
    },
});

export const {
    initializeFutureUpdateEdit,
    updateErrors,
    initializeFutureUpdate,
    toggleInformationModalStatus,
    updateField,
    loadFutureUpdateEditDetails,
    loadMasterData
} = slice.actions;

export default slice.reducer;