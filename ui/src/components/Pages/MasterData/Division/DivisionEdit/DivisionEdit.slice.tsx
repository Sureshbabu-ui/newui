import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { DivisionEdit } from '../../../../../types/division';

export interface EditDivisionState {
    division: DivisionEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditDivisionState = {
    division: {
        Id:0,
        Name: "",
        IsActive:""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'divisionedit',
    initialState,
    reducers: {
        initializeDivisionEdit: () => initialState,
        updateField: (state,{ payload: { name, value } }: PayloadAction<{ name: keyof EditDivisionState['division']; value: any }>) => {
            state.division[name] = value as never;
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
        loadDivisionDetails: (state, { payload: { Id, Name,IsActive } }: PayloadAction<DivisionEdit>) => {
            state.division.Id = Id;
            state.division.Name = Name;
            state.division.IsActive = IsActive;
        },
    },
});

export const {
    initializeDivisionEdit,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadDivisionDetails
} = slice.actions;

export default slice.reducer;