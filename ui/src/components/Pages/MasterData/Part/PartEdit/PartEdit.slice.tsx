import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { PartDetailsForEdit, SelectedPartDetailsForEdit } from '../../../../../types/part';

export interface EditPartState {
    part: PartDetailsForEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditPartState = {
    part: {
        Id:0,
        PartName: "",
        PartProductCategoryId: 0,
        PartCategoryId: 0,
        PartSubCategoryId: null,
        MakeId: 0,
        HsnCode: "",
        OemPartNumber: ""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partedit',
    initialState,
    reducers: {
        initializePartEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditPartState['part']; value: any }>
        ) => {
            state.part[name] = value as never;
        },
        loadPartDetails: (state, { payload: { Partdetails } }: PayloadAction<SelectedPartDetailsForEdit>) => {
            state.part = Partdetails;            
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
    initializePartEdit,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadPartDetails
} = slice.actions;

export default slice.reducer;