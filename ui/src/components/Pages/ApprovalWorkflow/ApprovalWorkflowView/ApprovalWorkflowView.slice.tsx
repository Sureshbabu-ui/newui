import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApprovalWorkflowView, ApprovalWorkflowViewDetail } from '../../../../types/approvalWorkflowDetail';
import { ApprovalWorkflowListDetail } from '../../../../types/approvalWorkflow';

export interface ApprovalWorkflows {
  approvalWorkflowDetails: ApprovalWorkflowViewDetail;
}

export interface ApprovalWorkflowsListState {
  approvalWorkflowDetails: Option<readonly ApprovalWorkflows[]>;
  approvalWorkflow:ApprovalWorkflowListDetail
  search: any;
  totalRows: number;
  LastSequence:number
}

const initialState: ApprovalWorkflowsListState = {
  approvalWorkflowDetails: None,
  approvalWorkflow:{
    Id:null,
    Name:null,
    Description:null,
    SequenceCount:null,
    IsActive:false,
    CreatedOn:null
  },
  search: null,
  totalRows: 0,
  LastSequence:0
};
const slice = createSlice({
  name: 'approvalworkflowview',
  initialState,
  reducers: {
    initializeApprovalWorkflowView: () => initialState,
    loadApprovalWorkflowDetails: (state, { payload: { ApprovalWorkflowDetails,ApprovalWorkflow, TotalRows} }: PayloadAction<ApprovalWorkflowView>) => {
      state.approvalWorkflowDetails= Some(ApprovalWorkflowDetails.map((approvalWorkflowDetails) => ({ approvalWorkflowDetails })));
      state.approvalWorkflow=ApprovalWorkflow;
      state.totalRows = TotalRows;
      if(state.approvalWorkflowDetails.unwrap().length>0)
      state.LastSequence= state.approvalWorkflowDetails?.unwrap()[TotalRows-1].approvalWorkflowDetails?.Sequence??0
    },

    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeApprovalWorkflowView,  loadApprovalWorkflowDetails, setSearch } = slice.actions;
export default slice.reducer;