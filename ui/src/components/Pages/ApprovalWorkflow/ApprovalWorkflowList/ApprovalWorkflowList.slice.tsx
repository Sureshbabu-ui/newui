import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApprovalWorkflowList, ApprovalWorkflowListDetail } from '../../../../types/approvalWorkflow';

export interface ApprovalWorkflows {
  approvalWorkflow: ApprovalWorkflowListDetail;
}

export interface ApprovalWorkflowsListState {
  approvalWorkflows: Option<readonly ApprovalWorkflows[]>;
  search: any;
  totalRows: number;
}

const initialState: ApprovalWorkflowsListState = {
  approvalWorkflows: None,
  search: null,
  totalRows: 0,
};
const slice = createSlice({
  name: 'approvalworkflowlist',
  initialState,
  reducers: {
    initializeApprovalWorkflowList: () => initialState,
    loadApprovalWorkflows: (state, { payload: { ApprovalWorkflows, TotalRows } }: PayloadAction<ApprovalWorkflowList>) => {
      state.approvalWorkflows = Some(ApprovalWorkflows.map((approvalWorkflow) => ({ approvalWorkflow })));
      state.totalRows = TotalRows;
    },

    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeApprovalWorkflowList,  loadApprovalWorkflows,setSearch } = slice.actions;
export default slice.reducer;