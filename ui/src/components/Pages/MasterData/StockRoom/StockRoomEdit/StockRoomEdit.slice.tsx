import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { StockRoomDetails, StockRoomEdit } from '../../../../../types/stockroom';

export interface EditStockRoomState {
    stockroom: StockRoomEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditStockRoomState = {
    stockroom: {
        Id: 0,
        RoomName: "",
        IsActive: "",
        Description:""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'stockroomedit',
    initialState,
    reducers: {
        initializeStockRoomEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditStockRoomState['stockroom']; value: any }>
        ) => {
            state.stockroom[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        loadStockRoomDetails: (state, { payload: stockroominfo }: PayloadAction<StockRoomDetails>) => {
            state.stockroom.RoomName = stockroominfo.RoomName
            state.stockroom.Description = stockroominfo.Description
            state.stockroom.Id = stockroominfo.Id
            state.stockroom.IsActive = stockroominfo.IsActive == true ? "1" : "0"
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeStockRoomEdit,
    updateErrors,
    loadStockRoomDetails,
    toggleInformationModalStatus,
    updateField
} = slice.actions;

export default slice.reducer;