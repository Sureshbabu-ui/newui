import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../../../../types/error";
import { FutureUpdatesCreate, FutureUpdatesMasterDataItems, SelectDetails } from "../../../../../types/futureupdates";

export interface CreateFutureUpdateState {
    futureupdate: FutureUpdatesCreate;
    masterentity: FutureUpdatesMasterDataItems;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}
const initialState: CreateFutureUpdateState = {
    futureupdate: {
        ContractId: null,
        RenewedMergedContractNumber: "",
        StatusId: null,
        SubStatusId: null,
        ProbabilityPercentage: null,
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
    name: 'futureupdatecreate',
    initialState,
    reducers: {
        initializeFutureUpdateCreate: () => initialState,
        loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateFutureUpdateState['masterentity']; value: SelectDetails }>) => {
            state.masterentity[name] = Select.map((masterData) => (masterData))
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateFutureUpdateState['futureupdate']; value: string }>
        ) => {
            state.futureupdate[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        startSubmitting: (state) => {
            state.submitting = true;
        },
        stopSubmitting: (state) => {
            state.submitting = false;
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
    initializeFutureUpdateCreate,
    updateErrors,
    initializeFutureUpdate,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadMasterData
} = slice.actions;

export default slice.reducer;