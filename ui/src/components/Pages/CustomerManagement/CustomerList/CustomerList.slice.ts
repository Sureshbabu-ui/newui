import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerDetails, MultipleCustomerDetails } from '../../../../types/customer';

export interface CustomersList {
  customer: CustomerDetails;
}

export interface CustomersListState {
  customers: Option<readonly CustomersList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage:number;
  createCustomerModalStatus: boolean;
}

const initialState: CustomersListState = {
  customers: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage:0,
  createCustomerModalStatus: false,
};
const slice = createSlice({
  name: 'customerlist',
  initialState,
  reducers: { 
    initializeCustomersList: () => initialState,
    loadCustomers: (state, { payload: { Customers,TotalRows,PerPage } }: PayloadAction<MultipleCustomerDetails>) => {
      state.customers = Some(Customers.map((customer) => ({ customer })));
      state.totalRows = TotalRows;
      state.perPage=PerPage
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.customers = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeCustomersList, loadCustomers, changePage, setSearch } = slice.actions;
export default slice.reducer;
