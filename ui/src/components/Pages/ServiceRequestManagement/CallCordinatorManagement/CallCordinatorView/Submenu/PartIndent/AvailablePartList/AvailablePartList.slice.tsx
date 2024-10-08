import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartIndentCartDetails, PartIndentCartList } from '../../../../../../../../types/partIndent';

export interface Part {
  part: PartIndentCartDetails; 
}

export interface PartListState {
  parts: Option< Part[]>;
  currentPage: number;
  search: string;
  searchWith: any;
  totalRows: number;
  perPage:number;
  createPartModalStatus: boolean;
  partCategoryId: number;
  partSubCategoryId: number;
}

const initialState: PartListState = {
  parts: None,
  currentPage: 1,
  search: "",
  searchWith: "PartCode",
  totalRows: 0,
  perPage:0,
  createPartModalStatus: false,
  partCategoryId:0,
  partSubCategoryId:0
};

const slice = createSlice({
  name: 'availablepartlist',
  initialState,
  reducers: {
    initializePartList: () => initialState,
    loadParts: (state, { payload: { Parts, TotalRows,PerPage } }: PayloadAction<PartIndentCartList>) => {
      state.parts = Some(Parts.map((part) => ({ part})));
      state.parts.map(part=>part.map(part=>part.part.Quantity=0))
      state.totalRows = TotalRows;
      state.perPage=PerPage;
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
    },

    setPartCategories: (state, { payload: Search }: PayloadAction<number>) => {
      state.partCategoryId = Search;     
      state.currentPage = 1;
    },

    setPartSubCategories: (state, { payload: Search }: PayloadAction<number>) => {
      state.partSubCategoryId = Search;     
      state.currentPage = 1;
    }
  },
});

export const { initializePartList, setPartSubCategories,loadParts,setPartCategories, changePage, setSearch, setFilter } = slice.actions;
export default slice.reducer;