import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { StockRoomCreate } from '../../../../../types/stockroom';

export interface CreateStockRoomState {
    stockroom: StockRoomCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateStockRoomState = {
    stockroom: {
        RoomName: "",
        RoomCode: null,
        IsActive: 1,
        Description:""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'stockroomcreate',
    initialState,
    reducers: {
        initializeStockRoomCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateStockRoomState['stockroom']; value: any }>
        ) => {
            state.stockroom[name] = value as never;
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
    initializeStockRoomCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;