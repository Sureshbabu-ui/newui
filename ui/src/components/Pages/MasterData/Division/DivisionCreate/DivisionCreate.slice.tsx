import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { DivisionCreate } from '../../../../../types/division';

export interface CreateDivisionState {
    division: DivisionCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateDivisionState = {
    division: {
        Code: "",
        Name: "",
        IsActive: "true"
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'divisioncreate',
    initialState,
    reducers: {
        initializeDivisionCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateDivisionState['division']; value: string }>
        ) => {
            state.division[name] = value;
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
    initializeDivisionCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;