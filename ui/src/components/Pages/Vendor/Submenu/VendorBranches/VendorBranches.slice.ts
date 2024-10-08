import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultipleVendorBranchDetails, VendorBranchList, VendorSearchForFilter } from '../../../../../types/vendorBranch';

export interface VendorBranch {
  vendorBranch: VendorBranchList;
}

export interface VendorBranchListState {
  vendorBranches: Option<readonly VendorBranch[]>;
  currentPage: number;
  totalRows: number;
  perPage: number;
  search: string;
  createVendorModalStatus: boolean;
}

const initialState: VendorBranchListState = {
  vendorBranches: None,
  currentPage: 1,
  totalRows: 0,
  perPage: 0,
  search: '',
  createVendorModalStatus: false,
};
const slice = createSlice({
  name: 'vendorbranchlist',
  initialState,
  reducers: {
    initializeVendorBranchList: () => initialState,
    loadVendorBranches: (state, { payload: { VendorBranches, TotalRows, PerPage } }: PayloadAction<MultipleVendorBranchDetails>) => {
      state.vendorBranches = Some(VendorBranches.map((vendorBranch) => ({ vendorBranch })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.vendorBranches = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeVendorBranchList, loadVendorBranches, changePage, setSearch } = slice.actions;
export default slice.reducer;