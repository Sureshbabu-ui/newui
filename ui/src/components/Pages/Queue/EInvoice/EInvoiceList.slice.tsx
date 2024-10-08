import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EInvoiceList, EInvoiceListDetail } from '../../../../types/eInvoice';

export interface EInvoices {
  eInvoice: EInvoiceListDetail;
}

export interface EInvoicesListState {
  eInvoices: Option<readonly EInvoices[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage:number;
}

const initialState: EInvoicesListState = {
  eInvoices: None,
  currentPage: 1, 
  search: null,
  totalRows: 0,
  perPage:0,
};
const slice = createSlice({
  name: 'einvoicelist',
  initialState,
  reducers: {
    initializeEInvoicesList: () => initialState,

    loadEInvoices: (state, { payload: { EInvoiceList, TotalRows, PerPage } }: PayloadAction<EInvoiceList>) => {
      state.eInvoices = Some(EInvoiceList.map((eInvoice) => ({ eInvoice })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },

    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.eInvoices = None;
    },

    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeEInvoicesList, loadEInvoices, changePage, setSearch } = slice.actions;
export default slice.reducer;
