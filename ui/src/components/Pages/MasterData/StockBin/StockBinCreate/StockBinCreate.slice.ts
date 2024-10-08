import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { RoleCreate } from '../../../../../types/role';
import { StockBinCreate } from '../../../../../types/stockbin';

export interface CreateStockBinState {
    stockbin: StockBinCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateStockBinState = {
    stockbin: {
        BinCode: null,
        BinName: "",
        IsActive: 1
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'stockbincreate',
    initialState,
    reducers: {
        initializeStockBinCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateStockBinState['stockbin']; value: any }>
        ) => {
            state.stockbin[name] = value as never;
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
    },
});

export const {
    initializeStockBinCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;