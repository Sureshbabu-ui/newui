import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessFunctionDetails, BusinessFunctionList } from '../../../../../types/businessFunction';

export interface businessFunctionList {
  businessfunction: BusinessFunctionDetails;
}

export interface BusinessFunctionListState {
  businessfunctions: Option<readonly businessFunctionList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage:number;
  createBusinessFunctionModalStatus: boolean;
}

const initialState: BusinessFunctionListState = {
  businessfunctions: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage:0,
  createBusinessFunctionModalStatus: false,
  };
const slice = createSlice({
  name: 'businessfunctionlist',
  initialState,
  reducers: {
    initializeBusinessFunctionList: () => initialState,
    loadBusinessFunctions: (state, { payload: { BusinessFunction, TotalRows, PerPage } }: PayloadAction<BusinessFunctionList>) => {
      state.businessfunctions = Some(BusinessFunction.map((businessfunction) => ({ businessfunction})));
      state.totalRows = TotalRows;
      state.perPage= PerPage;
    },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.businessfunctions = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeBusinessFunctionList,loadBusinessFunctions, changePage, setSearch } = slice.actions;
export default slice.reducer;