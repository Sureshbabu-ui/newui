import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { PartCategoryCreate } from '../../../../../types/partCategory';

export interface CreatePartCategoryState {
    partCategory: PartCategoryCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreatePartCategoryState = {
    partCategory: {
        Name: "",
        ProductCategoryId: ""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partcategorycreate',
    initialState,
    reducers: {
        initializePartCategoryCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreatePartCategoryState['partCategory']; value: any }>
        ) => {
            state.partCategory[name] = value;
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
    initializePartCategoryCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;