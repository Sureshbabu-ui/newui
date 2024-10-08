import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  PendingApprovalListDetail,  PendingApprovalsDetailList} from '../../../../types/pendingApproval';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../types/masterData';

export interface PendingApprovalList {
  approval: PendingApprovalListDetail; 
}

export interface ApprovalListState {
  approvalEvents: valuesInMasterDataByTableDetailsSelect[];
  selectedApprovalEvent: string|null;
  selectedApprovalEventCode: string|null;
  filteredEventCode:string|null;
  approvalRequestDetailId:number|null;
  approvals: Option<readonly PendingApprovalList[]>;
  currentPage: number;
  totalRows: number;
  perPage:number;
}

const initialState: ApprovalListState = {
  approvalEvents: [],
  selectedApprovalEvent: null,
  selectedApprovalEventCode:null,
  filteredEventCode:null,
  approvalRequestDetailId:null,
  approvals: None,
  currentPage: 1,
  totalRows: 0,
  perPage:0,
};
const slice = createSlice({
  name: 'approvalsmanagement',
  initialState,
  reducers: {
    initializeApprovalsList: () => initialState,
    loadApprovalEventNames: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.approvalEvents = MasterData.map((Event) => Event);
    },
    setApprovalEvent: (
      state,
      { payload: { approvalEvent, approvalEventCode } }: PayloadAction<{ approvalEvent: string|null; approvalEventCode: string |null}>
    ) => {
      state.selectedApprovalEvent = approvalEvent;
      state.selectedApprovalEventCode = approvalEventCode;
    },
    loadApprovals: (state, { payload: { PendingList, TotalRows, PerPage } }: PayloadAction<PendingApprovalsDetailList>) => {
      state.approvals = Some(PendingList.map((approval) => ({ approval })));
      state.totalRows = TotalRows;
      state.perPage=PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.approvals = None;
    },
    setFilteredEventCode: (state, { payload: Code }: PayloadAction<string|null>) => {
      state.filteredEventCode=Code
    },
    setApprovalRequestDetailId: (state, { payload: Id}: PayloadAction<number>) => {
      state.approvalRequestDetailId = Id;
    },
  },
});

export const { initializeApprovalsList, loadApprovals, changePage,setFilteredEventCode, setApprovalEvent, loadApprovalEventNames, setApprovalRequestDetailId } =
  slice.actions;
export default slice.reducer;
