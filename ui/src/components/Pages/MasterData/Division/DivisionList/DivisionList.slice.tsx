import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DivisionList,DivisionDetails } from '../../../../../types/division';

export interface divisionList {
  division: DivisionDetails;
}

export interface DivisionListState {
  divisions: Option<readonly divisionList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage:number;
  createDivisionModalStatus: boolean;
}

const initialState: DivisionListState = {  
  divisions: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage:0,
  createDivisionModalStatus: false,
  };
const slice = createSlice({
  name: 'divisionlist',
  initialState,
  reducers: {
    initializeDivisionList: () => initialState,
    loadDivisions: (state, { payload: { Divisions, TotalRows, PerPage } }: PayloadAction<DivisionList>) => {
      state.divisions = Some(Divisions.map((division) => ({ division})));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.divisions = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeDivisionList,loadDivisions, changePage, setSearch } = slice.actions;
export default slice.reducer;


