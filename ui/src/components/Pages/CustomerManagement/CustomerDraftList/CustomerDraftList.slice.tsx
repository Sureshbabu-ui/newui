import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerDraftList, SelectedCustomerDraft } from '../../../../types/customerdraft';

export interface DraftList {
  customer: SelectedCustomerDraft;
}

export interface CustomerListState {
  customerdraft: Option<readonly DraftList[]>;
  currentPage: number;
  totalRows: number;
  perPage:number;
}

const initialState: CustomerListState = {
  customerdraft: None,
  currentPage: 1,
  totalRows: 0,
  perPage:0,
};
const slice = createSlice({
  name: 'customersdraft',
  initialState,
  reducers: {
    initializeDraftList: () => initialState,
    loadDraftCustomers: (state, { payload: { CustomerDrafts, TotalRows, PerPage } }: PayloadAction<CustomerDraftList>) => {
      state.customerdraft = Some(CustomerDrafts.map((customer) => ({ customer })));
      state.totalRows = TotalRows;
      state.perPage=PerPage
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.customerdraft = None;
    },
  },
});

export const {
  initializeDraftList,
  loadDraftCustomers,
  changePage,
} = slice.actions;
export default slice.reducer;