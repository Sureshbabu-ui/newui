import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessModuleDetails, BusinessModuleList } from '../../../../../types/businessModule';

export interface businessModuleList {
  businessmodule: BusinessModuleDetails;
}

export interface BusinessModuleListState {
  businessmodules: Option<readonly businessModuleList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage:number;
  createBusinessModuleModalStatus: boolean;
}

const initialState: BusinessModuleListState = {  
  businessmodules: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage:0,
  createBusinessModuleModalStatus: false,
  };
const slice = createSlice({
  name: 'businessmodulelist',
  initialState,
  reducers: {
    initializeBusinessModuleList: () => initialState,
    loadBusinessModules: (state, { payload: { BusinessModule, TotalRows, PerPage } }: PayloadAction<BusinessModuleList>) => {
      state.businessmodules = Some(BusinessModule.map((businessmodule) => ({ businessmodule})));
      state.totalRows = TotalRows;
      state.perPage=PerPage;
    },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.businessmodules = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeBusinessModuleList,loadBusinessModules, changePage, setSearch } = slice.actions;
export default slice.reducer;