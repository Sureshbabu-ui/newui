import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReceiptListDetail, ReceiptList } from '../../../../types/receipt';

export interface receiptList {
  receipt:ReceiptListDetail;
}

export interface ReceiptListState {
  receipts: Option<readonly receiptList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage:number;
  createReceiptModalStatus: boolean;
}

const initialState: ReceiptListState = {
  receipts: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage:0,
  createReceiptModalStatus: false,
  };
const slice = createSlice({
  name: 'receiptlist',
  initialState,
  reducers: {
    initializeReceiptList: () => initialState,
    loadReceipts: (state, { payload: { Receipts, TotalRows, PerPage } }: PayloadAction<ReceiptList>) => {
      state.receipts = Some(Receipts.map((receipt) => ({ receipt})));
      state.totalRows = TotalRows;
      state.perPage=PerPage;
    },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.receipts = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeReceiptList,loadReceipts, changePage, setSearch } = slice.actions;
export default slice.reducer;