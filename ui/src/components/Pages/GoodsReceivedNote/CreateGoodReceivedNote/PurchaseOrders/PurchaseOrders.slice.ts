import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocationWisePurchaseOrdersList, PurchaseOrdersList } from "../../../../../types/purchaseorder";
import { None, Option, Some } from "@hqoss/monads";

export interface CreateGoodsReceivedNoteState {
  polist: Option<readonly PurchaseOrdersList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
}

const initialState: CreateGoodsReceivedNoteState = {
  polist: None,
  currentPage: 1,
  search: "",
  totalRows: 0,
  perPage: 0
};

const slice = createSlice({
  name: 'purchaseorders',
  initialState,
  reducers: {
    initializePO: () => initialState,
    loadPurchaseOrders: (state, { payload: { PerPage, PurchaseOrders, TotalRows } }: PayloadAction<LocationWisePurchaseOrdersList>) => {
      state.polist = Some(PurchaseOrders.map((polist) => polist));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.polist = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const {
  initializePO,
  loadPurchaseOrders,
  changePage,
  setSearch
} = slice.actions;

export default slice.reducer;
