import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedPendingApprovalDetail,  } from '../../../../types/pendingApproval';

export interface ApprovalListState {
  selectedApprovals: SelectedPendingApprovalDetail
}

const initialState: ApprovalListState = {
  selectedApprovals: {
    ApprovalRequestId: 0,
    ApprovalRequestDetailId:0,
    CaseId: 0,
    TableName: '',
    FetchTime: '',
    Content: '',
    ReviewStatus: '',
    ReviewStatusName:'',
    CreatedBy: 0,
    CreatedOn: '',
    CreatedUserName: '',
  },
};
const slice = createSlice({
  name: 'approvarequestdetails',
  initialState,
  reducers: {
    initializeRequestDetails: () => initialState,
    loadSelectedApproval: (    state,  { payload: Detail }: PayloadAction<SelectedPendingApprovalDetail>) => {
      state.selectedApprovals = Detail
    },
  },
});

export const { initializeRequestDetails, loadSelectedApproval } = slice.actions;
export default slice.reducer;
