import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractManpowerAllocationList, ManpowerAllocationList } from '../../../../../types/contractmanpowerallocation';

export interface AllocationList {
  manpowerallocation: ManpowerAllocationList;
}

export interface ManpowerSummaryListState {
  manpowerallocation: Option<readonly AllocationList[]>;
  CurrentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
  createEmployeeModalStatus: boolean;
  visibleModal: string
}

const initialState: ManpowerSummaryListState = {
  manpowerallocation: None,
  CurrentPage: 1,
  search: null,
  totalRows: 0,
  perPage: 0,
  createEmployeeModalStatus: false,
  visibleModal: ""
};
const slice = createSlice({
  name: 'manpowerallocation',
  initialState,
  reducers: {
    initializeManPowerAllocationsList: () => initialState,
    loadManPowerAllocations: (state, { payload: { ManpowerAllocations, TotalRows, PerPage } }: PayloadAction<ContractManpowerAllocationList>) => {
      state.manpowerallocation = Some(ManpowerAllocations.map((manpowerallocation) => ({ manpowerallocation })));
      state.totalRows = TotalRows;
      state.perPage = PerPage
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.CurrentPage = page;
      state.manpowerallocation = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
      state.CurrentPage = 1;
    },
    setVisibleModal: (state, { payload: ModalName }: PayloadAction<string>) => {
      state.visibleModal = ModalName;
    },
  },
});

export const { initializeManPowerAllocationsList, setVisibleModal, loadManPowerAllocations, changePage, setSearch } = slice.actions;
export default slice.reducer;