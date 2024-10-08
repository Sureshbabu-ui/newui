import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerSiteDetails, MultipleCustomerSiteDetails } from '../../../../types/customer';

export interface CustomerSiteList {
  customerSite: CustomerSiteDetails;
}

export interface CustomersListState {
  customerSites: Option<readonly CustomerSiteList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
  createCustomerSiteModalStatus: boolean;
  visibleModal: string
}

const initialState: CustomersListState = {
  customerSites: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage: 0,
  visibleModal: "",
  createCustomerSiteModalStatus: false,
};
const slice = createSlice({
  name: 'contractcustomersitemanagement',
  initialState,
  reducers: {
    initializeCustomerSiteList: () => initialState,
    loadCustomerSite: (state, { payload: { CustomerSiteList, TotalRows, PerPage } }: PayloadAction<MultipleCustomerSiteDetails>) => {
      state.customerSites = Some(CustomerSiteList.map((customerSite) => ({ customerSite })));
      state.totalRows = TotalRows;
      state.perPage = PerPage
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.customerSites = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
    setVisibleModal: (state, { payload: ModalName }: PayloadAction<string>) => {
      state.visibleModal = ModalName;
    },
  },
});

export const { initializeCustomerSiteList, setVisibleModal, loadCustomerSite, changePage, setSearch } = slice.actions;
export default slice.reducer;
