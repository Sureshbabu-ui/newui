import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { ApproverEdit, Select, SelectDetails } from '../../../../../../types/contractApproverSetting';

interface ApproverSelectDetails {
    TenantOffice: Select[],
    Approvers: Select[]
}

export interface EditApproverState {
    approverDetails: ApproverEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    approverSelectDetails: ApproverSelectDetails
}

const initialState: EditApproverState = {
    approverDetails: {
        ApprovalFlowId: 0,
        FirstApproverId: 0,
        SecondApproverId: 0,
        TenantOfficeId: 0,
        RenewalFirstApproverId:0,
        RenewalSecondApproverId:0
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
    name: 'contractapproveredit',
    initialState,
    reducers: {
        initializeApproverEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditApproverState['approverDetails']; value: number }>
        ) => {
            state.approverDetails[name] = value as never;
        },
        loadApproverSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof EditApproverState['approverSelectDetails']; value: SelectDetails }>) => {
            state.approverSelectDetails[name] = Select.map((approverSelectDetails) => (approverSelectDetails))
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        loadApproverEditDetails: (state, { payload: approverDetails }: PayloadAction<ApproverEdit>) => {
            state.approverDetails = approverDetails
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeApproverEdit,
    updateErrors,
    loadApproverSelectDetails,
    toggleInformationModalStatus,
    updateField,
    loadApproverEditDetails
} = slice.actions;

export default slice.reducer;