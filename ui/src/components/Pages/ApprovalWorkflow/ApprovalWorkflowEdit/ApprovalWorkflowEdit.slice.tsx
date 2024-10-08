import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { ApprovalWorkflowEdit} from '../../../../types/approvalWorkflow';

export interface EditApprovalWorkflowState {
    selectedWorkflow: ApprovalWorkflowEdit
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditApprovalWorkflowState = {
    selectedWorkflow: {
        Id: 0,
        Name:null,
        Description:null,
        IsActive:null
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'approvalworkflowedit',
    initialState,
    reducers: {
        initializeApprovalWorkflowEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditApprovalWorkflowState['selectedWorkflow']; value: any }>
        ) => {
            state.selectedWorkflow[name] = value as never;
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
        loadWorkflowDetailsForEdit: (state,{ payload:  Detail }: PayloadAction<ApprovalWorkflowEdit>) => {
            state.selectedWorkflow = Detail
        },
    },
});

export const {
    initializeApprovalWorkflowEdit,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadWorkflowDetailsForEdit,
} = slice.actions;

export default slice.reducer;