import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultipleVendorDetails, VendorList, VendorSearchForFilter } from '../../../../types/vendor';

export interface VendorsList {
  vendor: VendorList;
}

export interface VendorListState {
  vendors: Option<readonly VendorsList[]>;
  currentPage: number;
  totalRows: number;
  perPage: number;
  filters: VendorSearchForFilter;
  searchWith: string;
  createVendorModalStatus: boolean;
}

const initialState: VendorListState = {
  vendors: None,
  currentPage: 1,
  totalRows: 0,
  perPage: 0,
  filters: {
    SearchText: '',
  },
  searchWith: '',
  createVendorModalStatus: false,
};
const slice = createSlice({
  name: 'vendorlist',
  initialState,
  reducers: {
    initializeVendorsList: () => initialState,
    loadVendors: (state, { payload: { Vendors, TotalRows, PerPage } }: PayloadAction<MultipleVendorDetails>) => {
      state.vendors = Some(Vendors.map((vendor) => ({ vendor })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.vendors = None;
    },
    setFilter: (state, { payload: Search }: PayloadAction<any>) => {
      state.searchWith = Search.value;
      state.currentPage = 1;
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof VendorListState['filters']; value: any }>) => {
      state.filters[name] = value;
    },
  },
});

export const { initializeVendorsList, loadVendors, setFilter, changePage, updateField } = slice.actions;
export default slice.reducer;