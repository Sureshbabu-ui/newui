import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractManpowerSummaryList, ManpowerSummaryList } from '../../../../../types/manpower';

export interface SummaryList {
  manpowersummary: ManpowerSummaryList;
}

export interface ManpowerSummaryListState {
  manpowersummary: Option<readonly SummaryList[]>;
  CurrentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
  createEmployeeModalStatus: boolean;
  visibleModal: string
}

const initialState: ManpowerSummaryListState = {
  manpowersummary: None,
  CurrentPage: 1,
  search: null,
  totalRows: 0,
  perPage: 0,
  visibleModal: "",
  createEmployeeModalStatus: false,
};
const slice = createSlice({
  name: 'manpowermanagement',
  initialState,
  reducers: {
    initializeManPowersList: () => initialState,
    loadManPower: (state, { payload: { ContractManPowerSummaryList, TotalRows, PerPage } }: PayloadAction<ContractManpowerSummaryList>) => {
      state.manpowersummary = Some(ContractManPowerSummaryList.map((manpowersummary) => ({ manpowersummary })));
      state.totalRows = TotalRows;
      state.perPage = PerPage
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.CurrentPage = page;
      state.manpowersummary = None;
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

export const { initializeManPowersList, setVisibleModal, loadManPower, changePage, setSearch } = slice.actions;
export default slice.reducer;