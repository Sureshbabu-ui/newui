import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantBankAccountList, TenantBankAccountListDetails } from '../../../../../../types/tenantBankAccount';

export interface tenantBankAccountListDetails {
  TenantBankAccount: TenantBankAccountListDetails;
}

export interface TenantBankAccountListState {
  TenantBankAccounts: Option<readonly tenantBankAccountListDetails[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
  visibleModal: string
  createTenantBankAccountModalStatus: boolean;
}

const initialState: TenantBankAccountListState = {
  TenantBankAccounts: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage: 0,
  visibleModal: "",
  createTenantBankAccountModalStatus: false,
};
const slice = createSlice({
  name: 'tenantbankaccountlist',
  initialState,
  reducers: {
    initializeTenantBankAccountList: () => initialState,
    loadTenantBankAccounts: (state, { payload: { TenantBankAccounts, TotalRows, PerPage } }: PayloadAction<TenantBankAccountList>) => {
      state.TenantBankAccounts = Some(TenantBankAccounts.map((TenantBankAccount) => ({ TenantBankAccount })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.TenantBankAccounts = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
    setVisibleModal: (state, { payload: ModalName }: PayloadAction<string>) => {
      state.visibleModal = ModalName;
    }
  },
});

export const { initializeTenantBankAccountList, setVisibleModal, loadTenantBankAccounts, changePage, setSearch } = slice.actions;
export default slice.reducer;