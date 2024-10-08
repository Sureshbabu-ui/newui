import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultipleVendorBankAccountDetails, VendorBankAccountList } from '../../../../../types/vendorBankAccount';

export interface VendorBankAccount {
  vendorBankAccount: VendorBankAccountList;
}

export interface VendorBankAccountListState {
  vendorBankAccounts: Option<readonly VendorBankAccount[]>;
  currentPage: number;
  totalRows: number;
  perPage: number;
  createVendorModalStatus: boolean;
}

const initialState: VendorBankAccountListState = {
  vendorBankAccounts: None,
  currentPage: 1,
  totalRows: 0,
  perPage: 0,
  createVendorModalStatus: false,
};
const slice = createSlice({
  name: 'vendorbankaccountlist',
  initialState,
  reducers: {
    initializeVendorBankAccountList: () => initialState,
    loadVendorBankAccounts: (state, { payload: { VendorBankAccounts, TotalRows, PerPage } }: PayloadAction<MultipleVendorBankAccountDetails>) => {
      state.vendorBankAccounts = Some(VendorBankAccounts.map((vendorBankAccount) => ({ vendorBankAccount })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.vendorBankAccounts = None;
    }
  },
});

export const { initializeVendorBankAccountList, loadVendorBankAccounts, changePage } = slice.actions;
export default slice.reducer;