import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  MultipleTenantDetails, TenantList, TenentForCreation } from '../../../../types/tenant';

export interface TenantsList {
  tenant:TenantList ;
}

export interface TenantListState {
  tenants: Option<readonly TenantsList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage:number;
  createTenantModalStatus: boolean;
}

const initialState: TenantListState = {
 tenants: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage:0,
  createTenantModalStatus: false,
};
const slice = createSlice({
  name: 'tenantlist',
  initialState,
  reducers: {
    initializeTenantsList: () => initialState,
    loadTenants: (state, { payload: { Tenants,TotalRows,PerPage } }: PayloadAction<MultipleTenantDetails>) => {
      state.tenants = Some(Tenants.map((tenant) => ({ tenant })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.tenants = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
      state.currentPage = 1;
    },
  },
});

export const { initializeTenantsList, loadTenants, changePage, setSearch } = slice.actions;
export default slice.reducer;