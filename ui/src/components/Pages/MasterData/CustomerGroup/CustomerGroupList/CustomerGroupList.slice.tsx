import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerGroupDetails, CustomerGroupList } from '../../../../../types/customerGroup';

export interface CustomerGroups {
  customergroups: CustomerGroupDetails;
}

export interface CustomerGroupListState {
  customergroups: Option<readonly CustomerGroups[]>;
  currentPage: number;
  search: string;
  totalRows: number;
  createCustomerGroupModalStatus: boolean;
  perPage:number;
}

const initialState: CustomerGroupListState = {
  customergroups: None,
  currentPage: 1,
  search: "",
  totalRows: 0,
  perPage:0,
  createCustomerGroupModalStatus: false,
};

const slice = createSlice({
  name: 'customergrouplist',
  initialState,
  reducers: {
    initializeCustomerGroupList: () => initialState,
    loadCustomerGroups: (state, { payload: { CustomerGroups, TotalRows,PerPage } }: PayloadAction<CustomerGroupList>) => {
      state.customergroups = Some(CustomerGroups.map((customergroups) => ({ customergroups })));
      state.totalRows = TotalRows;
      state.perPage=PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.customergroups = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeCustomerGroupList, loadCustomerGroups, changePage, setSearch } = slice.actions;
export default slice.reducer;