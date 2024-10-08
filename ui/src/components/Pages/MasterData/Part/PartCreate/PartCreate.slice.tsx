import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import {  PartCreate } from '../../../../../types/part';

export interface CreatePartState {
    part: PartCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreatePartState = {
    part: {
        PartName: "",
        ProductCategoryId:0,
        PartCategoryId: 0,
        PartSubCategoryId:null,
        MakeId: 0,
        HsnCode: "",
        OemPartNumber: ""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partcreate',
    initialState,
    reducers: {
        initializePartCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreatePartState['part']; value: any }>
        ) => {
            state.part[name] = value;
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
    initializePartCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;