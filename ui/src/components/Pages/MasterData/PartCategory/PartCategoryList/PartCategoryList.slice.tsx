import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartCategoryDetails, PartCategoryList } from '../../../../../types/partCategory';

export interface PartCategories {
  partCategory: PartCategoryDetails;
}

export interface PartCategoryListState {
  partCategories: Option<readonly PartCategories[]>;
  currentPage: number;
  search: string;
  searchWith: string;
  totalRows: number;
  perPage:number;
  createPartCategoryModalStatus: boolean;
}

const initialState: PartCategoryListState = {
  partCategories: None,
  currentPage: 1,
  search: "",
  searchWith:"",
  totalRows: 0,
  perPage:0,
  createPartCategoryModalStatus: false,
};

const slice = createSlice({
  name: 'partcategorylist',
  initialState,
  reducers: {
    initializePartCategoryList: () => initialState,
    loadPartCategories: (state, { payload: { PartCategories, TotalRows, PerPage } }: PayloadAction<PartCategoryList>) => {
      state.partCategories = Some(PartCategories.map((partCategory) => ({ partCategory })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.partCategories = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
    setFilter: (state, { payload: Search }: PayloadAction<any>) => {
      state.searchWith = Search.value;
      state.currentPage = 1;
    },
  },
});

export const { initializePartCategoryList, loadPartCategories, setFilter ,changePage, setSearch } = slice.actions;
export default slice.reducer;