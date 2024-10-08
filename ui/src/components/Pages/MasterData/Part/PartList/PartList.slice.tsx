import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartDetails, PartList } from '../../../../../types/part';

export interface Part {
  part: PartDetails;
}

export interface PartListState {
  parts: Option<readonly Part[]>;
  currentPage: number;
  search: string;
  searchWith: any;
  totalRows: number;
  perPage:number;
  createPartModalStatus: boolean;
}

const initialState: PartListState = {
  parts: None,
  currentPage: 1,
  search: "",
  searchWith: "",
  totalRows: 0,
  perPage:0,
  createPartModalStatus: false,
};

const slice = createSlice({
  name: 'partlist',
  initialState,
  reducers: {
    initializePartList: () => initialState,
    loadParts: (state, { payload: { Parts, TotalRows, PerPage } }: PayloadAction<PartList>) => {
      state.parts = Some(Parts.map((part) => ({ part })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.parts = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
    setFilter: (state, { payload: Search }: PayloadAction<any>) => {
      state.searchWith = Search.value;
      state.currentPage = 1;
    }
  },
});

export const { initializePartList, loadParts, changePage, setSearch, setFilter } = slice.actions;
export default slice.reducer;