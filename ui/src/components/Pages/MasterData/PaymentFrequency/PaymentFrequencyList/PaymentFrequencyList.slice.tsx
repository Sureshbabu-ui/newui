import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentFrequencyList, PaymentFrequencyDetails } from '../../../../../types/paymentFrequency';

export interface paymentFrequencyList {
  paymentFrequency: PaymentFrequencyDetails;
}

export interface PaymentFrequenciesListState {
  paymentFrequencies: Option<readonly paymentFrequencyList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
  createPaymentFrequenciesModalStatus: boolean;
}

const initialState: PaymentFrequenciesListState = {
  paymentFrequencies: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage: 0,
  createPaymentFrequenciesModalStatus: false,
};
const slice = createSlice({
  name: 'paymentfrequencylist',
  initialState,
  reducers: {
    initializePaymentFrequencyList: () => initialState,
    loadPaymentFrequencies: (state, { payload: { PaymentFrequencyList, TotalRows, PerPage } }: PayloadAction<PaymentFrequencyList>) => {
      state.paymentFrequencies = Some(PaymentFrequencyList.map((paymentFrequency) => ({ paymentFrequency })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.paymentFrequencies = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializePaymentFrequencyList, loadPaymentFrequencies, changePage, setSearch } = slice.actions;
export default slice.reducer;