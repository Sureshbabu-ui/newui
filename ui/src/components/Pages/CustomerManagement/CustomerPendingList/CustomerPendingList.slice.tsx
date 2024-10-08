import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  PendingApprovalsDetailList, PendingApprovalListDetail } from '../../../../types/pendingApproval';

export interface PendingList {
  customer: PendingApprovalListDetail;
}

export interface CustomerListState {
  customers: Option<readonly PendingList[]>;
  currentPage: number;
  totalRows: number;
  perPage: number;
}

const initialState: CustomerListState = {
  customers: None,
  currentPage: 1,
  totalRows: 0,
  perPage:0,
};
const slice = createSlice({
  name: 'customerspending',
  initialState,
  reducers: {
    initializePendingList: () => initialState,
    loadPendingCustomers: (state, { payload: { PendingList, TotalRows, PerPage } }: PayloadAction<PendingApprovalsDetailList>) => {
      state.customers = Some(PendingList.map((customer) => ({ customer })));
      state.totalRows = TotalRows;
      state.perPage = PerPage
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.customers = None;
    },
  },
});

export const {
  initializePendingList,
  loadPendingCustomers,
  changePage,
} = slice.actions;
export default slice.reducer;