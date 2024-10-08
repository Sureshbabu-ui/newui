import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApprovalWorkflowDetailCreate } from '../../../../types/approvalWorkflowDetail';
import { ValidationErrors } from '../../../../types/error';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../types/masterData';

export interface Configurations {
    Users: valuesInMasterDataByTableDetailsSelect[],
    Roles: valuesInMasterDataByTableDetailsSelect[]
}
export interface CreateApprovalWorkFlowState {
    approvalWorkflow: ApprovalWorkflowDetailCreate;

    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    masterDataList: Configurations;
}

const initialState: CreateApprovalWorkFlowState = {
    approvalWorkflow: {
        ApprovalWorkflowId: null,
        ApprovalType:'role',
        ApproverRoleId: null,
        ApproverUserId: null,
        IsActive: true,
        Sequence: null,
    },
    masterDataList: {
        Users: [],
        Roles: []
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'approvalworkflowdetailcreate',
    initialState,
    reducers: {
        initializeApprovalWorkFlowCreate: () => initialState,
        clearWorkflowDetail:(state)=>{
          state.approvalWorkflow.ApproverRoleId=null;
          state.approvalWorkflow.Sequence=null;
          state.approvalWorkflow.ApproverUserId=null;
          state.approvalWorkflow.IsActive=true;
          state.approvalWorkflow.ApprovalType='role'
          state.errors={}
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateApprovalWorkFlowState['approvalWorkflow']; value: any }>
        ) => {
            if(name== "ApprovalType")
            {
                state.approvalWorkflow.ApproverUserId=null;
                state.approvalWorkflow.ApproverRoleId=null;
            }
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
        },
        loadMasterData: (state, { payload: { name, value: { MasterData } } }: PayloadAction<{ name: keyof CreateApprovalWorkFlowState['masterDataList']; value: valuesInMasterDataByTableSelect }>) => {
            state.masterDataList[name] = MasterData.map((masterData) => (masterData)).sort((item1, item2) => item1.value - item2.value)
        },
    },
});

export const {
    initializeApprovalWorkFlowCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadMasterData,
    clearWorkflowDetail
} = slice.actions;

export default slice.reducer;