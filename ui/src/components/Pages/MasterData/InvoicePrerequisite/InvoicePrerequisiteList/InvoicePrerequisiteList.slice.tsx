import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InvoicePrerequisiteListDetail, InvoicePrerequisiteList, InvoicePrerequisiteUpdate } from '../../../../../types/invoicePrerequisite';

export interface InvoicePrerequisiteListState {
  invoiceprerequisites: InvoicePrerequisiteListDetail[];
  invoiceprerequisite: InvoicePrerequisiteUpdate;
  currentPage: number;
  search: any;
  submitting: boolean;
  isUpdateDisabled: boolean;
  totalRows: number;
  perPage:number;
  displayInformationModal: boolean;
  createInvoicePrerequisiteModalStatus: boolean;
}

const initialState: InvoicePrerequisiteListState = {
  invoiceprerequisites: [],
  currentPage: 1,
  submitting: false,
  invoiceprerequisite: {
    Id: 0,
    IsActive: false
  },
  isUpdateDisabled: true,
  search: null,
  displayInformationModal: false,
  totalRows: 0,
  perPage:0,
  createInvoicePrerequisiteModalStatus: false,
};
const slice = createSlice({
  name: 'invoiceprerequisitelist',
  initialState,
  reducers: {
    initializeInvoicePrerequisiteList: () => initialState,
    updateField: (
      state,
      { payload: { Id, IsActive, Index } }: PayloadAction<{ Id: number, IsActive: boolean, Index: number }>
    ) => {
      state.invoiceprerequisite.Id = Id
      state.invoiceprerequisite.IsActive = IsActive
      state.invoiceprerequisites[Index] = {
        ...state.invoiceprerequisites[Index], IsActive: IsActive
      }
    },
    loadInvoicePrerequisites: (state, { payload: { InvoicePrerequisites, TotalRows, PerPage } }: PayloadAction<InvoicePrerequisiteList>) => {
      state.invoiceprerequisites = (InvoicePrerequisites.map((invoiceprerequisite) => (invoiceprerequisite)));
      state.totalRows = TotalRows;
      state.perPage=PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.invoiceprerequisites = [];
    },
    toggleUpdate: (state) => {
      state.isUpdateDisabled = !state.isUpdateDisabled;
    },
    setDetails: (state, { payload: data }: PayloadAction<InvoicePrerequisiteListState['invoiceprerequisite']>) => {
      state.invoiceprerequisite = data;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
      state.currentPage = 1;
    },
    startSubmitting: (state) => {
      state.submitting = true;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    stopSubmitting: (state) => {
      state.submitting = false;
    },
  },
});

export const { initializeInvoicePrerequisiteList, setDetails, stopSubmitting, startSubmitting, toggleUpdate, updateField, toggleInformationModalStatus, loadInvoicePrerequisites, changePage, setSearch } = slice.actions;
export default slice.reducer;