import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { ApprovalWorkflowCreate } from '../../../../types/approvalWorkflow';

export interface CreateApprovalWorkflowState {
    approvalWorkflow: ApprovalWorkflowCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateApprovalWorkflowState = {
    approvalWorkflow: {
        Name: "",
        Description: ""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'approvalworkflowcreate',
    initialState,
    reducers: {
        initializeApprovalWorkflowCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateApprovalWorkflowState['approvalWorkflow']; value: any }>
        ) => {
            state.approvalWorkflow[name] = value as never;
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
        }
    },
});

export const {
    initializeApprovalWorkflowCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;