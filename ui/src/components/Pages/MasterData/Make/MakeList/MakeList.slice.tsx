import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MakeDetails, MakeList } from '../../../../../types/make';

export interface Makes {
  make: MakeDetails;
}

export interface MakeListState {
  makes: Option<readonly Makes[]>;
  currentPage: number;
  search: string;
  totalRows: number;
  perPage:number;
  createMakeModalStatus: boolean;
}

const initialState: MakeListState = {
  makes: None,
  currentPage: 1,
  search: "",
  totalRows: 0,
  perPage:0,
  createMakeModalStatus: false,
};

const slice = createSlice({
  name: 'makelist',
  initialState,
  reducers: {
    initializeMakeList: () => initialState,
    loadMakes: (state, { payload: { Makes, TotalRows, PerPage } }: PayloadAction<MakeList>) => {
      state.makes = Some(Makes.map((make) => ({ make })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.makes = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeMakeList, loadMakes, changePage, setSearch } = slice.actions;
export default slice.reducer;