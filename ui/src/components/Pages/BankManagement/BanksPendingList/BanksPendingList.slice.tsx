import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankPendingList, BankPendingListDetail } from '../../../../types/bankApproval';

export interface PendingList {
  bank: BankPendingListDetail;
}

export interface BankListState {
  banks: Option<readonly PendingList[]>;
  currentPage: number;
  totalRows: number;
  perPage: number;
}

const initialState: BankListState = {
  banks: None,
  currentPage: 1,
  totalRows: 0,
  perPage: 0,
};
const slice = createSlice({
  name: 'bankspending',
  initialState,
  reducers: {
    initializePendingList: () => initialState,
    loadPendingBanks: (state, { payload: { PendingList, TotalRows,PerPage } }: PayloadAction<BankPendingList>) => {
      state.banks = Some(PendingList.map((bank) => ({ bank })));
      state.totalRows = TotalRows;
      state.perPage= PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {  
      state.currentPage = page;
      state.banks = None;
    },
  },
});

export const {
  initializePendingList,
  loadPendingBanks,
  changePage,
} = slice.actions;
export default slice.reducer;