import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { None, Option, Some } from "@hqoss/monads";
import { DeliveryChallanData, ListOfDeliveryChallan } from "../../../../../types/deliverychallan";
import { ListOfPartReturns, PartReturnList } from "../../../../../types/goodsreceivednote";

export interface PartReturnListState {
  partreturnlist: Option<readonly PartReturnList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
}

const initialState: PartReturnListState = {
  partreturnlist: None,
  currentPage: 1,
  search: "",
  totalRows: 0,
  perPage: 0
};

const slice = createSlice({
  name: 'partreturnlist',
  initialState,
  reducers: {
    initializePartReturn: () => initialState,
    loadPartReturnList: (state, { payload: { PerPage, PartReturnList, TotalRows } }: PayloadAction<ListOfPartReturns>) => {
      state.partreturnlist = Some(PartReturnList.map((partreturnlist) => partreturnlist));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.partreturnlist = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const {
  initializePartReturn,
  loadPartReturnList,
  changePage,
  setSearch
} = slice.actions;

export default slice.reducer;
