import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { ContractCloseDetail } from '../../../../../types/contractSetting';

export interface ContractCloseState {
    contractCloseDetail: ContractCloseDetail,
    isSafeToClose:boolean,
    displayInformationModal: boolean;
    errors: ValidationErrors;
    submitting: boolean;
    isCloseModalEnabled: boolean;
}

const initialState: ContractCloseState = {
    displayInformationModal: false,
    isSafeToClose:false,
    contractCloseDetail: {
        TotalCollection: null,
        TotalInvoiceAmount: null,
        TotalOpenServiceRequest: null,
        PendingBankGuarantee: null,
        EndDate:null
    },
    errors: {},
    submitting: false,
    isCloseModalEnabled: false
};

const slice = createSlice({
    name: 'contractclose',
    initialState,
    reducers: {
        initializeContractClose: () => initialState,
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        loadContractCloseDetail: (state, { payload: closeDetail}: PayloadAction<ContractCloseDetail>) => {
            state.contractCloseDetail= closeDetail;
        },
        setSafeToClose: (state, { payload: safeFlag}: PayloadAction<boolean>) => {
            state.isSafeToClose= safeFlag;
        },
         startSubmitting: (state) => {
            state.submitting = true;
        },
        stopSubmitting: (state) => {
            state.submitting = false;
        },
        toggleCloseModal: (state) => {
            state.isCloseModalEnabled = !state.isCloseModalEnabled;
        },
    }, 
});

export const {
    initializeContractClose,
    toggleInformationModalStatus,
    updateErrors,
    loadContractCloseDetail,
    startSubmitting,
    setSafeToClose,
    stopSubmitting,
    toggleCloseModal
} = slice.actions;

export default slice.reducer;