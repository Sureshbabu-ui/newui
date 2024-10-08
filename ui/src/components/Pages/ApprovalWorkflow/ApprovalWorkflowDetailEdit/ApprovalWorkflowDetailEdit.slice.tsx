import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApprovalWorkflowDetailEdit } from '../../../../types/approvalWorkflowDetail';
import { ValidationErrors } from '../../../../types/error';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../types/masterData';

export interface Configurations {
    Users: valuesInMasterDataByTableDetailsSelect[],
    Roles: valuesInMasterDataByTableDetailsSelect[]
}
export interface EditApprovalWorkFlowState {
    approvalWorkflow: ApprovalWorkflowDetailEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    masterDataList: Configurations;
}

const initialState: EditApprovalWorkFlowState = {
    approvalWorkflow: {
        Id:null,
        ApproverRoleId: null,
        ApproverUserId: null,
        IsActive: true,
        Sequence: null,
        ApproverType:'role',
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
    name: 'approvalworkflowdetailedit',
    initialState,
    reducers: {
        initializeApprovalWorkFlowEdit: () => initialState,
        clearWorkflowDetail:(state)=>{
          state.approvalWorkflow.ApproverUserId=null;
          state.approvalWorkflow.ApproverRoleId=null;
          state.approvalWorkflow.Sequence=null;
          state.approvalWorkflow.IsActive=true;
          state.approvalWorkflow.ApproverType='role';
          state.errors={}
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditApprovalWorkFlowState['approvalWorkflow']; value: any }>
        ) => {
            if(name== "ApproverType" && state.approvalWorkflow.ApproverType !== value)
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
        loadMasterData: (state, { payload: { name, value: { MasterData } } }: PayloadAction<{ name: keyof EditApprovalWorkFlowState['masterDataList']; value: valuesInMasterDataByTableSelect }>) => {
            state.masterDataList[name] = MasterData.map((masterData) => (masterData)).sort((item1, item2) => item1.value - item2.value)
        },
        loadWorkflowDetailsForEdit: (state,{ payload:  Detail }: PayloadAction<ApprovalWorkflowDetailEdit>) => {
            state.approvalWorkflow = Detail
            state.approvalWorkflow.ApproverType =Detail.ApproverRoleId?'role':'user'
        },
    },
});

export const {
    initializeApprovalWorkFlowEdit,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadWorkflowDetailsForEdit,
    loadMasterData,
    clearWorkflowDetail
} = slice.actions;

export default slice.reducer;