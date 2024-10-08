import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessEventDetails, BusinessEventList } from '../../../../../types/businessEvent';

export interface businessEventList {
  businessevent: BusinessEventDetails;
}

export interface BusinessEventListState {
  businessevents: Option<readonly businessEventList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage:number;
  createBusinessEventModalStatus: boolean;
}

const initialState: BusinessEventListState = {
  businessevents: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage:0,
  createBusinessEventModalStatus: false,
  };
const slice = createSlice({
  name: 'businesseventlist',
  initialState,
  reducers: {
    initializeBusinessEventList: () => initialState,
    loadBusinessEvents: (state, { payload: { BusinessEvent, TotalRows, PerPage } }: PayloadAction<BusinessEventList>) => {
      state.businessevents = Some(BusinessEvent.map((businessevent) => ({ businessevent})));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.businessevents = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeBusinessEventList,loadBusinessEvents, changePage, setSearch } = slice.actions;
export default slice.reducer;