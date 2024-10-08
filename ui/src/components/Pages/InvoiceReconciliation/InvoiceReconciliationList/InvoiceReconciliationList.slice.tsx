import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InvoiceReconciliationList, InvoiceReconciliationListDetail } from '../../../../types/invoiceReconciliation';

export interface InvoiceReconciliations {
  invoiceReconciliation: InvoiceReconciliationListDetail;
}

export interface InvoiceReconciliationsListState {
  invoiceReconciliations: Option<readonly InvoiceReconciliations[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage:number;
}

const initialState: InvoiceReconciliationsListState = {
  invoiceReconciliations: None,
  currentPage: 1, 
  search: null,
  totalRows: 0,
  perPage:0
};
const slice = createSlice({
  name: 'invoicereconciliationlist',
  initialState,
  reducers: {
    initializeInvoiceReconciliationsList: () => initialState,

    loadInvoiceReconciliations: (state, { payload: { InvoiceReconciliationList, TotalRows, PerPage } }: PayloadAction<InvoiceReconciliationList>) => {
      state.invoiceReconciliations = Some(InvoiceReconciliationList.map((invoiceReconciliation) => ({ invoiceReconciliation })));
      state.totalRows = TotalRows;
      state.perPage=PerPage;
    },

    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.invoiceReconciliations = None;
    },

    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeInvoiceReconciliationsList, loadInvoiceReconciliations, changePage, setSearch } = slice.actions;
export default slice.reducer;
