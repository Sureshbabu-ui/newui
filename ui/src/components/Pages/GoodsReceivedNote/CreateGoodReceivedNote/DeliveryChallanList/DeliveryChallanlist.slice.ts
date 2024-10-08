import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocationWisePurchaseOrdersList, PurchaseOrdersList } from "../../../../../types/purchaseorder";
import { None, Option, Some } from "@hqoss/monads";
import { DeliveryChallanData, ListOfDeliveryChallan } from "../../../../../types/deliverychallan";

export interface DeliveryChallanListState {
  dclist: Option<readonly DeliveryChallanData[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
}

const initialState: DeliveryChallanListState = {
  dclist: None,
  currentPage: 1,
  search: "",
  totalRows: 0,
  perPage: 0
};

const slice = createSlice({
  name: 'deliverychallanlist',
  initialState,
  reducers: {
    initializeDC: () => initialState,
    loadDeliverychallans: (state, { payload: { PerPage, DeliveryChallanList, TotalRows } }: PayloadAction<ListOfDeliveryChallan>) => {
      state.dclist = Some(DeliveryChallanList.map((dclist) => dclist));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.dclist = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const {
  initializeDC,
  loadDeliverychallans,
  changePage,
  setSearch
} = slice.actions;

export default slice.reducer;
