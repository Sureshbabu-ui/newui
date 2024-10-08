import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { ApproverCreate, SelectDetails, Select } from '../../../../../../types/contractApproverSetting';

interface ApproverSelectDetails {
    TenantOffice: Select[],
    Approvers: Select[]
}
export interface CreateApproverState {
    approverDetails: ApproverCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    approverSelectDetails: ApproverSelectDetails
}

const initialState: CreateApproverState = {
    approverDetails: {
        FirstApproverId: 0,
        SecondApproverId: 0,
        TenantOfficeId: 0,
        RenewalFirstApproverId: 0,
        RenewalSecondApproverId: 0
    },
    approverSelectDetails: {
        TenantOffice: [],
        Approvers: []
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'contractapprovercreate',
    initialState,
    reducers: {
        initializeApproverCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateApproverState['approverDetails']; value: number }>
        ) => {
            state.approverDetails[name] = value as never;
        },
        loadApproverSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateApproverState['approverSelectDetails']; value: SelectDetails }>) => {
            state.approverSelectDetails[name] = Select.map((approverSelectDetails) => (approverSelectDetails))
        },
        loadApproverCreateDetails: (state) => {
            state.approverDetails = initialState.approverDetails
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
    initializeApproverCreate,
    loadApproverSelectDetails,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadApproverCreateDetails
} = slice.actions;

export default slice.reducer;