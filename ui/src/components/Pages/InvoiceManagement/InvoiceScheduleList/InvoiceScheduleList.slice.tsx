import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { InvoiceScheduleList, InvoiceScheduleListDetails, InvoiceSearchForFilter } from '../../../../types/invoice';

export interface invoiceScheduleList {
  invoiceSchedule: InvoiceScheduleListDetails;
}

export interface InvoiceSchedulesListState {
  InvoiceSchedules: Option<readonly invoiceScheduleList[]>;
  totalRows: number;
  currentPage: number;
  perPage:number;
  filters: InvoiceSearchForFilter;
  searchWith:any;
}

const initialState: InvoiceSchedulesListState = {
  InvoiceSchedules: None,
  filters: {
    SearchText:'',
    StartDate:``,
    EndDate:``
  },
  searchWith:'ContractNumber',
  totalRows: 0,
  currentPage:1,
  perPage:10
};
const slice = createSlice({
  name: 'invoiceschedulelist',
  initialState,
  reducers: {
    initializeInvoiceScheduleList: () => initialState,
    loadInvoiceSchedules: (state, { payload: { InvoiceScheduleList, TotalRows,PerPage } }: PayloadAction<InvoiceScheduleList>) => {
      state.InvoiceSchedules = Some(InvoiceScheduleList.map((invoiceSchedule) => ({ invoiceSchedule })));
      state.totalRows = TotalRows;
      state.perPage=PerPage
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.InvoiceSchedules = None;
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof InvoiceSchedulesListState['filters']; value: any }>) => {
      state.filters[name] = value;
    },
    setFilter: (state, { payload: Search }: PayloadAction<any>) => {
      state.searchWith = Search.value; 
      state.currentPage = 1; 
      state.filters.EndDate=''
      state.filters.StartDate=''
      state.filters.SearchText=''
    }
  },
});

export const { initializeInvoiceScheduleList,changePage,setFilter,updateField, loadInvoiceSchedules } = slice.actions;
export default slice.reducer;