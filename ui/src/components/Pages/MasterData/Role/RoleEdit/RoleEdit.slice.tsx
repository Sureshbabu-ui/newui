import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { RoleEdit } from '../../../../../types/role';

export interface EditRoleState {
    role: RoleEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditRoleState = {
    role: {
        RoleId: null,
        Name: "",
        IsActive: false
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'roleedit',
    initialState,
    reducers: {
        initializeRoleEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditRoleState['role']; value: string }>
        ) => {
            state.role[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        loadRoleEditDetails: (state, { payload: roleDetails }: PayloadAction<RoleEdit>) => {
            state.role = roleDetails
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeRoleEdit,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    loadRoleEditDetails
} = slice.actions;

export default slice.reducer;