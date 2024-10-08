import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InvoiceReconciliationTaxFileUpload } from '../../../../types/invoiceReconciliation';
import { ValidationErrors } from '../../../../types/error';

export interface InvoiceReconciliationTaxUploadState {
  documents: InvoiceReconciliationTaxFileUpload;
  errors: ValidationErrors;
  submitting: boolean; 
  displayInformationModal: boolean;
}

const initialState: InvoiceReconciliationTaxUploadState = {
  documents: {
    CollectionFile: null,
    TaxType:null
  },
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'invoicereconciliationtaxupload',
  initialState,
  reducers: {
    initializeTaxUpload: () => initialState,

    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof InvoiceReconciliationTaxUploadState['documents']; value: any }>
    ) => {
      state.documents[name] = value;
    },
    
    setTaxType: (state, { payload: type }: PayloadAction<string>) => {
        state.documents.TaxType = type;
    },

    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors; 
    },

    startSubmitting: (state) => {
      state.submitting = true;
    },

    stopSubmitting: (state) => {
      state.submitting = false;
    },

    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
  },
});

export const {
  initializeTaxUpload,
  updateField,
  setTaxType,
  updateErrors,  
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
} = slice.actions;
export default slice.reducer;