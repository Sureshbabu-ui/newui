import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChequeCollectionDocumentUpload } from '../../../../../types/bankCollection';
import { ValidationErrors } from '../../../../../types/error';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../types/masterData';

export interface ChequeExcelUploadState {
  documents: ChequeCollectionDocumentUpload;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
  filteredTenantBankAccounts: valuesInMasterDataByTableDetailsSelect[]
}

const initialState: ChequeExcelUploadState = {
  documents: {
    TenantBankAccountId: 1,
    ChequeCollectionFile: null,
  },
  filteredTenantBankAccounts: [],
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'chequeexcelupload',
  initialState,
  reducers: {
    initializeChequeExcelUpload: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof ChequeExcelUploadState['documents']; value: any }>
    ) => {
      state.documents[name] = value;
    },

    loadTenantBankNames: (state, { payload: Banks }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.filteredTenantBankAccounts = Banks.MasterData
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
  initializeChequeExcelUpload,
  loadTenantBankNames,
  updateField,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
} = slice.actions;
export default slice.reducer;