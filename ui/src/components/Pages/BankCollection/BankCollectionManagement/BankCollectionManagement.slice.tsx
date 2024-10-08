import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankCollectionDashboardDetail, BankCollectionList, BankCollectionListDetail } from '../../../../types/bankCollection';

export interface BankCollectionManagementState {
  bankCollectionDashboardDetail: BankCollectionDashboardDetail,
}

const initialState: BankCollectionManagementState = {
  bankCollectionDashboardDetail: {
    PendingCollectionAmount: 0,
    PendingCollectionCount: 0,
    MappedCollectionAmount: null,
    MappedCollectionCount: null,
   IgnoredCollectionAmount:null,
   IgnoredCollectionCount:null
  },
};
const slice = createSlice({
  name: 'bankcollectionmanagement',
  initialState,
  reducers: {
    initializeBankCollectionsList: () => initialState,
    loadCollectionDashboardDetail: (state, { payload: collectionDetail }: PayloadAction<BankCollectionDashboardDetail>) => {
      state.bankCollectionDashboardDetail = collectionDetail;
    },
  },
});
export const { initializeBankCollectionsList, loadCollectionDashboardDetail } = slice.actions;
export default slice.reducer;