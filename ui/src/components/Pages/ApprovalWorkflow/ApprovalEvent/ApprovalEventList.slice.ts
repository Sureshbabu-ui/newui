import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApprovalEventListDetail, ApprovalEventList } from '../../../../types/ApprovalWorkflow/approvalEvent';

export interface ApprovalEventListState {
  approvalEvents: ApprovalEventListDetail[];
  search: any;
}

const initialState: ApprovalEventListState = {
  approvalEvents: [],
  search: null,
  };
const slice = createSlice({
  name: 'approvaleventlist',
  initialState,
  reducers: {
    initializeApprovalEventList: () => initialState,
    loadApprovalEvents: (state, { payload: { ApprovalEvents} }: PayloadAction<ApprovalEventList>) => {
      state.approvalEvents = ApprovalEvents;
    },

    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeApprovalEventList,loadApprovalEvents, setSearch } = slice.actions;
export default slice.reducer;