import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { ContractInvoicePendingReasonAdd } from '../../../../../../types/contractInvoice';

export interface InvoicePendingState {
  pendingReason: ContractInvoicePendingReasonAdd
  errors: ValidationErrors;
  submitted: boolean;
  displayInformationModal: boolean;
}

const initialState: InvoicePendingState = {
  pendingReason: {
    InvoicePendingReason  : '',
    ContractInvoiceId:null
  },
  errors: {},
  submitted: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'invoicependingreason',
  initialState,
  reducers: {
    initializePendingReason: () => initialState,
    updateField: (
      state, 
      { payload: { name, value } }: PayloadAction<{ name: keyof InvoicePendingState['pendingReason']; value: string }>
    ) => {
      state.pendingReason[name] = value;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    formSubmitted: (state) => {
      state.submitted = true;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
  },
  },
});

export const { initializePendingReason, updateField, updateErrors, formSubmitted,toggleInformationModalStatus } = slice.actions;

export default slice.reducer;
