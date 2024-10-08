import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { DesignationUpdate } from '../../../../../types/designation';

export interface UpdateDesignationState {
    designation: DesignationUpdate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: UpdateDesignationState = {
    designation: {
        Id: 0,
        Name: "",
        IsActive: "true"
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'designationupdate',
    initialState,
    reducers: {
        initializeDesignationUpdate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof UpdateDesignationState['designation']; value: any }>
        ) => {
            state.designation[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        loadDesignationDetails: (state, { payload: { Id, Name, IsActive } }: PayloadAction<DesignationUpdate>) => {
            state.designation.Id = Id;
            state.designation.Name = Name;
            state.designation.IsActive = IsActive;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeDesignationUpdate,
    updateErrors,
    loadDesignationDetails,
    toggleInformationModalStatus,
    updateField
} = slice.actions;

export default slice.reducer;