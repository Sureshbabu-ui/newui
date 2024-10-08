import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import {  ContractExpiryDetail } from '../../../../../types/contractSetting';

export interface CallExpiryExtendState {
    contractExpiryDetail: ContractExpiryDetail;
    callExpiryDate: string;
    displayInformationModal: boolean;
    errors: ValidationErrors;
}

const initialState: CallExpiryExtendState = {
    contractExpiryDetail: {
        CallExpiryDate: "",
        EndDate: "",
        AdditionalDays: 0
    },
    callExpiryDate: "",
    displayInformationModal: false,
    errors: {},
};

const slice = createSlice({
    name: 'callexpiryextend',
    initialState,
    reducers: {
        initializeCallExpiryExtend: () => initialState,
        contractExpiryDetails: (state, { payload: contractExpiryDetail }: PayloadAction<ContractExpiryDetail>) => {
            state.contractExpiryDetail = contractExpiryDetail;
        },
        updateCallExpiryField: (
            state, { payload: callExpiryDate }: PayloadAction<string>
        ) => {
            state.callExpiryDate = callExpiryDate;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
    },
});

export const {
    initializeCallExpiryExtend,
    contractExpiryDetails,
    updateCallExpiryField,
    toggleInformationModalStatus,
    updateErrors,
} = slice.actions;

export default slice.reducer;