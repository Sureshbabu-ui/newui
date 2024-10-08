import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { StockBinDetails, StockBinEdit } from '../../../../../types/stockbin';

export interface EditStockBinState {
    stockbin: StockBinEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditStockBinState = {
    stockbin: {
        Id: 0,
        BinName: "",
        IsActive: ""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'stockbinedit',
    initialState,
    reducers: {
        initializeStockBinEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditStockBinState['stockbin']; value: any }>
        ) => {
            state.stockbin[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        loadStockBinDetails: (state, { payload: stateinfo }: PayloadAction<StockBinDetails>) => {
            state.stockbin.BinName = stateinfo.BinName
            state.stockbin.Id = stateinfo.Id
            state.stockbin.IsActive = stateinfo.IsActive == true ? "1" :"0"
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeStockBinEdit,
    updateErrors,
    loadStockBinDetails,
    toggleInformationModalStatus,
    updateField
} = slice.actions;

export default slice.reducer;